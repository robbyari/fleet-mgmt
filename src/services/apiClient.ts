const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://api-v3.mbta.com'

interface CacheItem<T> {
  data: T
  timestamp: number
}

// In-memory cache to stay well within MBTA rate limits (20 req/min for unauthenticated requests)
const cache = new Map<string, CacheItem<unknown>>()
const DEFAULT_CACHE_TTL = 20_000 // 20 seconds cache

export class ApiError extends Error {
  status?: number
  code?: string
  constructor(message: string, status?: number, code?: string) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.code = code
  }
}

export async function fetchFromMbta<T>(
  endpoint: string,
  params: Record<string, string | number | undefined> = {},
  options: { ttl?: number; signal?: AbortSignal; bypassCache?: boolean } = {}
): Promise<T> {
  const url = new URL(endpoint.startsWith('http') ? endpoint : `${BASE_URL}${endpoint}`)

  // Append query params
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== '') {
      url.searchParams.set(key, String(value))
    }
  })

  const cacheKey = url.toString()
  const ttl = options.ttl ?? DEFAULT_CACHE_TTL

  if (!options.bypassCache && cache.has(cacheKey)) {
    const cached = cache.get(cacheKey) as CacheItem<T>
    if (Date.now() - cached.timestamp < ttl) {
      return cached.data
    }
  }

  const headers: Record<string, string> = {
    Accept: 'application/vnd.api+json',
  }

  try {
    const response = await fetch(url.toString(), {
      method: 'GET',
      headers,
      signal: options.signal,
    })

    if (!response.ok) {
      let errorDetail = `HTTP Error ${response.status}: ${response.statusText}`
      try {
        const errorJson = await response.json()
        if (errorJson.errors && errorJson.errors.length > 0) {
          const firstErr = errorJson.errors[0]
          errorDetail = firstErr.detail || firstErr.title || firstErr.code || errorDetail
        }
      } catch {
        // Fallback to response text if not json
      }

      if (response.status === 429) {
        throw new ApiError(
          'Batas panggilan API tercapai (Rate Limit: 20 req/menit). Harap tunggu beberapa saat.',
          429,
          'rate_limit_exceeded'
        )
      }

      throw new ApiError(errorDetail, response.status)
    }

    const data = (await response.json()) as T

    // Store in cache
    cache.set(cacheKey, {
      data,
      timestamp: Date.now(),
    })

    return data
  } catch (err: unknown) {
    if (err instanceof ApiError) {
      throw err
    }
    if ((err as Error).name === 'AbortError') {
      throw err
    }
    throw new ApiError(
      `Gagal terhubung ke server API (${(err as Error).message || 'Koneksi gagal'}). Pastikan internet Anda aktif.`,
      0,
      'network_error'
    )
  }
}
