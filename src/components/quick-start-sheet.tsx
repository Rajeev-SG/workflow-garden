"use client"

import { ArrowRight, Sparkles } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { setupSteps } from "@/data/site-content"

export function QuickStartSheet() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          size="lg"
          className="min-h-12 w-full whitespace-normal rounded-full bg-primary px-6 py-3 text-center text-sm font-semibold text-primary-foreground shadow-[0_18px_40px_-24px_rgba(55,74,48,0.6)] hover:bg-primary/92 sm:w-auto"
        >
          Try the guided setup
          <ArrowRight className="size-4" />
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full border-l-border/70 bg-[color:color-mix(in_oklab,var(--background)_86%,white_14%)] sm:max-w-xl">
        <SheetHeader className="space-y-3">
          <div className="inline-flex size-12 items-center justify-center rounded-full border border-primary/30 bg-primary/10 text-primary">
            <Sparkles className="size-5" />
          </div>
          <SheetTitle className="text-2xl font-semibold text-foreground">
            A gentle first run
          </SheetTitle>
          <SheetDescription className="text-base leading-7 text-muted-foreground">
            If you are starting from a blank folder, this is the shortest route
            to a trustworthy workflow: scaffold the repo, write the plan, ship
            on a ticket branch, then prove what changed.
          </SheetDescription>
        </SheetHeader>

        <div className="mt-8 space-y-5">
          {setupSteps.map((step) => (
            <article
              key={step.number}
              className="rounded-[1.5rem] border border-border/70 bg-white/80 p-5"
            >
              <p className="text-xs uppercase tracking-[0.28em] text-muted-foreground">
                Step {step.number}
              </p>
              <h3 className="mt-2 text-lg font-semibold text-foreground">
                {step.title}
              </h3>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                {step.details}
              </p>
              <ul className="mt-4 flex flex-wrap gap-2">
                {step.commands.map((command) => (
                  <li
                    key={command}
                    className="rounded-full border border-primary/20 bg-primary/8 px-3 py-1.5 font-mono text-xs text-foreground"
                  >
                    {command}
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </SheetContent>
    </Sheet>
  )
}
