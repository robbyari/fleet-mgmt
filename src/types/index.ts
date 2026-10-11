export type VehicleStatus = 'IN_TRANSIT_TO' | 'STOPPED_AT' | 'INCOMING_AT' | string

export interface VehicleAttributes {
  bearing: number | null
  carriages: unknown[]
  current_status: VehicleStatus
  current_stop_sequence: number
  direction_id: number
  label: string | null
  latitude: number
  longitude: number
  occupancy_status: string | null
  revenue: string | null
  speed: number | null
  updated_at: string
}

export interface ResourceRelationship<T = string> {
  data: {
    id: string
    type: T
  } | null
}

export interface VehicleRelationships {
  route?: ResourceRelationship<'route'>
  stop?: ResourceRelationship<'stop'>
  trip?: ResourceRelationship<'trip'>
}

export interface Vehicle {
  id: string
  type: 'vehicle'
  attributes: VehicleAttributes
  links?: {
    self: string
  }
  relationships?: VehicleRelationships
}

export interface RouteAttributes {
  color: string
  text_color: string
  description: string
  direction_destinations: string[]
  direction_names: string[]
  fare_class: string
  listed_route: boolean
  long_name: string
  short_name: string
  sort_order: number
  type: number
}

export interface Route {
  id: string
  type: 'route'
  attributes: RouteAttributes
  links?: {
    self: string
  }
  relationships?: {
    line?: ResourceRelationship<'line'>
    agency?: ResourceRelationship<'agency'>
  }
}

export interface TripAttributes {
  bikes_allowed: number
  block_id: string
  direction_id: number
  headsign: string
  name: string
  revenue: string
  wheelchair_accessible: number
}

export interface Trip {
  id: string
  type: 'trip'
  attributes: TripAttributes
  links?: {
    self: string
  }
  relationships?: {
    route?: ResourceRelationship<'route'>
    route_pattern?: ResourceRelationship<'route_pattern'>
    service?: ResourceRelationship<'service'>
    shape?: ResourceRelationship<'shape'>
  }
}

export interface StopAttributes {
  name: string
  latitude?: number
  longitude?: number
  municipality?: string
  address?: string
}

export interface Stop {
  id: string
  type: 'stop'
  attributes: StopAttributes
}

export type IncludedResource = Route | Trip | Stop | { id: string; type: string; attributes: Record<string, unknown> }

export interface JsonApiLinks {
  first?: string
  last?: string
  prev?: string
  next?: string
  self?: string
}

export interface JsonApiResponse<T> {
  data: T[]
  included?: IncludedResource[]
  jsonapi?: {
    version: string
  }
  links?: JsonApiLinks
  errors?: Array<{
    code?: string
    status?: string
    title?: string
    detail?: string
  }>
}

export interface PaginationState {
  page: number
  limit: number
  totalItems: number
  totalPages: number
  offset: number
  fromItem: number
  toItem: number
}

export interface VehicleFilters {
  routes: string[]
  trips: string[]
  searchQuery?: string
}

