'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Crown, Medal, Sparkles, Trophy, PartyPopper } from 'lucide-react'
import Image from 'next/image'
import type { DetailedLeaderboardEntry } from '@/types/finale'

interface WinnersCelebrationProps {
  winners: DetailedLeaderboardEntry[]
}

export function WinnersCelebration({ winners }: WinnersCelebrationProps) {
  if (winners.length === 0) return null

  const firstPlace = winners.find((w) => w.rank === 1)
  const secondPlace = winners.find((w) => w.rank === 2)
  const thirdPlace = winners.find((w) => w.rank === 3)

  return (
    <div className="space-y-6">
      {/* Celebration Header */}
      <Card className="bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-950/20 dark:to-orange-950/20 border-2 border-yellow-400">
        <CardContent className="pt-6">
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center gap-3">
              <PartyPopper className="w-8 h-8 text-yellow-500" />
              <h2 className="text-3xl font-bold bg-gradient-to-r from-yellow-600 to-orange-600 bg-clip-text text-transparent">
                December Showcase 2025 Winners!
              </h2>
              <PartyPopper className="w-8 h-8 text-yellow-500" />
            </div>
            <p className="text-muted-foreground">
              Congratulations to our incredible finalists! 🎉
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Winners Podium */}
      <div className="grid md:grid-cols-3 gap-6 items-end">
        {/* 2nd Place */}
        {secondPlace && (
          <div className="order-1 md:order-1">
            <Card className="border-2 border-gray-400 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-950">
              <CardContent className="pt-6 text-center space-y-4">
                <div className="flex justify-center">
                  <Badge className="bg-gray-400 text-white text-lg px-4 py-2">
                    <Medal className="w-5 h-5 mr-2 fill-current" />
                    2nd Place
                  </Badge>
                </div>

                {secondPlace.artist?.photo_url && (
                  <div className="relative w-32 h-32 mx-auto">
                    <Image
                      src={secondPlace.artist.photo_url}
                      alt={secondPlace.artist.name}
                      className="rounded-full border-4 border-gray-400 object-cover"
                      width={128}
                      height={128}
                    />
                  </div>
                )}

                <div>
                  <h3 className="text-2xl font-bold">
                    {secondPlace.artist?.stage_name || secondPlace.artist?.name}
                  </h3>
                  {secondPlace.artist?.stage_name && (
                    <p className="text-sm text-muted-foreground">
                      {secondPlace.artist.name}
                    </p>
                  )}
                </div>

                <div className="pt-4">
                  <p className="text-3xl font-bold text-gray-600">
                    {secondPlace.scores.total_score.toFixed(2)}
                  </p>
                  <p className="text-sm text-muted-foreground">points</p>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* 1st Place - Champion */}
        {firstPlace && (
          <div className="order-2 md:order-2 md:-mt-8">
            <Card className="border-4 border-yellow-400 bg-gradient-to-b from-yellow-50 to-white dark:from-yellow-950/20 dark:to-gray-950 shadow-2xl">
              <CardContent className="pt-6 text-center space-y-4">
                <div className="flex justify-center relative">
                  <Sparkles className="absolute -left-8 top-0 w-6 h-6 text-yellow-500 animate-pulse" />
                  <Badge className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white text-xl px-6 py-3">
                    <Crown className="w-6 h-6 mr-2 fill-current" />
                    CHAMPION
                  </Badge>
                  <Sparkles className="absolute -right-8 top-0 w-6 h-6 text-yellow-500 animate-pulse" />
                </div>

                {firstPlace.artist?.photo_url && (
                  <div className="relative w-40 h-40 mx-auto">
                    <div className="absolute inset-0 bg-yellow-400 rounded-full animate-ping opacity-20"></div>
                    <Image
                      src={firstPlace.artist.photo_url}
                      alt={firstPlace.artist.name}
                      className="relative rounded-full border-4 border-yellow-400 object-cover"
                      width={160}
                      height={160}
                    />
                  </div>
                )}

                <div>
                  <h3 className="text-3xl font-bold bg-gradient-to-r from-yellow-600 to-orange-600 bg-clip-text text-transparent">
                    {firstPlace.artist?.stage_name || firstPlace.artist?.name}
                  </h3>
                  {firstPlace.artist?.stage_name && (
                    <p className="text-sm text-muted-foreground">
                      {firstPlace.artist.name}
                    </p>
                  )}
                </div>

                <div className="pt-4">
                  <Trophy className="w-12 h-12 mx-auto text-yellow-500 mb-2" />
                  <p className="text-4xl font-bold text-yellow-600">
                    {firstPlace.scores.total_score.toFixed(2)}
                  </p>
                  <p className="text-sm text-muted-foreground">points</p>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* 3rd Place */}
        {thirdPlace && (
          <div className="order-3 md:order-3">
            <Card className="border-2 border-amber-700 bg-gradient-to-b from-amber-50 to-white dark:from-amber-950/20 dark:to-gray-950">
              <CardContent className="pt-6 text-center space-y-4">
                <div className="flex justify-center">
                  <Badge className="bg-amber-700 text-white text-lg px-4 py-2">
                    <Medal className="w-5 h-5 mr-2 fill-current" />
                    3rd Place
                  </Badge>
                </div>

                {thirdPlace.artist?.photo_url && (
                  <div className="relative w-32 h-32 mx-auto">
                    <Image
                      src={thirdPlace.artist.photo_url}
                      alt={thirdPlace.artist.name}
                      className="rounded-full border-4 border-amber-700 object-cover"
                      width={128}
                      height={128}
                    />
                  </div>
                )}

                <div>
                  <h3 className="text-2xl font-bold">
                    {thirdPlace.artist?.stage_name || thirdPlace.artist?.name}
                  </h3>
                  {thirdPlace.artist?.stage_name && (
                    <p className="text-sm text-muted-foreground">
                      {thirdPlace.artist.name}
                    </p>
                  )}
                </div>

                <div className="pt-4">
                  <p className="text-3xl font-bold text-amber-700">
                    {thirdPlace.scores.total_score.toFixed(2)}
                  </p>
                  <p className="text-sm text-muted-foreground">points</p>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>

      {/* Thank You Message */}
      <Card className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-950/20 dark:to-blue-950/20">
        <CardContent className="pt-6">
          <div className="text-center space-y-2">
            <p className="text-lg font-semibold">Thank you to all participants and judges!</p>
            <p className="text-muted-foreground">
              Your talent, dedication, and passion made this competition unforgettable. 💫
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
