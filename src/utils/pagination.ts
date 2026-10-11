import type { JsonApiLinks } from '../types'

/**
 * Extracts offset parameter from MBTA API URL
 */
export function extractOffsetFromUrl(url?: string | null): number | null {
  if (!url) return null
  try {
    const match = url.match(/page(?:%5B|\[)offset(?:%5D|\])=(\d+)/)
    if (match && match[1]) {
      return parseInt(match[1], 10)
    }
    const parsed = new URL(url)
    const offsetStr = parsed.searchParams.get('page[offset]')
    return offsetStr ? parseInt(offsetStr, 10) : null
  } catch {
    return null
  }
}

/**
 * Extracts limit parameter from MBTA API URL
 */
export function extractLimitFromUrl(url?: string | null): number | null {
  if (!url) return null
  try {
    const match = url.match(/page(?:%5B|\[)limit(?:%5D|\])=(\d+)/)
    if (match && match[1]) {
      return parseInt(match[1], 10)
    }
    const parsed = new URL(url)
    const limitStr = parsed.searchParams.get('page[limit]')
    return limitStr ? parseInt(limitStr, 10) : null
  } catch {
    return null
  }
}

/**
 * Compute total count and pages from links and current response
 */
export function calculatePaginationMeta(
  currentPage: number,
  limit: number,
  itemsCount: number,
  links?: JsonApiLinks,
  knownTotal?: number
): {
  totalItems: number
  totalPages: number
  fromItem: number
  toItem: number
  offset: number
} {
  const offset = (currentPage - 1) * limit
  let totalItems = knownTotal ?? 0

  if (links?.last) {
    const lastOffset = extractOffsetFromUrl(links.last)
    if (lastOffset !== null) {
      // Offset of last page + items on that page (~limit)
      totalItems = Math.max(totalItems, lastOffset + limit)
    }
  }

  // Fallback if no last link or knownTotal
  if (totalItems === 0) {
    totalItems = offset + itemsCount
    if (links?.next) {
      totalItems += limit // At least one more page
    }
  }

  // Ensure total is at least current items viewed
  if (offset + itemsCount > totalItems) {
    totalItems = offset + itemsCount
  }

  const totalPages = Math.max(1, Math.ceil(totalItems / limit))
  const fromItem = itemsCount > 0 ? offset + 1 : 0
  const toItem = offset + itemsCount

  return {
    totalItems,
    totalPages,
    fromItem,
    toItem,
    offset,
  }
}

/**
 * Generates an array of page numbers with ellipses
 * E.g., [1, 2, 3, '...', 40] or [1, '...', 4, 5, 6, '...', 40]
 */
export function getPaginationRange(
  currentPage: number,
  totalPages: number,
  siblingCount = 1
): (number | 'ellipsis-start' | 'ellipsis-end')[] {
  // If total pages is small, show all
  const totalPageNumbers = siblingCount * 2 + 5 // e.g. 1 + 2 + 1 + 2 + 1 = 7
  if (totalPages <= totalPageNumbers) {
    return Array.from({ length: totalPages }, (_, i) => i + 1)
  }

  const leftSiblingIndex = Math.max(currentPage - siblingCount, 1)
  const rightSiblingIndex = Math.min(currentPage + siblingCount, totalPages)

  const shouldShowLeftEllipsis = leftSiblingIndex > 2
  const shouldShowRightEllipsis = rightSiblingIndex < totalPages - 1

  if (!shouldShowLeftEllipsis && shouldShowRightEllipsis) {
    const leftItemCount = 3 + 2 * siblingCount
    const leftRange = Array.from({ length: leftItemCount }, (_, i) => i + 1)
    return [...leftRange, 'ellipsis-end', totalPages]
  }

  if (shouldShowLeftEllipsis && !shouldShowRightEllipsis) {
    const rightItemCount = 3 + 2 * siblingCount
    const rightRange = Array.from(
      { length: rightItemCount },
      (_, i) => totalPages - rightItemCount + i + 1
    )
    return [1, 'ellipsis-start', ...rightRange]
  }

  // Both ellipses
  const middleRange = Array.from(
    { length: rightSiblingIndex - leftSiblingIndex + 1 },
    (_, i) => leftSiblingIndex + i
  )
  return [1, 'ellipsis-start', ...middleRange, 'ellipsis-end', totalPages]
}

