'use client'

import { Music, Instagram, Twitter, Facebook, Heart, Share2, Calendar } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import type { Artist } from '../types/artist.types'

interface ArtistDetailContentProps {
  artist: Artist
}

export function ArtistDetailContent({ artist }: ArtistDetailContentProps) {
  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: artist.name,
        text: artist.bio,
        url: window.location.href,
      })
    }
  }

  return (
    <div className="min-h-screen bg-black">
      {/* Hero Section */}
      <div className="relative h-[60vh] overflow-hidden">
        {artist.image && (
          <Image
            src={artist.image}
            alt={artist.name}
            fill
            className="object-cover"
            priority
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />

        {/* Artist Info Overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-8">
          <div className="container mx-auto">
            <div className="flex items-center gap-3 mb-4">
              <span className="px-3 py-1 rounded-full text-sm font-semibold bg-lime-400 text-black">
                Artist
              </span>
              {artist.genre && (
                <span className="px-3 py-1 rounded-full text-sm font-semibold bg-white/10 text-white">
                  {artist.genre}
                </span>
              )}
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
              {artist.name}
            </h1>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Bio */}
            <section>
              <h2 className="text-3xl font-bold text-white mb-4">About</h2>
              <p className="text-white/70 text-lg leading-relaxed">
                {artist.bio || 'Biography coming soon.'}
              </p>
            </section>

            {/* Upcoming Events */}
            {artist.events && artist.events.length > 0 && (
              <section>
                <h2 className="text-3xl font-bold text-white mb-6">Upcoming Events</h2>
                <div className="space-y-4">
                  {artist.events.map((event: any) => (
                    <Link
                      key={event.id}
                      href={`/events/${event.slug}`}
                      className="block bg-white/5 rounded-lg p-6 border border-white/10 hover:border-lime-400/50 transition-all"
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="text-xl font-bold text-white mb-2">
                            {event.title}
                          </h3>
                          <div className="flex items-center gap-2 text-white/60">
                            <Calendar className="w-4 h-4" />
                            <span>{event.date}</span>
                          </div>
                        </div>
                        <Button variant="outline" size="sm">
                          Get Tickets
                        </Button>
                      </div>
                    </Link>
                  ))}
                </div>
              </section>
            )}

            {/* Albums/Releases */}
            {artist.albums && artist.albums.length > 0 && (
              <section>
                <h2 className="text-3xl font-bold text-white mb-6">Releases</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                  {artist.albums.map((album: any) => (
                    <div key={album.id} className="group cursor-pointer">
                      <div className="relative overflow-hidden rounded-lg mb-3 aspect-square bg-white/5">
                        {album.image && (
                          <Image
                            src={album.image}
                            alt={album.title}
                            fill
                            className="object-cover transition-transform duration-300 group-hover:scale-110"
                          />
                        )}
                      </div>
                      <h3 className="text-white font-semibold">{album.title}</h3>
                      <p className="text-white/60 text-sm">{album.year}</p>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">
              {/* Social Links */}
              <div className="bg-white/5 rounded-lg p-6 border border-white/10">
                <h3 className="text-white font-semibold mb-4">Follow</h3>
                <div className="space-y-3">
                  {artist.socialLinks?.instagram && (
                    <a
                      href={artist.socialLinks.instagram}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 text-white/70 hover:text-lime-400 transition-colors"
                    >
                      <Instagram className="w-5 h-5" />
                      <span>Instagram</span>
                    </a>
                  )}
                  {artist.socialLinks?.twitter && (
                    <a
                      href={artist.socialLinks.twitter}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 text-white/70 hover:text-lime-400 transition-colors"
                    >
                      <Twitter className="w-5 h-5" />
                      <span>Twitter</span>
                    </a>
                  )}
                  {artist.socialLinks?.facebook && (
                    <a
                      href={artist.socialLinks.facebook}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 text-white/70 hover:text-lime-400 transition-colors"
                    >
                      <Facebook className="w-5 h-5" />
                      <span>Facebook</span>
                    </a>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="space-y-3">
                <Button
                  variant="outline"
                  className="w-full bg-white/5 border-white/10 text-white hover:bg-white/10"
                >
                  <Heart className="w-5 h-5 mr-2" />
                  Follow Artist
                </Button>
                <Button
                  variant="outline"
                  className="w-full bg-white/5 border-white/10 text-white hover:bg-white/10"
                  onClick={handleShare}
                >
                  <Share2 className="w-5 h-5 mr-2" />
                  Share
                </Button>
              </div>

              {/* Stats */}
              {(artist.followers || artist.monthlyListeners) && (
                <div className="bg-white/5 rounded-lg p-6 border border-white/10">
                  <h3 className="text-white font-semibold mb-4">Stats</h3>
                  <div className="space-y-3">
                    {artist.followers && (
                      <div>
                        <p className="text-white/60 text-sm">Followers</p>
                        <p className="text-white text-2xl font-bold">
                          {artist.followers.toLocaleString()}
                        </p>
                      </div>
                    )}
                    {artist.monthlyListeners && (
                      <div>
                        <p className="text-white/60 text-sm">Monthly Listeners</p>
                        <p className="text-white text-2xl font-bold">
                          {artist.monthlyListeners.toLocaleString()}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
