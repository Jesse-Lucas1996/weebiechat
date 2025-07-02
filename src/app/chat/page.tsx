'use client'
import { Sidebar, SidebarProvider, useSidebar } from '@/components/ui/sidebar'
import { useEffect, useState } from 'react'
import { GetModels } from '@/hooks/models'
import { Model } from '@/app/types/model'
import { ModelDropdown } from '@/components/chat/ModelDropdown'
import { ChatInput } from '@/components/chat/ChatInput'
import { chatService, chatServiceStream } from '@/app/utils/ai'
import { ChatStream } from '@/components/chat/ChatStream'
import { MenuIcon } from 'lucide-react'

type Message = {
  role: 'user' | 'ai'
  content: string
}

export default function ChatPage() {
  const [chats, setChats] = useState<{ messages: Message[]; title: string }[]>(
    [],
  )
  const [activeChatIndex, setActiveChatIndex] = useState(0)
  const [inputValue, setInputValue] = useState('')
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    const savedChats = localStorage.getItem('weebiechat_chats')
    const savedIndex = localStorage.getItem('weebiechat_active_index')
    let index = 0
    if (savedChats) {
      try {
        const loadedChats = JSON.parse(savedChats)
        if (Array.isArray(loadedChats) && loadedChats.length > 0) {
          setChats(loadedChats)
          if (savedIndex !== null) {
            const idx = parseInt(savedIndex, 10)
            if (!isNaN(idx) && idx >= 0 && idx < loadedChats.length) {
              index = idx
            } else {
              index = loadedChats.length - 1
            }
          } else {
            index = loadedChats.length - 1
          }
          setActiveChatIndex(index)
        } else {
          setChats([{ messages: [], title: '' }])
          setActiveChatIndex(0)
        }
      } catch {
        setChats([{ messages: [], title: '' }])
        setActiveChatIndex(0)
      }
    } else {
      setChats([{ messages: [], title: '' }])
      setActiveChatIndex(0)
    }
    setLoaded(true)
  }, [])

  useEffect(() => {
    if (loaded) {
      localStorage.setItem('weebiechat_chats', JSON.stringify(chats))
    }
  }, [chats, loaded])

  useEffect(() => {
    if (loaded) {
      localStorage.setItem(
        'weebiechat_active_index',
        activeChatIndex.toString(),
      )
    }
  }, [activeChatIndex, loaded])

  const handleNewChat = () => {
    const newChats = [...chats, { messages: [], title: '' }]
    setChats(newChats)
    setActiveChatIndex(newChats.length - 1)
    setInputValue('')
  }

  const handleSelectChat = (idx: number) => {
    setActiveChatIndex(idx)
    setInputValue('')
  }

  const setChatMessages = (index: number, messages: Message[]) => {
    setChats((prev) => {
      const updated = [...prev]
      updated[index] = { ...updated[index], messages }
      return updated
    })
  }

  const setChatTitle = (index: number, title: string) => {
    setChats((prev) => {
      const updated = [...prev]
      updated[index] = { ...updated[index], title }
      return updated
    })
  }

  return (
    <SidebarProvider defaultOpen={true}>
      <ChatPageWithSidebarToggle
        chats={chats}
        activeChatIndex={activeChatIndex}
        setChatMessages={setChatMessages}
        setChatTitle={setChatTitle}
        inputValue={inputValue}
        setInputValue={setInputValue}
        onNewChat={handleNewChat}
        onSelectChat={handleSelectChat}
      />
    </SidebarProvider>
  )
}

function ChatPageWithSidebarToggle({
  chats,
  activeChatIndex,
  setChatMessages,
  setChatTitle,
  inputValue,
  setInputValue,
  onNewChat,
  onSelectChat,
}: {
  chats: { messages: Message[]; title: string }[]
  activeChatIndex: number
  setChatMessages: (idx: number, msgs: Message[]) => void
  setChatTitle: (idx: number, title: string) => void
  inputValue: string
  setInputValue: (v: string) => void
  onNewChat: () => void
  onSelectChat: (idx: number) => void
}) {
  const { open, toggleSidebar } = useSidebar()
  return (
    <div className="flex h-screen w-screen">
      {open && (
        <Sidebar
          onSelectChat={(_, idx) => onSelectChat(idx)}
          onNewChat={onNewChat}
          chats={chats}
          activeChatIndex={activeChatIndex}
        />
      )}
      <ChatPageContent
        chatMessages={chats[activeChatIndex]?.messages || []}
        setChatMessages={(msgs) => setChatMessages(activeChatIndex, msgs)}
        setChatTitle={(title) => setChatTitle(activeChatIndex, title)}
        inputValue={inputValue}
        setInputValue={setInputValue}
        toggleSidebar={toggleSidebar}
        activeChatIndex={activeChatIndex}
      />
    </div>
  )
}

