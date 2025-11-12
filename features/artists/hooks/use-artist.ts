/*
    Single artist hook 
      Fetches individual artist
*/

import { useQuery } from '@tanstack/react-query'
import { artistsApi } from '../api/artists-api'

export function useArtist(slug: string) {
  return useQuery({
    queryKey: ['artists', slug],
    queryFn: () => artistsApi.getArtist(slug),
    enabled: !!slug,
  })
}
