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
          className="min-h-12 w-full justify-between whitespace-normal rounded-sm bg-primary px-5 py-3 text-left text-sm font-semibold tracking-[0.02em] text-primary-foreground shadow-[0_22px_40px_-28px_rgba(4,22,39,0.72)] hover:bg-primary/94 sm:w-auto"
        >
          Try the guided setup
          <ArrowRight className="size-4" />
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full border-l border-l-border/70 bg-background/96 px-6 backdrop-blur-xl sm:max-w-2xl">
        <SheetHeader className="space-y-3">
          <div className="inline-flex size-12 items-center justify-center border border-border/80 bg-[color:rgb(229_226_218_/_76%)] text-primary">
            <Sparkles className="size-5" />
          </div>
          <SheetTitle className="text-3xl font-medium tracking-[-0.04em] text-primary">
            A gentle first run
          </SheetTitle>
          <SheetDescription className="max-w-xl text-base leading-8 text-muted-foreground">
            If you are starting from a blank folder, this is the shortest route
            to a trustworthy workflow: scaffold the repo, write the plan, ship
            on a ticket branch, then prove what changed.
          </SheetDescription>
        </SheetHeader>

        <div className="mt-8 space-y-5">
          {setupSteps.map((step) => (
            <article
              key={step.number}
              className="archive-card p-5"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="archive-kicker text-primary/42">
                    Step {step.number}
                  </p>
                  <h3 className="mt-3 text-2xl leading-tight font-medium tracking-[-0.03em] text-primary">
                    {step.title}
                  </h3>
                </div>
                <span className="inline-flex h-10 w-10 items-center justify-center border border-border/80 text-sm font-semibold text-primary">
                  {step.number}
                </span>
              </div>
              <p className="mt-4 text-sm leading-7 text-muted-foreground">
                {step.details}
              </p>
              <ul className="mt-5 flex flex-wrap gap-2">
                {step.commands.map((command) => (
                  <li
                    key={command}
                    className="bg-[color:rgb(229_226_218_/_68%)] px-3 py-1.5 font-mono text-xs text-foreground"
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
