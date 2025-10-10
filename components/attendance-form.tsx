"use client"

import * as React from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"

export function AttendanceForm() {
  const [name, setName] = React.useState("")
  const [submitting, setSubmitting] = React.useState(false)
  const [success, setSuccess] = React.useState(false)

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const trimmed = name.trim()
    if (!trimmed) {
      return
    }
    setSubmitting(true)
    setSuccess(false)
    try {
      const res = await fetch("/api/attendance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: trimmed }),
      })
      if (!res.ok) throw new Error("Failed to submit")
      setSuccess(true)
      setName("")
    } catch (err) {
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-3">
      <div className="flex flex-col gap-2">
        <Label htmlFor="full-name" className="sr-only">
          Full name
        </Label>
        <Input
          id="full-name"
          name="full-name"
          placeholder="Enter your full name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="h-12 rounded-lg text-base md:h-12"
          aria-required="true"
          autoComplete="name"
        />
      </div>
      <Button
        type="submit"
        disabled={submitting}
        className="h-12 w-full rounded-lg text-base transition-transform hover:-translate-y-0.5 active:translate-y-0 md:h-12"
      >
        {submitting ? "Submitting…" : "Submit"}
      </Button>

      {success && (
        <p role="status" className="mt-1 text-center text-sm text-green-600 dark:text-green-400">
          Thank you, your entry has been recorded!
        </p>
      )}
    </form>
  )
}
