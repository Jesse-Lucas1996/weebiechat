import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import React from 'react'

interface ChatInputProps {
  value?: string
  onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void
  onSend?: () => void
  placeholder?: string
}

export function ChatInput({
  value,
  onChange,
  onSend,
  placeholder,
}: ChatInputProps) {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      onSend?.()
    }
  }

  return (
    <>
      <Textarea
        className="h-24 w-full resize-none pl-8 text-pretty focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:outline-none"
        placeholder={placeholder || 'Dow shite hosshii des ka...'}
        value={value}
        onChange={onChange}
        onKeyDown={handleKeyDown}
      />
      <Button className="mt-4 cursor-pointer" onClick={onSend}>
        Send
      </Button>
    </>
  )
}
