import { NextResponse } from 'next/server'

const EVENT_SERVICE_URL = process.env.EVENT_SERVICE_URL || process.env.NEXT_PUBLIC_EVENT_SERVICE_URL || 'http://localhost:8002'

type RouteContext = {
  params: Promise<{ slug: string }>
}

export async function POST(request: Request, { params }: RouteContext) {
  try {
    const { slug } = await params
    const body = (await request.json()) as { user_id?: number }

    if (!body.user_id || body.user_id <= 0) {
      return NextResponse.json({ message: 'user_id é obrigatório' }, { status: 400 })
    }

    const eventResponse = await fetch(`${EVENT_SERVICE_URL}/events/${slug}`, {
      headers: {
        Accept: 'application/json',
      },
      cache: 'no-store',
    })

    if (!eventResponse.ok) {
      return NextResponse.json({ message: 'Falha ao localizar o evento' }, { status: eventResponse.status })
    }

    const event = (await eventResponse.json()) as { id: number }

    const subscriptionResponse = await fetch(`${EVENT_SERVICE_URL}/events/${event.id}/subscriptions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({ user_id: body.user_id }),
    })

    if (!subscriptionResponse.ok) {
      const errorBody = await subscriptionResponse.json().catch(() => null)
      const message = errorBody?.detail || errorBody?.message || 'Falha ao realizar inscrição'
      return NextResponse.json({ message }, { status: subscriptionResponse.status })
    }

    return NextResponse.json(await subscriptionResponse.json(), { status: subscriptionResponse.status })
  } catch {
    return NextResponse.json({ message: 'Falha ao realizar inscrição' }, { status: 500 })
  }
}