import { NextResponse } from 'next/server'

import { mapBackendEvent } from '@/lib/events'

const EVENT_SERVICE_URL = process.env.EVENT_SERVICE_URL || process.env.NEXT_PUBLIC_EVENT_SERVICE_URL || 'http://localhost:8002'

export async function GET(_: Request, { params }: { params: Promise<{ slug: string }> }) {
  try {
    const { slug } = await params

    const response = await fetch(`${EVENT_SERVICE_URL}/events/${slug}`, {
      headers: {
        Accept: 'application/json',
      },
      cache: 'no-store',
    })

    if (!response.ok) {
      return NextResponse.json({ message: 'Falha ao carregar evento' }, { status: response.status })
    }

    const event = (await response.json()) as Parameters<typeof mapBackendEvent>[0]

    return NextResponse.json(mapBackendEvent(event))
  } catch {
    return NextResponse.json({ message: 'Falha ao carregar evento' }, { status: 500 })
  }
}