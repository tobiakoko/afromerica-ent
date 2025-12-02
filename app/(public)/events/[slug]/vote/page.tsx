/**
 * Vote Page
 * Allows users to vote for their favorite artists
 */

import { createCachedClient } from '@/utils/supabase/server-cached'
import { VotingForm } from '@/components/forms/VoteForm'
import { SiInstagram, SiTiktok } from 'react-icons/si'
import type { IconType } from 'react-icons'
import { TrendingUp, Award, Music } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { notFound, redirect } from 'next/navigation'

// Enable ISR with 30-second revalidation
export const revalidate = 30

const socialIcons: Record<string, IconType> = {
  instagram: SiInstagram,
  tiktok: SiTiktok,
}

interface VotePageProps {
  params: Promise<{ slug: string }>
  searchParams: Promise<{ artist?: string }>
}

export default async function VotePage({ params, searchParams }: VotePageProps) {
  const { slug: eventSlug } = await params
  const { artist: artistSlug } = await searchParams
  const supabase = createCachedClient()

  // Redirect to leaderboard if no artist is selected
  if (!artistSlug) {
    redirect(`/events/${eventSlug}/leaderboard`)
  }

  // Validate that the event exists and is active
  const { error: eventError } = await supabase
    .from('events')
    .select('id')
    .eq('slug', eventSlug)
    .eq('is_active', true)
    .single()

  if (eventError) {
    console.error('Error fetching event:', {
      message: eventError.message,
      details: eventError.details,
      hint: eventError.hint,
      code: eventError.code,
    })
    notFound()
  }

  // Fetch base vote price from vote_packages (smallest package)
  const { data: basePackage } = await supabase
    .from('vote_packages')
    .select('price, votes')
    .eq('is_active', true)
    .order('votes', { ascending: true })
    .limit(1)
    .single()

  // Calculate price per vote from the base package (default: ₦500 per vote)
  const votePrice = basePackage ? basePackage.price / basePackage.votes : 500

  // Fetch the selected artist with full details
  const { data: artist, error: artistError } = await supabase
    .from('artists')
    .select(`
      id,
      name,
      slug,
      stage_name,
      bio,
      genre,
      photo_url,
      cover_image_url,
      instagram,
      tiktok,
      total_votes,
      rank,
      is_active
    `)
    .eq('slug', artistSlug)
    .eq('is_active', true)
    .is('deleted_at', null)
    .maybeSingle()

  if (artistError) {
    console.error('Error fetching artist:', {
      message: artistError.message,
      details: artistError.details,
      hint: artistError.hint,
      code: artistError.code,
    })
    notFound()
  }

  if (!artist) {
    notFound()
  }

  // Build social media object from individual columns
  const socialMedia: Record<string, string> = {}
  if (artist.instagram) socialMedia.instagram = artist.instagram
  if (artist.tiktok) socialMedia.tiktok = artist.tiktok

  const genres = Array.isArray(artist.genre) ? artist.genre : []

  return (
    <div className="min-h-screen">
      {/* Artist Profile Section */}
      <section className="relative overflow-hidden">
        {/* Background Gradient */}
        <div className="absolute inset-0 bg-linear-to-b from-white via-gray-50/50 to-white dark:from-gray-950 dark:via-gray-900/50 dark:to-gray-950" />

        {/* Cover Image with Parallax Effect */}
        <div className="relative h-[50vh] md:h-[60vh] w-full overflow-hidden">
          {(artist.cover_image_url || artist.photo_url) ? (
            <Image
              src={artist.cover_image_url || artist.photo_url}
              alt={`${artist.name} cover image`}
              fill
              className="object-cover"
              priority
              unoptimized
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-linear-to-br from-gray-100 via-gray-50 to-white dark:from-gray-900 dark:via-gray-800 dark:to-gray-950">
              <div className="relative">
                <div className="absolute inset-0 bg-linear-to-br from-blue-500/20 to-purple-500/20 blur-3xl rounded-full" />
                <Music className="relative w-32 h-32 text-gray-300 dark:text-gray-700 stroke-[1.5]" aria-hidden="true" />
              </div>
            </div>
          )}
          {/* Sophisticated Gradient Overlay */}
          <div className="absolute inset-0 bg-linear-to-t from-white via-white/80 to-transparent dark:from-gray-950 dark:via-gray-950/80 dark:to-transparent" />
        </div>

        {/* Artist Info Container */}
        <div className="relative max-w-[1440px] mx-auto px-6 md:px-12 lg:px-16">
          <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 items-start -mt-24 lg:-mt-32">
            {/* Profile Image with Enhanced Shadow */}
            <div className="relative shrink-0 animate-in fade-in slide-in-from-bottom-4 duration-1000 [animation-delay:100ms]">
              <div className="relative w-48 h-48 md:w-56 md:h-56 lg:w-64 lg:h-64 rounded-2xl overflow-hidden border-4 border-white dark:border-gray-950 shadow-2xl shadow-black/20 dark:shadow-black/60 transition-transform duration-500 hover:scale-105">
                {artist.photo_url ? (
                  <Image
                    src={artist.photo_url}
                    alt={artist.name}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-linear-to-br from-gray-100 to-gray-50 dark:from-gray-800 dark:to-gray-900">
                    <Music className="w-20 h-20 text-gray-300 dark:text-gray-700 stroke-[1.5]" aria-hidden="true" />
                  </div>
                )}
              </div>

              {/* Rank Badge */}
              {artist.rank && artist.rank <= 10 && (
                <div className="absolute -top-3 -right-3 px-4 py-2 bg-linear-to-br from-blue-500 to-purple-500 rounded-full shadow-lg backdrop-blur-md">
                  <div className="flex items-center gap-1.5">
                    <Award className="w-4 h-4 text-white stroke-2" aria-hidden="true" />
                    <span className="text-white font-bold text-sm">#{artist.rank}</span>
                  </div>
                </div>
              )}
            </div>

            {/* Details with Staggered Animation */}
            <div className="flex-1 pt-0 lg:pt-20 pb-8 animate-in fade-in slide-in-from-bottom-4 duration-1000 [animation-delay:200ms]">
              {/* Name and Stage Name */}
              <div className="mb-6">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-semibold tracking-tight text-gray-900 dark:text-white mb-3 leading-tight">
                  {artist.name}
                </h1>
                {artist.stage_name && (
                  <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-400 font-light">
                    &quot;{artist.stage_name}&quot;
                  </p>
                )}
              </div>

              {/* Genres with Apple Style Pills */}
              {genres.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-8">
                  {genres.map((genre) => (
                    <span
                      key={genre}
                      className="px-4 py-1.5 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white rounded-full text-sm font-medium transition-all duration-300 hover:bg-gray-200 dark:hover:bg-gray-700 animate-in fade-in slide-in-from-bottom-2"
                    >
                      {genre}
                    </span>
                  ))}
                </div>
              )}

              {/* Stats Row - Apple Style Metrics */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-8 animate-in fade-in slide-in-from-bottom-4 duration-1000 [animation-delay:400ms]">
                {artist.total_votes !== undefined && artist.total_votes > 0 && (
                  <div className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-md rounded-2xl p-5 border border-gray-200/60 dark:border-gray-800 shadow-lg hover:shadow-xl transition-all duration-500 hover:-translate-y-0.5">
                    <div className="flex items-center gap-2 mb-2">
                      <TrendingUp className="w-[18px] h-[18px] text-gray-600 dark:text-gray-400 stroke-[1.5]" aria-hidden="true" />
                      <span className="text-xs font-medium text-gray-500 dark:text-gray-500 uppercase tracking-wider">Total Votes</span>
                    </div>
                    <div className="text-3xl font-semibold tracking-tight text-gray-900 dark:text-white">
                      {artist.total_votes.toLocaleString()}
                    </div>
                  </div>
                )}

                {artist.rank && (
                  <div className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-md rounded-2xl p-5 border border-gray-200/60 dark:border-gray-800 shadow-lg hover:shadow-xl transition-all duration-500 hover:-translate-y-0.5">
                    <div className="flex items-center gap-2 mb-2">
                      <Award className="w-[18px] h-[18px] text-gray-600 dark:text-gray-400 stroke-[1.5]" aria-hidden="true" />
                      <span className="text-xs font-medium text-gray-500 dark:text-gray-500 uppercase tracking-wider">Ranking</span>
                    </div>
                    <div className="text-3xl font-semibold tracking-tight text-gray-900 dark:text-white">
                      #{artist.rank}
                    </div>
                  </div>
                )}
              </div>

              {/* Social Links with Enhanced Styling */}
              {Object.keys(socialMedia).length > 0 && (
                <div className="flex flex-wrap gap-3 mb-8 animate-in fade-in slide-in-from-bottom-4 duration-1000 [animation-delay:500ms]">
                  {Object.entries(socialMedia).map(([platform, url]) => {
                    const Icon = socialIcons[platform] ?? SiTiktok
                    return (
                      <Button
                        key={platform}
                        variant="outline"
                        size="icon"
                        asChild
                        className="rounded-xl border-gray-200/60 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700 transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5"
                      >
                        <Link href={url} target="_blank" rel="noopener noreferrer" aria-label={`Visit ${platform}`}>
                          <Icon className="w-[18px] h-[18px] stroke-[1.5]" aria-hidden="true" />
                        </Link>
                      </Button>
                    )
                  })}
                </div>
              )}

              {/* Bio Section with Apple Typography */}
              {artist.bio && (
                <div className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-md rounded-2xl p-8 border border-gray-200/60 dark:border-gray-800 shadow-lg animate-in fade-in slide-in-from-bottom-4 duration-1000 [animation-delay:600ms]">
                  <h2 className="text-2xl font-semibold tracking-tight text-gray-900 dark:text-white mb-4">
                    About
                  </h2>
                  <div className="prose prose-lg dark:prose-invert max-w-none">
                    <p className="text-lg md:text-xl text-gray-600 dark:text-gray-400 font-light leading-relaxed whitespace-pre-wrap">
                      {artist.bio}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Voting Form Section */}
      <section className="relative pb-24 md:pb-32 border-t border-gray-200/60 dark:border-gray-800 mt-16 md:mt-20">
        <div className="relative max-w-4xl mx-auto px-6 md:px-12 lg:px-16 pt-16 md:pt-20">
          {/* Section Header */}
          <div className="mb-10 text-center animate-in fade-in slide-in-from-bottom-4 duration-1000">
            <h2 className="text-3xl md:text-4xl font-semibold tracking-tight text-gray-900 dark:text-white mb-3">
              Cast Your Vote
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 font-light">
              Purchase votes to support {artist.stage_name || artist.name}
            </p>
          </div>

          <div className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-md rounded-2xl border border-gray-200/60 dark:border-gray-800 p-8 md:p-10 shadow-2xl shadow-black/10 dark:shadow-black/40 animate-in fade-in slide-in-from-bottom-4 duration-1000 [animation-delay:200ms]">
            <VotingForm
              artists={[artist]}
              preselectedArtistSlug={artistSlug}
              votePrice={votePrice}
            />
          </div>

          {/* Info Cards */}
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-1000 [animation-delay:400ms]">
            <div className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-md rounded-2xl border border-gray-200/60 dark:border-gray-800 p-6 shadow-lg text-center">
              <div className="w-12 h-12 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-gray-600 dark:text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Instant Processing</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 font-light">Your votes are counted immediately after payment</p>
            </div>

            <div className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-md rounded-2xl border border-gray-200/60 dark:border-gray-800 p-6 shadow-lg text-center">
              <div className="w-12 h-12 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-gray-600 dark:text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Secure Payment</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 font-light">Powered by Paystack&apos;s secure payment system</p>
            </div>

            <div className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-md rounded-2xl border border-gray-200/60 dark:border-gray-800 p-6 shadow-lg text-center">
              <div className="w-12 h-12 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-gray-600 dark:text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Real-time Updates</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 font-light">Watch the leaderboard update in real-time</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}