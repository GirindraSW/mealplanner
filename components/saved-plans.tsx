"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trash2, ChevronRight, ShoppingCart } from "lucide-react";
import type { SavedPlan } from "@/lib/types";

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default function SavedPlans({ initialPlans }: { initialPlans: SavedPlan[] }) {
  const [plans, setPlans] = useState(initialPlans);

  const handleDelete = async (id: string) => {
    const res = await fetch(`/api/meal-plans/${id}`, { method: "DELETE" });
    if (res.ok) setPlans((prev) => prev.filter((p) => p.id !== id));
  };

  if (plans.length === 0) {
    return (
      <div className="text-center py-20 text-muted-foreground">
        <ShoppingCart className="h-12 w-12 mx-auto mb-4 opacity-30" />
        <p className="font-medium">Belum ada plan tersimpan</p>
        <p className="text-sm mt-1">Buat meal plan dulu, lalu klik &ldquo;Simpan Plan&rdquo;</p>
        <Link href="/plan">
          <Button className="mt-6">Buat Meal Plan</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {plans.map((p) => {
        const totalItems = p.plan.groceryList.reduce((acc, c) => acc + c.items.length, 0);
        const checkedCount = p.checked_items.length;
        return (
          <Card key={p.id} className="group">
            <CardHeader className="py-3">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <p className="text-xs text-muted-foreground mb-1">{formatDate(p.created_at)}</p>
                  <CardTitle className="text-sm font-medium line-clamp-2">{p.goals}</CardTitle>
                  {(p.allergies.length > 0 || p.preferences.length > 0) && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {p.allergies.map((a) => (
                        <Badge key={a} variant="destructive" className="text-xs font-normal">{a}</Badge>
                      ))}
                      {p.preferences.map((pr) => (
                        <Badge key={pr} variant="secondary" className="text-xs font-normal">{pr}</Badge>
                      ))}
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <button
                    onClick={() => handleDelete(p.id)}
                    className="p-1.5 rounded text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors opacity-0 group-hover:opacity-100"
                    title="Hapus plan"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                  <Link href={`/saved/${p.id}`}>
                    <span className="p-1.5 rounded text-muted-foreground hover:text-foreground hover:bg-muted transition-colors flex items-center">
                      <ChevronRight className="h-4 w-4" />
                    </span>
                  </Link>
                </div>
              </div>
            </CardHeader>
            {totalItems > 0 && (
              <CardContent className="pt-0 pb-3">
                <div className="flex items-center gap-2">
                  <div className="flex-1 bg-muted rounded-full h-1.5">
                    <div
                      className="bg-primary h-1.5 rounded-full transition-all"
                      style={{ width: `${Math.round((checkedCount / totalItems) * 100)}%` }}
                    />
                  </div>
                  <span className="text-xs text-muted-foreground shrink-0">
                    {checkedCount}/{totalItems} item belanja
                  </span>
                </div>
              </CardContent>
            )}
          </Card>
        );
      })}
    </div>
  );
}
