import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"

export function Navbar() {
  return (
    <header className="fixed inset-x-0 top-0 z-30 border-b border-input bg-neutral-950/80 backdrop-blur-md">
      <nav className="mx-auto flex h-12 w-full max-w-5xl items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <Image src="/images/dss-logo.png" alt="Data Science Society logo" width={28} height={28} priority />
          <span className="text-sm font-medium md:text-base text-white">Data Science Society</span>
        </div>
        <Button asChild className="h-9 px-3 md:h-9 md:px-4 bg-white/40 text-white hover:bg-white/20">
          <Link href="https://dss-bu.vercel.app" target="_blank" rel="noopener noreferrer">
            DSS Website
          </Link>
        </Button>
      </nav>
    </header>
  )
}
