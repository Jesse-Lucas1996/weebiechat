import React, { useEffect, useRef } from 'react'
import { Bot, User } from 'lucide-react'

interface ChatStreamProps {
  role: 'user' | 'ai'
  content: string
}

export function ChatStream({ role, content }: ChatStreamProps) {
  const isUser = role === 'user'
  const bottomRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [content])

  return (
    <div
      className={`flex w-full gap-2 ${
        isUser ? 'justify-end' : 'justify-start'
      }`}
    >
      <div
        className={`flex max-w-[80%] items-start gap-2 rounded-lg border p-4 text-base whitespace-pre-wrap ${isUser ? 'bg-blue-100 text-right' : 'bg-muted text-left'} ${isUser ? 'border-blue-300' : 'border-border'}`}
      >
        <div className="mt-1">
          {isUser ? (
            <User className="h-5 w-5 text-blue-500" />
          ) : (
            <Bot className="text-muted-foreground h-5 w-5" />
          )}
        </div>
        <div className="font-mono">{content}</div>
        <div ref={bottomRef} />
      </div>
    </div>
  )
}
