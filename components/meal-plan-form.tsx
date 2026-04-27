"use client";

import { useState, KeyboardEvent } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { X, Loader2, ChevronRight, ArrowLeftRight, FileDown } from "lucide-react";

type Meal = {
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
};

type MealPlan = {
  days: Array<{
    day: string;
    meals: {
      breakfast: Meal;
      lunch: Meal;
      dinner: Meal;
      snacks: Meal[];
    };
  }>;
  groceryList: Array<{ category: string; items: string[] }>;
  nutritionSummary: { calories: number; protein: number; carbs: number; fats: number };
};

function TagInput({
  label,
  placeholder,
  tags,
  onChange,
}: {
  label: string;
  placeholder: string;
  tags: string[];
  onChange: (tags: string[]) => void;
}) {
  const [inputValue, setInputValue] = useState("");

  const addTag = (value: string) => {
    const tag = value.trim().replace(/,$/, "");
    if (tag && !tags.includes(tag)) {
      onChange([...tags, tag]);
    }
    setInputValue("");
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addTag(inputValue);
    }
    if (e.key === "Backspace" && !inputValue && tags.length > 0) {
      onChange(tags.slice(0, -1));
    }
  };

  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <div className="flex flex-wrap gap-2 p-2 border rounded-md min-h-10 border-input bg-background focus-within:ring-1 focus-within:ring-ring">
        {tags.map((tag, i) => (
          <Badge key={i} variant="secondary" className="gap-1">
            {tag}
            <button
              type="button"
              onClick={() => onChange(tags.filter((_, idx) => idx !== i))}
            >
              <X className="h-3 w-3" />
            </button>
          </Badge>
        ))}
        <input
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={() => inputValue.trim() && addTag(inputValue)}
          placeholder={tags.length === 0 ? placeholder : "Tambah lagi..."}
          className="flex-1 min-w-24 bg-transparent outline-none text-sm"
        />
      </div>
      <p className="text-xs text-muted-foreground">Tekan Enter atau koma untuk menambah</p>
    </div>
  );
}

