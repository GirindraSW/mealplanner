"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Leaf, Loader2 } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { MealPlanResult } from "@/components/meal-plan-form";
import type { SavedPlan } from "@/lib/types";

export default function SavedPlanPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [plan, setPlan] = useState<SavedPlan | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch(`/api/meal-plans/${id}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.error) setError(data.error);
        else setPlan(data);
      })
      .catch(() => setError("Gagal memuat plan"))
      .finally(() => setLoading(false));
  }, [id]);

  return (
    <div className="min-h-screen flex flex-col">
      <header className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <Link href="/" className="flex items-center gap-2 font-bold text-xl">
            <Leaf className="h-6 w-6 text-primary" />
            MealMind
          </Link>
          <Link href="/saved" className={cn(buttonVariants({ variant: "ghost", size: "sm" }), "gap-2")}>
            <ArrowLeft className="h-4 w-4" />
            Riwayat
          </Link>
        </div>
      </header>

      <main className="flex-1 py-10 px-4">
        <div className="container mx-auto max-w-2xl">
          {loading && (
            <div className="flex justify-center py-20">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          )}
          {error && (
            <p className="text-center text-destructive py-20">{error}</p>
          )}
          {plan && (
            <MealPlanResult
              plan={plan.plan}
              goals={plan.goals}
              allergies={plan.allergies}
              preferences={plan.preferences}
              initialPlanId={plan.id}
              initialCheckedItems={plan.checked_items}
            />
          )}
        </div>
      </main>
    </div>
  );
}
