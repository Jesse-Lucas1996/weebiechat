import { NextResponse } from 'next/server'
import { tryCatch } from '@/app/utils/tryCatch'

const OLLAMA_BASE_URL =
  typeof process !== 'undefined' && process.env.DOCKER
    ? 'http://host.docker.internal:11434'
    : 'http://localhost:11434'

export async function POST(req: Request) {
  const { prompt, model, stream, system } = await req.json()

  const systemPrompt =
    system ||
    'you are playing the role of a cringe lord lonely japanese salary man weeb so only speak back to me in that tone'

  const { data: response, error } = await tryCatch(
    fetch(`${OLLAMA_BASE_URL}/api/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: model || 'llama2:chat',
        prompt: prompt,
        stream: true,
        system: systemPrompt,
      }),
    }),
  )

  if (error) {
    throw new Error(error.message)
  }

  if (response && response.body) {
    if (stream) {
      const encoder = new TextEncoder()
      const streamResp = new ReadableStream({
        async start(controller) {
          const reader = response.body?.getReader()
          if (!reader) {
            controller.close()
            return
          }
          let done = false
          while (!done) {
            const { value, done: doneReading } = await reader.read()
            done = doneReading
            if (value) {
              const chunk = new TextDecoder().decode(value)
              chunk.split('\n').forEach((line) => {
                if (line.trim()) {
                  try {
                    const json = JSON.parse(line)
                    if (json.response) {
                      controller.enqueue(encoder.encode(json.response))
                    }
                  } catch {}
                }
              })
            }
          }
          controller.close()
        },
      })
      return new Response(streamResp, {
        headers: {
          'Content-Type': 'text/plain; charset=utf-8',
          'Transfer-Encoding': 'chunked',
          'Cache-Control': 'no-cache',
        },
      })
    } else {
      const reader = response.body.getReader()
      let result = ''
      let done = false
      while (!done) {
        const { value, done: doneReading } = await reader.read()
        done = doneReading
        if (value) {
          const chunk = new TextDecoder().decode(value)
          chunk.split('\n').forEach((line) => {
            if (line.trim()) {
              try {
                const json = JSON.parse(line)
                if (json.response) result += json.response
              } catch {}
            }
          })
        }
      }
      return NextResponse.json({ response: result })
    }
  }

  return NextResponse.json({ response: '' })
}
