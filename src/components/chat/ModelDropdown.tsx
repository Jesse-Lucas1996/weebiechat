import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Model } from '@/app/types/model'

interface ModelDropdownProps {
  models: Model[]
  selectedModel: string
  loadingModels: boolean
  setSelectedModel: (model: string) => void
}

export function ModelDropdown({
  models,
  selectedModel,
  loadingModels,
  setSelectedModel,
}: ModelDropdownProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="min-w-[180px] justify-between">
          {loadingModels
            ? 'Loading models...'
            : selectedModel || 'Select model'}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Select Model</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {models.map((model) => (
          <DropdownMenuItem
            key={model.name}
            onSelect={() => setSelectedModel(model.name)}
          >
            {model.name}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
