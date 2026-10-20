export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message)
    this.name = 'ApiError'
  }
}
const baseUrl = import.meta.env.VITE_API_BASE_URL || '/api/v1'
/** Backend adapter only. Demo pages deliberately use demo.ts until server contracts are connected. */
export async function apiRequest<T>(path: string, options: RequestInit = {}): Promise<T> {
  const headers = new Headers(options.headers)
  if (!headers.has('Accept')) headers.set('Accept', 'application/json')
  if (options.body && typeof options.body === 'string' && !headers.has('Content-Type'))
    headers.set('Content-Type', 'application/json')
  const response = await fetch(`${baseUrl}${path}`, {
    ...options,
    credentials: 'include',
    headers,
  })
  if (!response.ok)
    throw new ApiError(response.status, `Request failed (${response.status}). Please try again.`)
  if (response.status === 204) return undefined as T
  return response.json() as Promise<T>
}
