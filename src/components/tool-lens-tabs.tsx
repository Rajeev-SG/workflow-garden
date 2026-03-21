"use client"

import { Badge } from "@/components/ui/badge"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import { toolLenses } from "@/data/site-content"

export function ToolLensTabs() {
  return (
    <Tabs defaultValue={toolLenses[0].id} className="w-full">
      <TabsList className="grid !h-auto w-full grid-cols-2 items-stretch gap-2 rounded-[1.5rem] bg-transparent p-0 lg:grid-cols-4">
        {toolLenses.map((lens, index) => (
          <TabsTrigger
            key={lens.id}
            value={lens.id}
            className="h-auto min-h-16 whitespace-normal items-center justify-center gap-2 rounded-[1.35rem] border border-border/70 bg-white/75 px-3 py-3 text-center text-sm leading-snug data-[state=active]:border-primary/60 data-[state=active]:bg-white data-[state=active]:text-foreground data-[state=active]:shadow-[0_18px_40px_-28px_rgba(55,74,48,0.45)]"
          >
            <span className="text-[0.68rem] uppercase tracking-[0.28em] text-muted-foreground">
              0{index + 1}
            </span>
            <span className="text-sm font-semibold text-foreground">
              {lens.label}
            </span>
          </TabsTrigger>
        ))}
      </TabsList>

      {toolLenses.map((lens) => (
        <TabsContent
          key={lens.id}
          value={lens.id}
          className="mt-4 rounded-[2rem] border border-border/70 bg-white/88 p-6 shadow-[0_26px_70px_-38px_rgba(44,63,57,0.4)] md:mt-6 md:p-8"
        >
          <div className="grid gap-8 xl:grid-cols-[0.88fr_1.12fr]">
            <div className="space-y-4">
              <Badge
                variant="outline"
                className="rounded-full border-primary/30 bg-primary/8 px-3 py-1 text-[0.68rem] uppercase tracking-[0.28em] text-primary"
              >
                {lens.label}
              </Badge>
              <h3 className="max-w-xl text-3xl leading-tight font-semibold text-foreground">
                {lens.headline}
              </h3>
              <p className="max-w-xl text-lg leading-8 text-muted-foreground">
                {lens.summary}
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              {lens.tools.map((tool) => (
                <article
                  key={tool.name}
                  className="rounded-[1.5rem] border border-border/65 bg-[color:color-mix(in_oklab,var(--background)_80%,white_20%)] p-5"
                >
                  <p className="text-sm uppercase tracking-[0.22em] text-muted-foreground">
                    {tool.name}
                  </p>
                  <p className="mt-3 text-base leading-7 text-foreground">
                    {tool.useCase}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </TabsContent>
      ))}
    </Tabs>
  )
}
