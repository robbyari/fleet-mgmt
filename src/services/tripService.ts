import type { JsonApiResponse, Trip } from '../types'
import { fetchFromMbta } from './apiClient'

const DEFAULT_ROUTES_FOR_TRIPS = 'Red,Orange,Blue,Green-B,1,66,77,112,Boat-F1'

export interface GetTripsParams {
  offset?: number
  limit?: number
  routes?: string[]
}

export async function getTrips(
  params: GetTripsParams = {},
  options?: { signal?: AbortSignal }
): Promise<JsonApiResponse<Trip>> {
  const routesToFilter =
    params.routes && params.routes.length > 0
      ? params.routes.join(',')
      : DEFAULT_ROUTES_FOR_TRIPS

  const queryParams: Record<string, string | number | undefined> = {
    'page[offset]': params.offset ?? 0,
    'page[limit]': params.limit ?? 20,
    'filter[route]': routesToFilter,
  }

  return await fetchFromMbta<JsonApiResponse<Trip>>('/trips', queryParams, {
    ...options,
    ttl: 60_000,
  })
}
