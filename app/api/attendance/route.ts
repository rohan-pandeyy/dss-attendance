import { NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"

export async function POST(req: Request) {
  try {
    const { name } = await req.json()
    const trimmed = typeof name === "string" ? name.trim() : ""
    if (!trimmed) {
      return NextResponse.json({ ok: false, error: "Name required" }, { status: 400 })
    }

    const databaseUrl = process.env.DATABASE_URL

    if (databaseUrl) {
      const sql = neon(databaseUrl)

      // Ensure table exists (idempotent)
      await sql /* sql */`
        CREATE TABLE IF NOT EXISTS attendance (
          id SERIAL PRIMARY KEY,
          name TEXT NOT NULL,
          created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
        );
      `

      await sql /* sql */`INSERT INTO attendance (name) VALUES (${trimmed});`

      return NextResponse.json({ ok: true, stored: "neon" }, { status: 201 })
    } else {
      // Mock behavior when DATABASE_URL is not provided yet
      console.log("[attendance] mock store -> name:", trimmed)
      return NextResponse.json({ ok: true, stored: "mock" }, { status: 200 })
    }
  } catch (err) {
    console.error("[attendance] error:", err)
    return NextResponse.json({ ok: false, error: "Server error" }, { status: 500 })
  }
}
