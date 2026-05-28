'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import Link from 'next/link'
import { ArrowRight, CalendarDays, Filter, MapPin, Search } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { useEvents } from '@/hooks/useEvents'
import { CatalogEvent } from '@/lib/events'

import { categoryLabels, categoryStyles, sortOptions, type CategoryName } from './catalog-data'

type CatalogSectionProps = {
  variant?: 'compact' | 'full'
  showControls?: boolean
}

const compactVisibleCount = 4
const fullPageSize = 4
const fullInitialVisibleCount = 6

export function CatalogSection({ variant = 'compact', showControls = true }: CatalogSectionProps) {
  const [query, setQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<CategoryName | 'Todas'>('Todas')
  const [selectedSort, setSelectedSort] = useState<(typeof sortOptions)[number]>('Mais recentes')
  const [visibleCount, setVisibleCount] = useState(fullInitialVisibleCount)
  const sentinelRef = useRef<HTMLDivElement | null>(null)
  const { events, isLoading, error } = useEvents()

  const categoryCounts = useMemo(() => {
    const baseCounts = new Map<CategoryName, number>()

    for (const event of events) {
      baseCounts.set(event.category, (baseCounts.get(event.category) ?? 0) + 1)
    }

    return (Object.keys(categoryStyles) as CategoryName[]).map((name) => ({
      name,
      count: baseCounts.get(name) ?? 0,
    }))
  }, [])

  const filteredEvents = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase()

    const filtered = events.filter((event) => {
      const categoryMatches = selectedCategory === 'Todas' || event.category === selectedCategory
      const queryMatches =
        normalizedQuery.length === 0 ||
        [event.title, event.category, event.date, event.location, event.status, event.attendees, event.summary, event.tags.join(' ')]
          .join(' ')
          .toLowerCase()
          .includes(normalizedQuery)

      return categoryMatches && queryMatches
    })

    return filtered.sort((left, right) => {
      if (selectedSort === 'Em destaque') {
        if (left.highlight !== right.highlight) {
          return left.highlight ? -1 : 1
        }

        return right.sortDate.localeCompare(left.sortDate)
      }

      return right.sortDate.localeCompare(left.sortDate)
    })
  }, [events, query, selectedCategory, selectedSort])

  useEffect(() => {
    if (variant === 'full') {
      setVisibleCount(fullInitialVisibleCount)
    }
  }, [query, selectedCategory, selectedSort, variant])

  useEffect(() => {
    if (variant !== 'full') {
      return undefined
    }

    const sentinel = sentinelRef.current

    if (!sentinel) {
      return undefined
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries

        if (!entry?.isIntersecting) {
          return
        }

        setVisibleCount((current) => Math.min(current + fullPageSize, filteredEvents.length))
      },
      { rootMargin: '200px 0px' },
    )

    observer.observe(sentinel)

    return () => observer.disconnect()
  }, [filteredEvents.length, variant, visibleCount])

  const visibleEvents = variant === 'full' ? filteredEvents.slice(0, visibleCount) : filteredEvents.slice(0, compactVisibleCount)
  const remainingCount = Math.max(filteredEvents.length - visibleEvents.length, 0)

  const handleLoadMore = () => {
    setVisibleCount((current) => Math.min(current + fullPageSize, filteredEvents.length))
  }

  return (
    <section id="catalog" className="bg-background px-4 py-16 text-foreground sm:px-6 lg:px-8 lg:py-20">
      <div className="mx-auto max-w-7xl space-y-10">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h2 className="mt-3 text-3xl font-semibold tracking-[-0.04em] sm:text-4xl">
              {variant === 'full'
                ? 'Catálogo'
                : 'Eventos mais recentes em destaque.'}
            </h2>
          </div>

          {variant === 'full' && showControls ? (
            <div className="flex flex-wrap gap-3">
              {sortOptions.map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => setSelectedSort(option)}
                  className={`rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
                    selectedSort === option
                      ? 'border-primary bg-primary text-primary-foreground shadow-sm'
                      : 'border-border bg-card text-muted-foreground hover:border-primary/30 hover:text-foreground'
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
          ) : null}
        </div>

        {variant === 'full' && showControls ? (
          <div className="grid gap-4">
            <label className="flex h-14 items-center gap-3 rounded-2xl border border-border/80 bg-card px-4 shadow-sm">
              <Search className="h-5 w-5 text-primary/60" />
              <input
                type="search"
                placeholder="Buscar evento, área, cidade ou organizador"
                className="h-full w-full bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
              />
            </label>
          </div>
        ) : null}

        {variant === 'full' && showControls ? (
          <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
            {categoryCounts.map((category) => (
              <button
                key={category.name}
                type="button"
                onClick={() => setSelectedCategory(category.name)}
                className={`text-left rounded-3xl border bg-card p-5 shadow-elegant transition-transform duration-200 hover:-translate-y-0.5 ${
                  selectedCategory === category.name ? 'border-primary/40 ring-1 ring-primary/20' : 'border-border/80'
                }`}
              >
                <div
                  className={`inline-flex rounded-2xl border bg-linear-to-br px-4 py-2 text-sm font-semibold shadow-sm ${categoryStyles[category.name]}`}
                >
                  {categoryLabels[category.name]}
                </div>
                <p className="mt-4 text-2xl font-semibold tracking-tight text-foreground">{category.count}</p>
                <p className="mt-1 text-sm text-muted-foreground">eventos ativos</p>
              </button>
            ))}
          </div>
        ) : null}

        {variant === 'full' && showControls ? (
          <div className="flex flex-wrap gap-3">
            <Button
              type="button"
              variant="outline"
              className="rounded-2xl border-border bg-card px-5 text-foreground hover:bg-muted"
              onClick={() => {
                setQuery('')
                setSelectedCategory('Todas')
                setSelectedSort('Mais recentes')
                setVisibleCount(fullInitialVisibleCount)
              }}
            >
              Limpar filtros
            </Button>
            <Button
              type="button"
              variant="ghost"
              className="rounded-2xl px-5 text-muted-foreground hover:bg-muted hover:text-foreground"
              onClick={() => setSelectedCategory('Todas')}
            >
              Ver todas as categorias
            </Button>
            <div className="flex items-center rounded-2xl border border-border/80 bg-card px-4 py-2 text-sm font-medium text-primary">
              {filteredEvents.length} resultados
            </div>
          </div>
        ) : null}

        {isLoading ? (
          <div className="rounded-3xl border border-dashed border-border/70 bg-background p-10 text-center text-muted-foreground">
            Carregando eventos cadastrados...
          </div>
        ) : null}

        {error && !isLoading ? (
          <div className="rounded-3xl border border-destructive/30 bg-destructive/5 p-6 text-sm text-destructive">
            {error}
          </div>
        ) : null}

        <div className={variant === 'full' ? 'overflow-hidden rounded-4xl border border-border/80 bg-card shadow-elegant' : ''}>
          <div className={variant === 'full' ? 'grid gap-6 p-6 md:grid-cols-3 lg:p-8' : 'grid gap-4 sm:grid-cols-2 md:grid-cols-3'}>
            {visibleEvents.length > 0 ? (
              visibleEvents.map((event) => (
                <CatalogEventCard key={event.id} event={event} variant={variant} />
              ))
            ) : !isLoading ? (
              <div className="rounded-3xl border border-dashed border-border/70 bg-background p-10 text-center text-muted-foreground md:col-span-3 xl:col-span-3">
                Nenhum evento encontrado para os filtros atuais.
              </div>
            ) : null}
          </div>

          {variant === 'full' && remainingCount > 0 ? (
            <div className="flex items-center justify-center px-8 pb-10">
              <Button
                type="button"
                variant="outline"
                className="rounded-2xl border-border bg-background px-5 text-foreground hover:bg-muted"
                onClick={handleLoadMore}
              >
                Carregar mais {remainingCount > fullPageSize ? `(${fullPageSize})` : `(${remainingCount})`}
              </Button>
            </div>
          ) : null}

          {variant === 'full' ? <div ref={sentinelRef} className="h-px w-full" aria-hidden="true" /> : null}
        </div>
      </div>
    </section>
  )
}

function CatalogEventCard({ event, variant }: { event: CatalogEvent; variant: 'compact' | 'full' }) {
  return (
    <article
      className={
        variant === 'full'
          ? 'rounded-3xl border border-border/70 bg-background p-4 shadow-sm sm:p-5'
          : 'rounded-3xl border border-border/80 bg-card p-5 shadow-elegant transition-transform duration-200 hover:-translate-y-0.5'
      }
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <div
            className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-[0.26em] ${categoryStyles[event.category]}`}
          >
            {categoryLabels[event.category]}
          </div>
          <h3 className={variant === 'full' ? 'mt-3 text-lg font-semibold tracking-tight text-foreground sm:text-xl' : 'mt-3 text-lg font-semibold tracking-tight text-foreground'}>
            {event.title}
          </h3>
        </div>

        {event.highlight ? (
          <div className="rounded-full bg-muted px-3 py-1 text-xs font-medium text-muted-foreground">
            Destaque
          </div>
        ) : null}
      </div>

      {variant === 'full' ? (
        <p className="mt-3 text-sm leading-6 text-muted-foreground sm:text-sm">
          {event.summary}
        </p>
      ) : null}

      <p className={variant === 'full' ? 'mt-4 text-sm leading-6 text-muted-foreground sm:text-base' : 'mt-4 text-sm leading-6 text-muted-foreground'}>
        {event.status}
      </p>

      <div className="mt-4 flex flex-col gap-2 text-sm text-muted-foreground sm:flex-row sm:flex-wrap sm:items-center sm:gap-x-4 sm:gap-y-2">
        <div className="flex items-center gap-2">
          <CalendarDays className="h-4 w-4 text-primary" />
          {event.date}
        </div>
        <div className="flex items-center gap-2">
          <MapPin className="h-4 w-4 text-primary" />
          {event.location}
        </div>
        <div className="hidden" aria-hidden>
          {/* attendees and updated info kept in data for modeling, not shown in UI */}
        </div>
      </div>

      {/* tags are kept in data for future modeling, not displayed here */}

      <div className={variant === 'full' ? 'mt-5' : 'mt-5'}>
        <Button asChild variant="outline" className={variant === 'full' ? 'h-9 rounded-2xl border-border bg-background/60 px-3 text-sm text-foreground hover:bg-muted' : 'h-9 rounded-2xl border-border bg-background/60 px-3 text-sm text-foreground hover:bg-muted'}>
          <Link href={`/events/${event.slug}`}>
            Ver detalhes
            <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
      </div>
    </article>
  )
}
