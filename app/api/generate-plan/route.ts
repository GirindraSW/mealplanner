import { GoogleGenAI } from "@google/genai";
import { NextResponse } from "next/server";

type MealPlanRequest = {
  goals: string;
  allergies?: string[];
  preferences?: string[];
};

export async function POST(req: Request) {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "GEMINI_API_KEY belum diset di environment variables." },
        { status: 500 }
      );
    }

    const body = (await req.json()) as MealPlanRequest;
    const { goals, allergies = [], preferences = [] } = body;

    if (!goals?.trim()) {
      return NextResponse.json(
        { error: "Field 'goals' wajib diisi." },
        { status: 400 }
      );
    }

    const ai = new GoogleGenAI({ apiKey });

    // promt
    const prompt = `
Buat meal plan 7 hari berdasarkan data berikut:
- Goal: ${goals}
- Allergies: ${allergies.join(", ") || "Tidak ada"}
- Preferences: ${preferences.join(", ") || "Tidak ada"}

Kembalikan HANYA JSON valid dengan struktur:
{
  "days": [
    {
      "day": "Day 1",
      "meals": {
        "breakfast": { "name": "", "calories": 0, "protein": 0, "carbs": 0, "fats": 0 },
        "lunch": { "name": "", "calories": 0, "protein": 0, "carbs": 0, "fats": 0 },
        "dinner": { "name": "", "calories": 0, "protein": 0, "carbs": 0, "fats": 0 },
        "snacks": [{ "name": "", "calories": 0, "protein": 0, "carbs": 0, "fats": 0 }]
      }
    }
  ],
  "groceryList": [
    { "category": "Protein", "items": ["item 1", "item 2"] }
  ],
  "nutritionSummary": { "calories": 0, "protein": 0, "carbs": 0, "fats": 0 }
}
`.trim();

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: { responseMimeType: "application/json" },
    });

    let text: string | undefined;
    try {
      text = response.text;
    } catch (textErr) {
      console.error("[generate-plan] response.text threw:", textErr);
      return NextResponse.json(
        { error: "AI memblokir konten atau respons tidak valid." },
        { status: 502 }
      );
    }

    if (!text) {
      console.error("[generate-plan] response.text is empty. candidates:", JSON.stringify(response.candidates));
      return NextResponse.json(
        { error: "AI tidak mengembalikan konten." },
        { status: 502 }
      );
    }

    try {
      return NextResponse.json(JSON.parse(text));
    } catch {
      console.error("[generate-plan] JSON.parse failed. raw text:", text.slice(0, 500));
      return NextResponse.json(
        { error: "AI mengembalikan format yang tidak valid." },
        { status: 502 }
      );
    }
  } catch (err) {
    console.error("[generate-plan] unhandled error:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Gagal generate plan" },
      { status: 500 }
    );
  }
}