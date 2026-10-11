import type { JsonApiResponse, Route } from '../types'
import { fetchFromMbta } from './apiClient'

export interface GetRoutesParams {
  offset?: number
  limit?: number
  sort?: string
}

export async function getRoutes(
  params: GetRoutesParams = {},
  options?: { signal?: AbortSignal }
): Promise<JsonApiResponse<Route>> {
  const queryParams: Record<string, string | number | undefined> = {
    'page[offset]': params.offset ?? 0,
    'page[limit]': params.limit ?? 20,
    sort: params.sort ?? 'sort_order',
  }

  return await fetchFromMbta<JsonApiResponse<Route>>('/routes', queryParams, {
    ...options,
    ttl: 60_000, // Routes change infrequently, 60s cache
  })
}
