import { apiClient } from '@/lib/api/client'
import type { Artist, PaginatedResponse } from '@/types'

export const artistsApi = {
  getArtists: async (params?: {
    page?: number
    limit?: number
    genre?: string
  }): Promise<PaginatedResponse<Artist>> => {
    const response = await apiClient.get<PaginatedResponse<Artist>>('/artists', params)
    return response.data
  },

  getArtist: async (slug: string): Promise<Artist> => {
    const response = await apiClient.get<Artist>(`/artists/${slug}`)
    return response.data
  },

  getFeaturedArtists: async (): Promise<Artist[]> => {
    const response = await apiClient.get<Artist[]>('/artists/featured')
    return response.data
  },
}