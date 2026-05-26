import type { ReactNode } from 'react'
import { Sparkles } from 'lucide-react'

import { Card, CardContent } from '@/components/ui/card'

type AuthShellProps = {
  title: string
  description: string
  children: ReactNode
  showBadge?: boolean
}

export function AuthShell({
  title,
  description,
  children,
  showBadge = true,
}: AuthShellProps) {
  return (
    <main className="relative mx-auto flex min-h-screen w-full max-w-7xl items-center px-4 py-12 sm:px-6 lg:px-8">
      {showBadge ? (
        <div className="absolute left-8 top-8 hidden rounded-full border border-border/70 bg-card/80 px-4 py-2 text-xs font-medium uppercase tracking-[0.28em] text-muted-foreground shadow-sm backdrop-blur md:inline-flex">
          <Sparkles className="mr-2 h-4 w-4 text-primary" />
          Navy Trust
        </div>
      ) : null}

      <div className="mx-auto w-full max-w-md">
        <div className="mb-8 text-center">
          <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-linear-to-br from-primary via-primary to-primary-glow shadow-elegant">
            <svg
              className="h-8 w-8 text-white"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm0 18a8 8 0 1 1 8-8 8 8 0 0 1-8 8z" />
            </svg>
          </div>
          <h1 className="text-3xl font-semibold tracking-tight text-foreground">
            {title}
          </h1>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>

        <Card className="border-border/80 bg-card/96 shadow-elegant backdrop-blur">
          <CardContent className="pt-6">{children}</CardContent>
        </Card>
      </div>
    </main>
  )
}