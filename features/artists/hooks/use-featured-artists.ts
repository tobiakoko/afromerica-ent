/* 
  Featured Artists Hook
    Fetches and caches featured artists data using React Query
    Suitable for displaying highlighted 
    artists on the homepage or special sections
*/

import { useQuery } from '@tanstack/react-query'
import { artistsApi } from '../api/artists-api'

export function useFeaturedArtists() {
  return useQuery({
    queryKey: ['artists', 'featured'],
    queryFn: artistsApi.getFeaturedArtists,
    staleTime: 10 * 60 * 1000,
  })
}