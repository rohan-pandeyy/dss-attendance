import { Navbar } from "@/components/navbar"
import { AttendanceForm } from "@/components/attendance-form"

export default function Page() {
  return (
    <main className="relative min-h-dvh bg-background text-foreground">
      <Navbar />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          backgroundImage:
            "radial-gradient(1000px 600px at 15% -10%, color-mix(in oklch, var(--primary) 22%, transparent), transparent 60%), radial-gradient(800px 500px at 110% 0%, color-mix(in oklch, var(--primary) 10%, transparent), transparent 60%)",
        }}
      />
      <section className="mx-auto flex w-full max-w-md flex-col items-center px-4 pt-16 md:pt-20">
        <div className="w-full rounded-lg border border-input bg-card/80 p-6 shadow-lg backdrop-blur-md md:p-8">
          <div className="mb-4 text-center md:mb-6">
            <h1 className="text-balance text-2xl font-semibold md:text-3xl">Welcome!</h1>
            <p className="mt-2 text-sm text-muted-foreground">Please enter your full name to log attendance.</p>
          </div>
          <AttendanceForm />
        </div>
        <p className="mt-4 text-center text-xs text-muted-foreground">
          Your response will be recorded instantly. No page reload.
        </p>
      </section>
      {/* Spacer to ensure content clears fixed navbar on very small screens */}
      <div className="h-6" />
    </main>
  )
}
