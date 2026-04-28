import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

function db() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!
  );
}

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { data, error } = await db()
      .from("meal_plans")
      .select("*")
      .eq("id", id)
      .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 404 });
    return NextResponse.json(data);
  } catch (err) {
    console.error("[meal-plans GET/:id]", err);
    return NextResponse.json({ error: "Gagal mengambil plan" }, { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { checked_items } = await req.json();

    const { error } = await db()
      .from("meal_plans")
      .update({ checked_items })
      .eq("id", id);

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[meal-plans PATCH/:id]", err);
    return NextResponse.json({ error: "Gagal update checklist" }, { status: 500 });
  }
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { error } = await db()
      .from("meal_plans")
      .delete()
      .eq("id", id);

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[meal-plans DELETE/:id]", err);
    return NextResponse.json({ error: "Gagal menghapus plan" }, { status: 500 });
  }
}
