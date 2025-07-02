import { apiClient } from './apiClient'
import { tryCatch } from './tryCatch'

export interface ChatResponse {
  response: any
}

export async function chatService({
  prompt,
  model,
  system,
}: {
  prompt: string
  model: string
  system: string
}): Promise<ChatResponse | null> {
  const { data, error } = await tryCatch(
    apiClient('/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ prompt, model, stream: false, system }),
    }),
  )
  if (error) return null
  return data as unknown as ChatResponse
}

// Streaming version
export async function* chatServiceStream({
  prompt,
  model,
  system,
}: {
  prompt: string
  model: string
  system: string
}): AsyncGenerator<string, void, unknown> {
  const response = await fetch('/api/chat', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ prompt, model, stream: true, system }),
  })
  if (!response.body) return
  const reader = response.body.getReader()
  const decoder = new TextDecoder()
  let done = false
  while (!done) {
    const { value, done: doneReading } = await reader.read()
    done = doneReading
    if (value) {
      yield decoder.decode(value)
    }
  }
}