function ChatPageContent({
  chatMessages,
  setChatMessages,
  setChatTitle,
  inputValue,
  setInputValue,
  toggleSidebar,
}: {
  chatMessages: Message[]
  setChatMessages: (msgs: Message[]) => void
  setChatTitle: (title: string) => void
  inputValue: string
  setInputValue: (v: string) => void
  toggleSidebar: () => void
  activeChatIndex: number
}) {
  const [models, setModels] = useState<Model[]>([])
  const [selectedModel, setSelectedModel] = useState('')
  const [loadingModels, setLoadingModels] = useState(true)
  const [systemPrompt, setSystemPrompt] = useState('')
  const { open } = useSidebar()

  useEffect(() => {
    async function fetchModels() {
      setLoadingModels(true)
      const data = await GetModels()
      if (data && Array.isArray(data.models)) {
        setModels(data.models)
        setSelectedModel(data.models[0]?.name || '')
      }
      setLoadingModels(false)
    }
    fetchModels()
  }, [])

  useEffect(() => {
    const saved = localStorage.getItem('weebiechat_system_prompt')
    if (saved) setSystemPrompt(saved)
    else
      setSystemPrompt(
        'you are playing the role of a cringe lord lonely japanese salary man weeb so only speak back to me in that tone',
      )
    const onStorage = (e: StorageEvent) => {
      if (e.key === 'weebiechat_system_prompt') {
        setSystemPrompt(e.newValue || '')
      }
    }
    window.addEventListener('storage', onStorage)
    return () => window.removeEventListener('storage', onStorage)
  }, [])

  const generateTitle = async (messages: Message[]) => {
    const chatText = messages
      .map((m) => `${m.role === 'user' ? 'User' : 'AI'}: ${m.content}`)
      .join('\n')
    const prompt = `Summarize this chat in a short, catchy title (max 8 words):\n${chatText}`
    const response = await chatService({
      prompt,
      model: selectedModel,
      system: systemPrompt,
    })
    return response?.response?.trim() || 'Untitled Chat'
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputValue(e.target.value)
  }

  const handleSend = async () => {
    if (!inputValue.trim() || !selectedModel) return
    const prompt = inputValue
    setInputValue('')

    let newMessages: Message[] = [
      ...chatMessages,
      { role: 'user', content: prompt },
      { role: 'ai', content: '' },
    ]
    setChatMessages(newMessages)

    let aiContent = ''
    let firstChunk = true
    for await (const chunk of chatServiceStream({
      prompt,
      model: selectedModel,
      system: systemPrompt,
    })) {
      aiContent += chunk
      newMessages = [...newMessages]
      newMessages[newMessages.length - 1] = { role: 'ai', content: aiContent }
      setChatMessages(newMessages)
      if (firstChunk) firstChunk = false
    }

    const title = await generateTitle(newMessages)
    setChatTitle(title)
  }

  return (
    <div className="flex h-screen flex-1 flex-col overflow-hidden">
      {!open && (
        <button
          className="bg-background absolute top-4 left-4 z-50 cursor-pointer rounded-md p-2 shadow"
          onClick={toggleSidebar}
          aria-label="Open sidebar"
        >
          <MenuIcon className="h-6 w-6" />
        </button>
      )}

      <div className="no-scrollbar mx-auto w-full flex-1 space-y-4 overflow-y-auto px-2 pb-2 sm:w-2/3 sm:px-0 md:w-1/2">
        {chatMessages.map((msg, index) => (
          <ChatStream key={index} role={msg.role} content={msg.content} />
        ))}
      </div>
      <div className="mx-auto mb-2 w-full shrink-0 px-2 sm:w-2/3 sm:px-0 md:w-1/2">
        <ChatInput
          value={inputValue}
          onChange={handleInputChange}
          onSend={handleSend}
          placeholder="Dow shite hosshii des ka..."
        />
        <div className="mt-2 flex w-full justify-end">
          <ModelDropdown
            models={models}
            selectedModel={selectedModel}
            loadingModels={loadingModels}
            setSelectedModel={setSelectedModel}
          />
        </div>
      </div>
    </div>
  )
}
