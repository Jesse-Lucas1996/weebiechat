import { apiClient } from '@/app/utils/apiClient'
import { tryCatch } from '@/app/utils/tryCatch'
import { NextResponse } from 'next/server'

export async function GET() {
  const { data, error } = await tryCatch(
    apiClient('http://localhost:11434/api/tags'),
  )

  if (error) {
    throw new Error(error.message)
  }

  return NextResponse.json(data)
}
