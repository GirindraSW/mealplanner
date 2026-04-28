import Link from "next/link";
import { ArrowLeft, Leaf } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { createClient } from "@supabase/supabase-js";
import SavedPlans from "@/components/saved-plans";
import type { SavedPlan } from "@/lib/types";

async function getPlans(): Promise<SavedPlan[]> {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!
  );
  const { data } = await supabase
    .from("meal_plans")
    .select("*")
    .order("created_at", { ascending: false });
  return data ?? [];
}

export default async function SavedPage() {
  const plans = await getPlans();

  return (
    <div className="min-h-screen flex flex-col">
      <header className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <Link href="/" className="flex items-center gap-2 font-bold text-xl">
            <Leaf className="h-6 w-6 text-primary" />
            MealMind
          </Link>
          <Link href="/" className={cn(buttonVariants({ variant: "ghost", size: "sm" }), "gap-2")}>
            <ArrowLeft className="h-4 w-4" />
            Beranda
          </Link>
        </div>
      </header>

      <main className="flex-1 py-10 px-4">
        <div className="container mx-auto max-w-2xl">
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold mb-2">Riwayat Meal Plan</h1>
            <p className="text-muted-foreground">Plan yang sudah kamu simpan sebelumnya</p>
          </div>
          <SavedPlans initialPlans={plans} />
        </div>
      </main>
    </div>
  );
}