function MealPlanResult({
  plan,
  onReset,
  goals,
  allergies,
  preferences,
}: {
  plan: MealPlan;
  onReset: () => void;
  goals: string;
  allergies: string[];
  preferences: string[];
}) {
  const [expandedDay, setExpandedDay] = useState<number | null>(0);
  const [days, setDays] = useState(plan.days);
  const [swapFrom, setSwapFrom] = useState<number | null>(null);
  const [checkedItems, setCheckedItems] = useState<Set<string>>(new Set());
  const { nutritionSummary, groceryList } = plan;

  const toggleItem = (key: string) => {
    setCheckedItems((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };

  const handleExportPDF = () => {
    const win = window.open("", "_blank");
    if (!win) return;

    const allDays = days
      .map(
        (d) => `
        <div class="day">
          <h3>${d.day}</h3>
          <table>
            <tr><td class="label">Sarapan</td><td>${d.meals.breakfast.name}</td><td class="kcal">${d.meals.breakfast.calories} kcal</td></tr>
            <tr><td class="label">Makan Siang</td><td>${d.meals.lunch.name}</td><td class="kcal">${d.meals.lunch.calories} kcal</td></tr>
            <tr><td class="label">Makan Malam</td><td>${d.meals.dinner.name}</td><td class="kcal">${d.meals.dinner.calories} kcal</td></tr>
            ${d.meals.snacks.map((s) => `<tr><td class="label">Snack</td><td>${s.name}</td><td class="kcal">${s.calories} kcal</td></tr>`).join("")}
          </table>
        </div>`
      )
      .join("");

    const grocery = groceryList
      .map(
        (cat) => `
        <div class="grocery-cat">
          <h4>${cat.category}</h4>
          <ul>${cat.items.map((item) => `<li>${item}</li>`).join("")}</ul>
        </div>`
      )
      .join("");

    win.document.write(`<!DOCTYPE html>
<html lang="id"><head>
<meta charset="UTF-8"/>
<title>Meal Plan 7 Hari</title>
<style>
  * { margin:0; padding:0; box-sizing:border-box; }
  body { font-family: Arial, sans-serif; font-size: 12px; color: #111; padding: 32px; }
  h1 { font-size: 20px; margin-bottom: 4px; }
  .subtitle { color: #555; margin-bottom: 24px; font-size: 11px; }
  .section-title { font-size: 15px; font-weight: bold; margin: 24px 0 10px; border-bottom: 2px solid #111; padding-bottom: 4px; }
  .nutrition { display: flex; gap: 12px; margin-bottom: 8px; }
  .nutrition-box { border: 1px solid #ddd; border-radius: 6px; padding: 10px 16px; text-align: center; flex: 1; }
  .nutrition-box .val { font-size: 18px; font-weight: bold; color: #16a34a; }
  .nutrition-box .unit { font-size: 10px; color: #888; }
  .nutrition-box .lbl { font-size: 11px; margin-top: 2px; }
  .day { margin-bottom: 14px; page-break-inside: avoid; }
  .day h3 { font-size: 13px; font-weight: bold; background: #f3f4f6; padding: 5px 8px; border-radius: 4px; margin-bottom: 4px; }
  table { width: 100%; border-collapse: collapse; }
  td { padding: 4px 8px; border-bottom: 1px solid #f0f0f0; vertical-align: top; }
  td.label { color: #666; font-size: 11px; width: 90px; }
  td.kcal { text-align: right; color: #888; font-size: 11px; white-space: nowrap; }
  .grocery { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
  .grocery-cat h4 { font-size: 12px; font-weight: bold; margin-bottom: 6px; }
  .grocery-cat ul { list-style: none; }
  .grocery-cat li { padding: 3px 0; font-size: 11px; color: #444; display: flex; align-items: center; gap: 6px; }
  .grocery-cat li::before { content: "☐"; font-size: 13px; }
  @media print { body { padding: 16px; } }
</style>
</head><body>
<h1>Meal Plan 7 Hari</h1>
<p class="subtitle">Dicetak pada ${new Date().toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}</p>

<div class="section-title">Ringkasan Nutrisi Harian</div>
<div class="nutrition">
  <div class="nutrition-box"><div class="val">${nutritionSummary.calories}</div><div class="unit">kcal</div><div class="lbl">Kalori</div></div>
  <div class="nutrition-box"><div class="val">${nutritionSummary.protein}</div><div class="unit">g</div><div class="lbl">Protein</div></div>
  <div class="nutrition-box"><div class="val">${nutritionSummary.carbs}</div><div class="unit">g</div><div class="lbl">Karbohidrat</div></div>
  <div class="nutrition-box"><div class="val">${nutritionSummary.fats}</div><div class="unit">g</div><div class="lbl">Lemak</div></div>
</div>

<div class="section-title">Jadwal Makan</div>
${allDays}

<div class="section-title">Daftar Belanja</div>
<div class="grocery">${grocery}</div>
</body></html>`);

    win.document.close();
    win.focus();
    setTimeout(() => win.print(), 300);
  };

  const handleSwapClick = (e: React.MouseEvent, i: number) => {
    e.stopPropagation();

    // swap content day to another day
    if (swapFrom === null) {
      setSwapFrom(i);
    } else if (swapFrom === i) {
      setSwapFrom(null);
    } else {
      setDays((prev) => {
        const next = [...prev];
        const tempMeals = next[swapFrom].meals;
        next[swapFrom] = { ...next[swapFrom], meals: next[i].meals };
        next[i] = { ...next[i], meals: tempMeals };
        return next;
      });
      setSwapFrom(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Input Review */}
      <Card className="border-dashed">
        <CardContent className="pt-4 pb-4 space-y-2">
          <div className="flex gap-2">
            <span className="text-xs text-muted-foreground w-20 shrink-0 pt-0.5">Tujuan</span>
            <p className="text-sm">{goals}</p>
          </div>
          {allergies.length > 0 && (
            <div className="flex gap-2 items-start">
              <span className="text-xs text-muted-foreground w-20 shrink-0 pt-0.5">Alergi</span>
              <div className="flex flex-wrap gap-1">
                {allergies.map((a) => (
                  <Badge key={a} variant="destructive" className="text-xs font-normal">{a}</Badge>
                ))}
              </div>
            </div>
          )}
          {preferences.length > 0 && (
            <div className="flex gap-2 items-start">
              <span className="text-xs text-muted-foreground w-20 shrink-0 pt-0.5">Preferensi</span>
              <div className="flex flex-wrap gap-1">
                {preferences.map((p) => (
                  <Badge key={p} variant="secondary" className="text-xs font-normal">{p}</Badge>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Nutrition Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Ringkasan Nutrisi Harian</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { label: "Kalori", value: nutritionSummary.calories, unit: "kcal" },
              { label: "Protein", value: nutritionSummary.protein, unit: "g" },
              { label: "Karbohidrat", value: nutritionSummary.carbs, unit: "g" },
              { label: "Lemak", value: nutritionSummary.fats, unit: "g" },
            ].map(({ label, value, unit }) => (
              <div key={label} className="text-center p-3 rounded-lg bg-muted">
                <p className="text-2xl font-bold text-primary">{value}</p>
                <p className="text-xs text-muted-foreground">{unit}</p>
                <p className="text-sm font-medium">{label}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Days */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-lg">Meal Plan 7 Hari</h3>
          {swapFrom !== null && (
            <p className="text-xs text-muted-foreground">
              Pilih hari tujuan untuk menukar dengan <span className="font-medium text-foreground">{days[swapFrom].day}</span>
            </p>
          )}
        </div>
        {days.map((day, i) => {
          const isSwapSource = swapFrom === i;
          const isSwapTarget = swapFrom !== null && swapFrom !== i;
          return (
            <Card
              key={i}
              className={`cursor-pointer transition-all ${
                isSwapSource
                  ? "ring-2 ring-primary"
                  : isSwapTarget
                  ? "ring-2 ring-dashed ring-muted-foreground/40 hover:ring-primary/60"
                  : ""
              }`}
              onClick={() => {
                if (swapFrom !== null && swapFrom !== i) {
                  handleSwapClick({ stopPropagation: () => {} } as React.MouseEvent, i);
                } else {
                  setExpandedDay(expandedDay === i ? null : i);
                }
              }}
            >
              <CardHeader className="py-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium">{day.day}</CardTitle>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span className="hidden sm:inline">{day.meals.breakfast.name}</span>
                    <button
                      type="button"
                      title={isSwapSource ? "Batal tukar" : "Tukar hari ini"}
                      onClick={(e) => handleSwapClick(e, i)}
                      className={`p-1 rounded hover:bg-muted transition-colors ${
                        isSwapSource ? "text-primary" : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      <ArrowLeftRight className="h-3.5 w-3.5" />
                    </button>
                    <ChevronRight
                      className={`h-4 w-4 transition-transform ${
                        expandedDay === i ? "rotate-90" : ""
                      }`}
                    />
                  </div>
                </div>
              </CardHeader>
              {expandedDay === i && (
                <CardContent className="pt-0 space-y-1">
                  {[
                    { label: "Sarapan", meal: day.meals.breakfast },
                    { label: "Makan Siang", meal: day.meals.lunch },
                    { label: "Makan Malam", meal: day.meals.dinner },
                  ].map(({ label, meal }) => (
                    <div
                      key={label}
                      className="flex items-center justify-between text-sm py-1.5 border-b last:border-0"
                    >
                      <div>
                        <span className="text-muted-foreground text-xs">{label}: </span>
                        <span>{meal.name}</span>
                      </div>
                      <Badge variant="outline" className="text-xs shrink-0 ml-2">
                        {meal.calories} kcal
                      </Badge>
                    </div>
                  ))}
                  {day.meals.snacks.map((snack, si) => (
                    <div
                      key={si}
                      className="flex items-center justify-between text-sm py-1.5 border-b last:border-0"
                    >
                      <div>
                        <span className="text-muted-foreground text-xs">Snack: </span>
                        <span>{snack.name}</span>
                      </div>
                      <Badge variant="outline" className="text-xs shrink-0 ml-2">
                        {snack.calories} kcal
                      </Badge>
                    </div>
                  ))}
                </CardContent>
              )}
            </Card>
          );
        })}
      </div>

      {/* Grocery List */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Daftar Belanja</CardTitle>
            <span className="text-xs text-muted-foreground">
              {checkedItems.size}/{groceryList.reduce((acc, c) => acc + c.items.length, 0)} item
            </span>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid sm:grid-cols-2 gap-6">
            {groceryList.map((category) => (
              <div key={category.category}>
                <h4 className="font-medium text-sm mb-2">{category.category}</h4>
                <ul className="space-y-1">
                  {category.items.map((item) => {
                    const key = `${category.category}-${item}`;
                    const checked = checkedItems.has(key);
                    return (
                      <li key={item}>
                        <label className="flex items-center gap-2 cursor-pointer group">
                          <input
                            type="checkbox"
                            checked={checked}
                            onChange={() => toggleItem(key)}
                            className="h-4 w-4 rounded border-input accent-primary shrink-0"
                          />
                          <span
                            className={`text-sm transition-colors ${
                              checked
                                ? "line-through text-muted-foreground/50"
                                : "text-muted-foreground group-hover:text-foreground"
                            }`}
                          >
                            {item}
                          </span>
                        </label>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="flex gap-3">
        <Button variant="outline" onClick={onReset} className="flex-1">
          Buat Meal Plan Baru
        </Button>
        <Button onClick={handleExportPDF} className="flex-1">
          <FileDown className="mr-2 h-4 w-4" />
          Export PDF
        </Button>
      </div>
    </div>
  );
}

export default function MealPlanForm() {
  const [goals, setGoals] = useState("");
  const [allergies, setAllergies] = useState<string[]>([]);
  const [preferences, setPreferences] = useState<string[]>([]);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [result, setResult] = useState<MealPlan | null>(null);
  const [error, setError] = useState("");

  const handleReset = () => {
    setStatus("idle");
    setResult(null);
    setGoals("");
    setAllergies([]);
    setPreferences([]);
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!goals.trim()) return;

    setStatus("loading");
    setError("");

    try {
      const res = await fetch("/api/generate-plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ goals, allergies, preferences }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Gagal generate plan");
      }

      setResult(data);
      setStatus("success");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Terjadi kesalahan");
      setStatus("error");
    }
  };

  if (status === "success" && result) {
    return <MealPlanResult plan={result} onReset={handleReset} goals={goals} allergies={allergies} preferences={preferences} />;
  }

  return (
    <Card>
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="goals">
              Tujuan Meal Plan <span className="text-destructive">*</span>
            </Label>
            <Textarea
              id="goals"
              value={goals}
              onChange={(e) => setGoals(e.target.value)}
              placeholder="Contoh: Turunkan berat badan 5kg dalam 2 bulan, tingkatkan massa otot, diet sehat untuk penderita diabetes..."
              rows={3}
              required
            />
          </div>

          <TagInput
            label="Alergi Makanan"
            placeholder="Contoh: kacang, susu, seafood..."
            tags={allergies}
            onChange={setAllergies}
          />

          <TagInput
            label="Preferensi Makanan"
            placeholder="Contoh: vegetarian, makanan Indonesia, rendah karbohidrat..."
            tags={preferences}
            onChange={setPreferences}
          />

          {status === "error" && error && (
            <p className="text-sm text-destructive">{error}</p>
          )}

          <Button
            type="submit"
            disabled={status === "loading" || !goals.trim()}
            className="w-full"
          >
            {status === "loading" ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Sedang membuat meal plan...
              </>
            ) : (
              "Buat Meal Plan"
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
