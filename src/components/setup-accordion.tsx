"use client"

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { setupSteps } from "@/data/site-content"

export function SetupAccordion() {
  return (
    <Accordion type="single" collapsible className="w-full">
      {setupSteps.map((step) => (
        <AccordionItem
          key={step.number}
          value={step.number}
          className="border-border/60"
        >
          <AccordionTrigger className="gap-4 py-5 text-left hover:no-underline">
            <span className="flex items-start gap-4">
              <span className="inline-flex size-11 shrink-0 items-center justify-center rounded-full border border-primary/30 bg-primary/8 text-sm font-semibold text-primary">
                {step.number}
              </span>
              <span className="space-y-1">
                <span className="block text-lg font-semibold text-foreground">
                  {step.title}
                </span>
                <span className="block text-sm leading-6 text-muted-foreground">
                  {step.summary}
                </span>
              </span>
            </span>
          </AccordionTrigger>
          <AccordionContent className="space-y-4 pl-[3.75rem] text-base leading-7 text-muted-foreground">
            <p>{step.details}</p>
            <ul className="flex flex-wrap gap-2">
              {step.commands.map((command) => (
                <li
                  key={command}
                  className="rounded-full border border-border/70 bg-white/70 px-3 py-1.5 font-mono text-xs text-foreground"
                >
                  {command}
                </li>
              ))}
            </ul>
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  )
}
