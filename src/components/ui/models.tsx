import { GetModels } from '@/hooks/models'
import { useState, useEffect } from 'react'
import { Model } from '@/app/types/model'

async function LoadModels(): Promise<Model[]> {
  const data = await GetModels()
  if (!data || !Array.isArray(data.models)) {
    throw new Error('Failed to fetch models')
  }
  return data.models
}

export default function ModelsList() {
  const [models, setModels] = useState<Model[] | null>(null)

  useEffect(() => {
    async function fetchModels() {
      try {
        const models = await LoadModels()
        setModels(models)
      } catch (error) {
        console.warn(error)
        setModels([])
      }
    }
    fetchModels()
  }, [])

  if (models === null) return <div>Loading models...</div>
  if (models.length === 0)
    return (
      <div>No models found. Are you running Ollama and pulled an image?</div>
    )

  return (
    <ul className="space-y-2">
      {models.map((model) => (
        <li key={model.name} className="rounded border p-2">
          <span className="font-mono">{model.name}</span>
        </li>
      ))}
    </ul>
  )
}
