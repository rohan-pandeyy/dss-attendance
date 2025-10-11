import { NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";

export async function POST(req: Request) {
  try {
    const { name, github } = await req.json();
    const trimmedName = typeof name === "string" ? name.trim() : "";
    if (!trimmedName) {
      return NextResponse.json({ ok: false, error: "Name required" }, { status: 400 });
    }
    const trimmedGithub = typeof github === "string" ? github.trim() : null;

    const databaseUrl = process.env.DATABASE_URL;

    if (databaseUrl) {
      const sql = neon(databaseUrl);

      await sql/* sql */`
        CREATE TABLE IF NOT EXISTS attendance ( 
          id SERIAL PRIMARY KEY,
          name TEXT NOT NULL,
          github TEXT,
          created_at TIMESTAMPTZ NOT NULL
        );
      `;

      const rows = await sql/* sql */`
        INSERT INTO attendance (name, github, created_at)
        VALUES (
          ${trimmedName},
          ${trimmedGithub},
          TIMEZONE('Asia/Kolkata', NOW())
        )
        RETURNING id, name, github, created_at;
      `;

      const record = rows[0];

      return NextResponse.json(
        { ok: true, stored: "neon", record },
        { status: 201 }
      );
    } else {
      // Mock fallback
      console.log("[attendance] mock store -> name:", trimmedName, "github:", trimmedGithub);
      const created_at_ist = new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" });
      return NextResponse.json(
        { ok: true, stored: "mock", record: { name: trimmedName, github: trimmedGithub, created_at_ist } },
        { status: 200 }
      );
    }
  } catch (err) {
    console.error("[attendance] error:", err);
    return NextResponse.json({ ok: false, error: "Server error" }, { status: 500 });
  }
}

