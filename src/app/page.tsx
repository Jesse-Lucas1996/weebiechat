'use client'
import { useRouter } from 'next/navigation'
import { Button } from '../components/ui/button'

export default function Home() {
  const router = useRouter()

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-gray-50 to-gray-200 p-6 dark:from-[#18181b] dark:to-[#23232a]">
      <main className="flex w-full max-w-xl flex-col items-center gap-8">
        <h1 className="text-center text-3xl font-bold sm:text-4xl">
          Use your Local AI Model here
        </h1>
        <p className="text-center text-lg text-gray-700 dark:text-gray-300">
          This is a fully private chat app hat runs large language models{' '}
          <span className="font-semibold">entirely on your machine</span> using{' '}
          <a
            href="https://ollama.com"
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-blue-600"
          >
            Ollama
          </a>
          .
          <br />
          No cloud, no data leaves your device.
        </p>
        <div className="flex w-full flex-col gap-2">
          <Button
            className="w-full py-6 text-lg"
            onClick={() => router.push('/chat')}
          >
            Start Chatting
          </Button>
          <div className="text-center text-sm text-gray-500 dark:text-gray-400">
            To use this app, you must have{' '}
            <a
              href="https://ollama.com/download"
              target="_blank"
              rel="noopener noreferrer"
              className="underline"
            >
              Ollama
            </a>{' '}
            running locally.
          </div>
        </div>
        <section className="mt-4 w-full rounded-lg bg-white/80 p-4 dark:bg-black/30">
          <h2 className="mb-2 text-base font-semibold">How to get started:</h2>
          <ol className="list-inside list-decimal space-y-1 text-sm">
            <li>
              Download and install{' '}
              <a
                href="https://ollama.com/download"
                target="_blank"
                rel="noopener noreferrer"
                className="underline"
              >
                Ollama
              </a>{' '}
              for your OS.
            </li>
            <li>
              Start Ollama by running{' '}
              <code className="rounded bg-gray-100 px-1 py-0.5 dark:bg-gray-800">
                ollama serve
              </code>{' '}
              in your terminal.
            </li>
            <li>
              Optionally, pull a model (e.g.{' '}
              <code className="rounded bg-gray-100 px-1 py-0.5 dark:bg-gray-800">
                ollama pull llama3
              </code>
              ).
            </li>
            <li>
              Return here and click{' '}
              <span className="font-semibold">Start Chatting</span>!
            </li>
          </ol>
        </section>
      </main>
      <footer className="mt-12 text-center text-xs text-gray-400">
        <span>
          Powered by Next.js, Ollama, and local models. No data leaves your
          device.
        </span>
      </footer>
    </div>
  )
}
