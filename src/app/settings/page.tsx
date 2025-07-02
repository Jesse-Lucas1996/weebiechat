'use client'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function SettingsPage() {
  const [systemPrompt, setSystemPrompt] = useState('')
  const { replace } = useRouter()

  useEffect(() => {
    const saved = localStorage.getItem('weebiechat_system_prompt')
    if (saved) setSystemPrompt(saved)
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setSystemPrompt(e.target.value)
    localStorage.setItem('weebiechat_system_prompt', e.target.value)
  }

  return (
    <div className="mx-auto mt-10 max-w-xl p-4">
      <Button onClick={() => replace('/chat')}>
        <ArrowLeft />
      </Button>
      <h1 className="mb-4 text-2xl font-bold">Settings</h1>
      <label htmlFor="system-prompt" className="mb-2 block font-medium">
        System Prompt
      </label>
      <textarea
        id="system-prompt"
        className="min-h-[100px] w-full rounded border p-2"
        value={systemPrompt}
        onChange={handleChange}
        placeholder="Enter your system prompt here..."
      />
      <p className="mt-2 text-xs text-gray-500">
        This prompt will be used as the system instruction for the AI.
      </p>
    </div>
  )
}
