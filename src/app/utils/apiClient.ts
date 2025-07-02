export const apiClient = async (url: string, options?: RequestInit) => {
  const response = await fetch(url, options)

  if (!response.ok) return new Error('api failed')
  return response.json()
}
