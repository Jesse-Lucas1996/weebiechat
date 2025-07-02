import { NextResponse } from 'next/server'

interface HealthCheck {
  timetamp: string
  status: 'ok'
  uptime: string
}

export async function GET() {
  const healthcheck: HealthCheck = {
    status: 'ok',
    timetamp: Date.now().toString(),
    uptime: process.uptime().toString(),
  }
  return NextResponse.json(healthcheck)
}
