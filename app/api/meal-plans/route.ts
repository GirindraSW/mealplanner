import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

function db() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!
  );
}

export async function GET() {
  try {
    const { data, error } = await db()
      .from("meal_plans")
      .select("id, created_at, goals, allergies, preferences, checked_items, plan")
      .order("created_at", { ascending: false });

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json(data);
  } catch (err) {
    console.error("[meal-plans GET]", err);
    return NextResponse.json({ error: "Gagal mengambil data" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { goals, allergies, preferences, plan, checked_items } = await req.json();

    const { data, error } = await db()
      .from("meal_plans")
      .insert({ goals, allergies, preferences, plan, checked_items })
      .select("id")
      .single();

    if (error) {
      console.error("[meal-plans POST] supabase error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json(data, { status: 201 });
  } catch (err) {
    console.error("[meal-plans POST] unhandled:", err);
    return NextResponse.json({ error: "Gagal menyimpan plan" }, { status: 500 });
  }
}
