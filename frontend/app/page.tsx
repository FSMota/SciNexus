import Link from 'next/link'
import { ArrowRight, CalendarDays, FileText, Medal, Sparkles, UsersRound } from 'lucide-react'

import { Button } from '@/components/ui/button'

const highlights = [
  'Agenda e submissão integradas',
  'Certificados automáticos',
  'Peer review centralizado',
]

const features = [
  {
    icon: CalendarDays,
    title: 'Eventos & cronograma',
    description: 'Crie eventos com agenda detalhada, datas e descrição.',
  },
  {
    icon: FileText,
    title: 'Submissão de artigos',
    description: 'Autores enviam PDFs diretamente pela plataforma.',
  },
  {
    icon: UsersRound,
    title: 'Peer-review',
    description: 'Distribuição automática para avaliadores com notas e comentários.',
  },
  {
    icon: Medal,
    title: 'Certificados',
    description: 'Geração instantânea em PDF para autores e participantes.',
  },
]

export default function Home() {
  return (
    <main className="min-h-screen bg-hero text-white">
      <header className="border-b border-white/10 bg-white/95 text-slate-900 backdrop-blur">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-linear-to-br from-slate-900 via-primary to-sky-700 shadow-elegant">
              <svg
                viewBox="0 0 24 24"
                className="h-7 w-7 text-white"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
              >
                <circle cx="12" cy="12" r="8.5" />
                <path d="M7.5 12h9M12 7.5v9M8.7 8.7l6.6 6.6M16.3 8.7l-6.6 6.6" />
              </svg>
            </div>
            <div className="leading-tight">
              <div className="text-2xl font-semibold tracking-tight">SciNexus</div>
              <div className="text-[11px] font-semibold uppercase tracking-[0.34em] text-slate-500">
                Eventos científicos, simplificados
              </div>
            </div>
          </Link>

          <nav className="flex items-center gap-3 sm:gap-4">
            <Button asChild variant="ghost" className="rounded-full px-4 text-slate-700 hover:bg-slate-100 hover:text-slate-950">
              <Link href="/login">Entrar</Link>
            </Button>
            <Button asChild className="rounded-full px-5 shadow-[0_10px_30px_-12px_rgba(15,23,42,0.55)]">
              <Link href="/register">Começar</Link>
            </Button>
          </nav>
        </div>
      </header>

      <section className="relative overflow-hidden">
        <div className="absolute inset-0 [radial-gradient(circle_at_top_right,rgba(91,150,255,0.32),transparent_34%),radial-gradient(circle_at_bottom_left,rgba(12,23,52,0.65),transparent_42%)]" />
        <div className="absolute inset-x-0 top-0 h-px bg-white/10" />

        <div className="relative mx-auto flex min-h-[calc(100vh-5rem)] max-w-7xl items-center px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
          <div className="max-w-3xl">
            <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-white/18 bg-white/8 px-4 py-2 text-sm font-medium uppercase tracking-[0.28em] text-white/80 backdrop-blur-sm">
              <Sparkles className="h-4 w-4" />
              Plataforma acadêmica
            </div>

            <h1 className="max-w-4xl text-5xl font-semibold leading-[1.02] tracking-[-0.04em] text-white sm:text-6xl lg:text-7xl">
              O ciclo completo do seu evento científico, em um só lugar.
            </h1>

            <p className="mt-8 max-w-2xl text-lg leading-8 text-white/75 sm:text-xl">
              Da criação da agenda à emissão de certificados, passando por submissão de artigos e peer-review, o SciNexus automatiza o que tira tempo dos pesquisadores.
            </p>

            <div className="mt-12 flex flex-col gap-4 sm:flex-row">
              <Button asChild size="lg" className="h-14 rounded-2xl bg-white px-7 text-base font-semibold text-slate-950 shadow-[0_18px_50px_-20px_rgba(255,255,255,0.7)] hover:bg-slate-100">
                <Link href="/register">
                  Criar conta gratuita
                  <ArrowRight className="h-5 w-5" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="h-14 rounded-2xl border-white/18 bg-white/6 px-7 text-base font-semibold text-white hover:bg-white/12 hover:text-white">
                <Link href="/login">Explorar eventos</Link>
              </Button>
            </div>

            <div className="mt-12 flex flex-wrap gap-3 text-sm text-white/80">
              {highlights.map((item) => (
                <div key={item} className="rounded-full border border-white/12 bg-white/8 px-4 py-2 backdrop-blur-sm">
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-background px-4 py-20 text-foreground sm:px-6 lg:px-8 lg:py-24">
        <div className="mx-auto max-w-7xl">
          <div className="mb-10 sm:mb-12">
            <p className="text-sm font-semibold uppercase tracking-[0.34em] text-primary">
              Funcionalidades
            </p>
            <h2 className="mt-3 max-w-3xl text-4xl font-semibold tracking-[-0.04em] text-foreground sm:text-5xl">
              Tudo que um congresso precisa.
            </h2>
          </div>

          <div className="overflow-hidden rounded-4xl border border-border/80 bg-card shadow-elegant">
            <div className="grid divide-y divide-border/80 md:grid-cols-2 md:divide-x md:divide-y">
              {features.map((feature) => {
                const Icon = feature.icon

                return (
                  <article
                    key={feature.title}
                    className="min-h-55 p-8 sm:p-10"
                  >
                    <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-muted text-primary shadow-sm">
                      <Icon className="h-6 w-6" />
                    </div>

                    <h3 className="mt-8 text-2xl font-semibold tracking-tight text-foreground">
                      {feature.title}
                    </h3>

                    <p className="mt-4 max-w-md text-base leading-8 text-muted-foreground">
                      {feature.description}
                    </p>
                  </article>
                )
              })}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-background px-4 pb-20 text-foreground sm:px-6 lg:px-8 lg:pb-24">
        <div className="mx-auto max-w-7xl">
          <div className="overflow-hidden rounded-4xl border border-border/70 bg-linear-to-br from-slate-950 via-primary to-sky-700 p-8 shadow-elegant sm:p-12 lg:p-16">
            <div className="max-w-4xl">
              <h2 className="max-w-3xl text-4xl font-semibold leading-[1.05] tracking-[-0.04em] text-white sm:text-5xl lg:text-6xl">
                Pronto para organizar seu próximo congresso?
              </h2>

              <p className="mt-6 max-w-2xl text-lg leading-8 text-white/75 sm:text-xl">
                Comece em minutos. Sem cartão de crédito.
              </p>

              <div className="mt-10">
                <Button
                  asChild
                  size="lg"
                  className="h-14 rounded-2xl bg-white px-8 text-base font-semibold text-slate-950 shadow-[0_18px_50px_-20px_rgba(255,255,255,0.8)] hover:bg-slate-100"
                >
                  <Link href="/register">Criar minha conta</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

    </main>
  )
}
