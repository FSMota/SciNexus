import { NextResponse } from 'next/server'

import { mapBackendEvent } from '@/lib/events'

const EVENT_SERVICE_URL = process.env.EVENT_SERVICE_URL || process.env.NEXT_PUBLIC_EVENT_SERVICE_URL || 'http://localhost:8002'

export async function GET() {
  try {
    const response = await fetch(`${EVENT_SERVICE_URL}/events`, {
      headers: {
        Accept: 'application/json',
      },
      cache: 'no-store',
    })

    if (!response.ok) {
      return NextResponse.json({ message: 'Falha ao carregar eventos' }, { status: response.status })
    }

    const events = (await response.json()) as Array<Parameters<typeof mapBackendEvent>[0]>

    return NextResponse.json(events.map(mapBackendEvent))
  } catch {
    return NextResponse.json({ message: 'Falha ao carregar eventos' }, { status: 500 })
  }
}