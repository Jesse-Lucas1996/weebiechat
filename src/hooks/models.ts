import { apiClient } from '../app/utils/apiClient'
import { tryCatch } from '../app/utils/tryCatch'
import { ModelsResponse } from '../app/types/model'

export async function GetModels(): Promise<ModelsResponse | null> {
  const { data, error } = await tryCatch(apiClient('/api/models'))
  if (error) return null
  return data as unknown as ModelsResponse
}
