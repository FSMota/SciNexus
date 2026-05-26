import Link from 'next/link'
import { ArrowRight, Sparkles } from 'lucide-react'

import { Button } from '@/components/ui/button'

const highlights = [
  'Agenda e submissão integradas',
  'Certificados automáticos',
  'Peer review centralizado',
]

export default function Home() {
  return (
    <main className="min-h-screen bg-hero text-white">
      <header className="border-b border-white/10 bg-white/95 text-slate-900 backdrop-blur">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-slate-900 via-primary to-sky-700 shadow-elegant">
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
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(91,150,255,0.32),_transparent_34%),radial-gradient(circle_at_bottom_left,_rgba(12,23,52,0.65),_transparent_42%)]" />
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
    </main>
  )
}
