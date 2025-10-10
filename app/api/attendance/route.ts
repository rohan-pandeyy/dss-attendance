import { NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";

export async function POST(req: Request) {
  try {
    const { name } = await req.json();
    const trimmed = typeof name === "string" ? name.trim() : "";
    if (!trimmed) {
      return NextResponse.json({ ok: false, error: "Name required" }, { status: 400 });
    }

    const databaseUrl = process.env.DATABASE_URL;

    if (databaseUrl) {
      const sql = neon(databaseUrl);

      await sql/* sql */`
        CREATE TABLE IF NOT EXISTS attendance (
          id SERIAL PRIMARY KEY,
          name TEXT NOT NULL,
          created_at TIMESTAMPTZ NOT NULL
        );
      `;

      const rows = await sql/* sql */`
        INSERT INTO attendance (name, created_at)
        VALUES (
          ${trimmed},
          TIMEZONE('Asia/Kolkata', NOW())
        )
        RETURNING id, name, created_at;
      `;

      const record = rows[0];

      return NextResponse.json(
        { ok: true, stored: "neon", record },
        { status: 201 }
      );
    } else {
      // Mock fallback
      console.log("[attendance] mock store -> name:", trimmed);
      const created_at_ist = new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" });
      return NextResponse.json(
        { ok: true, stored: "mock", record: { name: trimmed, created_at_ist } },
        { status: 200 }
      );
    }
  } catch (err) {
    console.error("[attendance] error:", err);
    return NextResponse.json({ ok: false, error: "Server error" }, { status: 500 });
  }
}
