import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Sparkles, Calendar, ShoppingCart, ChevronRight, Brain, Leaf } from "lucide-react";
import { cn } from "@/lib/utils";

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Navbar */}
      <header className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-2 font-bold text-xl">
            <Leaf className="h-6 w-6 text-primary" />
            MealMind
          </div>
          <Link href="/plan" className={buttonVariants({ size: "sm" })}>
            Buat Meal Plan
          </Link>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero */}
        <section className="py-20 px-4">
          <div className="container mx-auto max-w-3xl text-center space-y-6">
            <Badge variant="secondary" className="text-sm">
              <Sparkles className="mr-1 h-3.5 w-3.5" />
              AI-Powered Meal Planning
            </Badge>
            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight">
              Meal Plan Personal dalam{" "}
              <span className="text-primary">Hitungan Detik</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-xl mx-auto">
              Ceritakan tujuanmu, alergi, dan selera makan. AI kami akan membuat
              meal plan 7 hari lengkap dengan daftar belanja.
            </p>
            <Link
              href="/plan"
              className={cn(buttonVariants({ size: "lg" }), "gap-2")}
            >
              Buat Meal Plan Gratis
              <ChevronRight className="h-4 w-4" />
            </Link>
            <p className="text-sm text-muted-foreground">
              Gratis · Tidak perlu daftar · Langsung jadi
            </p>
          </div>
        </section>

        {/* Features */}
        <section className="py-16 px-4 bg-muted/30">
          <div className="container mx-auto max-w-5xl">
            <h2 className="text-2xl font-bold text-center mb-10">Apa yang kamu dapat?</h2>
            <div className="grid sm:grid-cols-3 gap-6">
              {[
                {
                  icon: Brain,
                  title: "Dipersonalisasi AI",
                  description:
                    "Disesuaikan dengan goal, alergi, dan preferensi makananmu secara otomatis.",
                },
                {
                  icon: Calendar,
                  title: "Rencana 7 Hari",
                  description:
                    "Sarapan, makan siang, makan malam, dan snack untuk seminggu penuh.",
                },
                {
                  icon: ShoppingCart,
                  title: "Daftar Belanja",
                  description:
                    "Grocery list otomatis berdasarkan meal plan yang sudah dibuat.",
                },
              ].map(({ icon: Icon, title, description }) => (
                <Card key={title} className="text-center">
                  <CardHeader>
                    <div className="mx-auto h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-2">
                      <Icon className="h-6 w-6 text-primary" />
                    </div>
                    <CardTitle className="text-base">{title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">{description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* How it works */}
        <section className="py-16 px-4">
          <div className="container mx-auto max-w-3xl">
            <h2 className="text-2xl font-bold text-center mb-10">Cara Kerja</h2>
            <div className="space-y-6">
              {[
                {
                  step: "1",
                  title: "Isi Formulir",
                  description:
                    "Ceritakan tujuanmu (turun berat badan, massa otot, dll.), alergi, dan preferensi makanan.",
                },
                {
                  step: "2",
                  title: "AI Bekerja",
                  description:
                    "Gemini AI menganalisis kebutuhanmu dan merancang meal plan yang optimal.",
                },
                {
                  step: "3",
                  title: "Dapatkan Plan",
                  description:
                    "Terima meal plan 7 hari lengkap beserta daftar belanja dalam hitungan detik.",
                },
              ].map(({ step, title, description }) => (
                <div key={step} className="flex gap-4">
                  <div className="h-10 w-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold shrink-0">
                    {step}
                  </div>
                  <div className="space-y-1 pt-1">
                    <h3 className="font-semibold">{title}</h3>
                    <p className="text-sm text-muted-foreground">{description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Bottom CTA */}
        <section className="py-16 px-4 bg-primary text-primary-foreground">
          <div className="container mx-auto max-w-2xl text-center space-y-4">
            <h2 className="text-3xl font-bold">Siap mulai?</h2>
            <p className="opacity-90">
              Buat meal plan personalmu sekarang, gratis tanpa perlu mendaftar.
            </p>
            <Link
              href="/plan"
              className={cn(buttonVariants({ variant: "secondary", size: "lg" }), "gap-2")}
            >
              Buat Meal Plan
              <ChevronRight className="h-4 w-4" />
            </Link>
          </div>
        </section>
      </main>

      <footer className="border-t py-6 px-4 text-center text-sm text-muted-foreground">
        <p>© 2026 MealMind · Dibuat dengan Next.js &amp; Gemini AI</p>
      </footer>
    </div>
  );
}
