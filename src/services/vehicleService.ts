import type { JsonApiResponse, Vehicle } from '../types'
import { fetchFromMbta } from './apiClient'

export interface GetVehiclesParams {
  page: number
  limit: number
  routes?: string[]
  trips?: string[]
  sort?: string
}

export async function getVehicles(
  params: GetVehiclesParams,
  options?: { signal?: AbortSignal; bypassCache?: boolean }
): Promise<JsonApiResponse<Vehicle>> {
  const offset = (params.page - 1) * params.limit

  const queryParams: Record<string, string | number | undefined> = {
    'page[offset]': offset,
    'page[limit]': params.limit,
    include: 'route,trip,stop',
  }

  if (params.sort) {
    queryParams.sort = params.sort
  }

  if (params.routes && params.routes.length > 0) {
    queryParams['filter[route]'] = params.routes.join(',')
  }

  if (params.trips && params.trips.length > 0) {
    queryParams['filter[trip]'] = params.trips.join(',')
  }

  return await fetchFromMbta<JsonApiResponse<Vehicle>>('/vehicles', queryParams, {
    ...options,
    ttl: 15_000, // 15 seconds cache for live vehicle data
  })
}

export async function getVehicleById(
  id: string,
  options?: { signal?: AbortSignal }
): Promise<{ data: Vehicle; included?: unknown[] }> {
  return await fetchFromMbta<{ data: Vehicle; included?: unknown[] }>(
    `/vehicles/${id}`,
    { include: 'route,trip,stop' },
    { ...options, ttl: 20_000 }
  )
}
