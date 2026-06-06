import { NextResponse } from 'next/server'

import { mapBackendEvent } from '@/lib/events'

const EVENT_SERVICE_URL = process.env.EVENT_SERVICE_URL || process.env.NEXT_PUBLIC_EVENT_SERVICE_URL || 'http://localhost:8002'

export async function POST(request: Request) {
  try {
    const payload = await request.json()

    const response = await fetch(`${EVENT_SERVICE_URL}/events`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify(payload),
    })

    if (!response.ok) {
      const errorBody = await response.json().catch(() => null)
      const message = errorBody?.detail || errorBody?.message || 'Falha ao criar evento'
      return NextResponse.json({ message }, { status: response.status })
    }

    const event = (await response.json()) as Parameters<typeof mapBackendEvent>[0]

    return NextResponse.json(mapBackendEvent(event), { status: response.status })
  } catch {
    return NextResponse.json({ message: 'Falha ao criar evento' }, { status: 500 })
  }
}

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