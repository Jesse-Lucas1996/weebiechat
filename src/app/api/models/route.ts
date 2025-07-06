import { apiClient } from '@/app/utils/apiClient'
import { tryCatch } from '@/app/utils/tryCatch'
import { NextResponse } from 'next/server'

const OLLAMA_BASE_URL =
  typeof process !== 'undefined' && process.env.DOCKER
    ? 'http://host.docker.internal:11434'
    : 'http://localhost:11434'

export async function GET() {
  const { data, error } = await tryCatch(
    apiClient(`${OLLAMA_BASE_URL}/api/tags`),
  )

  if (error) {
    throw new Error(error.message)
  }

  return NextResponse.json(data)
}
