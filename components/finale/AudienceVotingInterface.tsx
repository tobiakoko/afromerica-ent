'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { toast } from 'sonner'
import Image from 'next/image'
import { Loader2, CheckCircle2, AlertCircle, Heart } from 'lucide-react'
import type {
  FinaleVoter,
  FinaleConfig,
  FinaleContestant,
  VoteResponse,
} from '@/types/finale'
import { hasVotedForStage, getStageDisplayName, getVoterTypeDisplayName } from '@/types/finale'
import { createClient } from '@/utils/supabase/client'

interface AudienceVotingInterfaceProps {
  voter: FinaleVoter
  config: FinaleConfig
  eventSlug: string
  token: string
}

interface ContestantWithArtist extends FinaleContestant {
  artists: {
    id: string
    name: string
    stage_name: string | null
    photo_url: string | null
  }
}

export function AudienceVotingInterface({
  voter,
  config,
  eventSlug,
  token,
}: AudienceVotingInterfaceProps) {
  const router = useRouter()
  const supabase = createClient()

  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [contestants, setContestants] = useState<ContestantWithArtist[]>([])
  const [selectedContestant, setSelectedContestant] = useState<string | null>(null)

  const currentStage = config.current_stage

  // Check if voter has already voted for this stage
  const alreadyVoted = currentStage ? hasVotedForStage(voter, currentStage) : false

  useEffect(() => {
    async function fetchContestants() {
      try {
        console.log('Fetching contestants for event:', voter.event_id)
        console.log('Current stage:', currentStage)

        let query = supabase
          .from('finale_contestants')
          .select('*, artists!finale_contestants_artist_id_fkey(id, name, stage_name, photo_url)')
          .eq('event_id', voter.event_id)
          .eq('is_active', true)
          .order('contestant_number')

        // For stage 4, only show finalists
        if (currentStage === 'stage_4') {
          query = query.eq('is_finalist', true)
        }

        const { data, error } = await query

        console.log('Query result - Data count:', data?.length || 0)
        console.log('Query result - Error:', error)

        if (error) {
          console.error('Supabase error details:', {
            message: error.message,
            details: error.details,
            hint: error.hint,
            code: error.code,
          })
          toast.error(`Failed to load contestants: ${error.message || 'Unknown error'}`)
          setLoading(false)
          return
        }

        if (!data || data.length === 0) {
          console.warn('No contestants found for event:', voter.event_id)
          toast.error('No contestants found for this event')
        }

        setContestants((data || []) as ContestantWithArtist[])
      } catch (error) {
        const err = error as { message?: string }
        console.error('Error fetching contestants:', {
          message: err?.message || 'Unknown error',
          error: error,
        })
        toast.error(`Failed to load contestants: ${err?.message || 'Please try again'}`)
      } finally {
        setLoading(false)
      }
    }

    fetchContestants()
  }, [supabase, voter.event_id, currentStage])

  const handleSubmit = async () => {
    if (!selectedContestant) {
      toast.error('Please select a contestant to vote for')
      return
    }

    if (!currentStage) {
      toast.error('No active stage')
      return
    }

    // Validate token exists
    if (!token) {
      toast.error('Authentication token missing. Please log in again.')
      return
    }

    setSubmitting(true)

    try {
      const response = await fetch('/api/finale/vote/audience', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          voter_id: voter.id,
          event_id: voter.event_id,
          contestant_id: selectedContestant,
          stage: currentStage,
        }),
      })

      const data: VoteResponse = await response.json()

      if (!response.ok || !data.success) {
        toast.error(data.message || 'Failed to submit vote')
        setSubmitting(false)
        return
      }

      toast.success('Vote submitted successfully!')

      // Redirect to leaderboard after a delay
      setTimeout(() => {
        router.push(`/events/${eventSlug}/finale/leaderboard`)
      }, 1500)
    } catch (error) {
      console.error('Error submitting vote:', error)
      toast.error('An error occurred while submitting your vote')
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }

  if (!config.voting_enabled) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center space-y-4">
            <AlertCircle className="w-12 h-12 mx-auto text-yellow-500" />
            <h3 className="text-lg font-semibold">Voting is Currently Closed</h3>
            <p className="text-muted-foreground">
              Please wait for the organizers to open voting.
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (alreadyVoted) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center space-y-4">
            <CheckCircle2 className="w-12 h-12 mx-auto text-green-500" />
            <h3 className="text-lg font-semibold">Vote Already Submitted</h3>
            <p className="text-muted-foreground">
              You have already voted for {currentStage && getStageDisplayName(currentStage)}.
              Thank you for participating!
            </p>
            <Button onClick={() => router.push(`/events/${eventSlug}/finale/leaderboard`)}>
              View Leaderboard
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!currentStage) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center">
            <p className="text-muted-foreground">No active stage configured.</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  const selectedContestantData = contestants.find((c) => c.id === selectedContestant)

  return (
    <div className="space-y-6">
      {/* Voter Info */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>{getStageDisplayName(currentStage)}</CardTitle>
              <CardDescription>
                Voting as: {getVoterTypeDisplayName(voter.voter_type)}
              </CardDescription>
            </div>
            <Badge variant="secondary" className="text-sm">
              1 Vote Per Stage
            </Badge>
          </div>
        </CardHeader>
      </Card>

      {/* Contestant Selection */}
      <Card>
        <CardHeader>
          <CardTitle>Select Your Favorite Contestant</CardTitle>
          <CardDescription>
            Choose one contestant to support for this stage
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {contestants.map((contestant) => (
              <button
                key={contestant.id}
                onClick={() => setSelectedContestant(contestant.id)}
                className={`group relative overflow-hidden rounded-lg border-2 transition-all hover:scale-105 ${
                  selectedContestant === contestant.id
                    ? 'border-primary shadow-lg'
                    : 'border-border hover:border-primary/50'
                }`}
              >
                {/* Contestant Image */}
                <div className="aspect-square relative">
                  {contestant.artists.photo_url ? (
                    <Image
                      src={contestant.artists.photo_url}
                      alt={contestant.artists.name}
                      className="w-full h-full object-cover"
                      width={400}
                      height={400}
                    />
                  ) : (
                    <div className="w-full h-full bg-linear-to-br from-purple-400 to-pink-600 flex items-center justify-center">
                      <span className="text-6xl font-bold text-white">
                        {contestant.contestant_number}
                      </span>
                    </div>
                  )}

                  {/* Selected Overlay */}
                  {selectedContestant === contestant.id && (
                    <div className="absolute inset-0 bg-primary/20 flex items-center justify-center">
                      <CheckCircle2 className="w-16 h-16 text-primary drop-shadow-lg" />
                    </div>
                  )}

                  {/* Contestant Number Badge */}
                  <div className="absolute top-2 left-2">
                    <Badge className="text-lg px-3 py-1">
                      #{contestant.contestant_number}
                    </Badge>
                  </div>

                  {/* Finalist Badge */}
                  {contestant.is_finalist && (
                    <div className="absolute top-2 right-2">
                      <Badge variant="secondary" className="bg-yellow-500 text-white">
                        Finalist
                      </Badge>
                    </div>
                  )}
                </div>

                {/* Contestant Info */}
                <div className="p-4 bg-background">
                  <p className="font-bold text-lg">
                    {contestant.artists.stage_name || contestant.artists.name}
                  </p>
                  {contestant.artists.stage_name && (
                    <p className="text-sm text-muted-foreground">
                      {contestant.artists.name}
                    </p>
                  )}
                </div>
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Vote Confirmation */}
      {selectedContestant && selectedContestantData && (
        <Card className="border-primary">
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <div className="flex items-center justify-center gap-2">
                <Heart className="w-6 h-6 text-primary fill-primary" />
                <h3 className="text-xl font-semibold">Confirm Your Vote</h3>
              </div>
              <p className="text-muted-foreground">
                You are voting for{' '}
                <strong>
                  {selectedContestantData.artists.stage_name ||
                    selectedContestantData.artists.name}
                </strong>
              </p>
              <div className="flex gap-4 justify-center">
                <Button
                  variant="outline"
                  onClick={() => setSelectedContestant(null)}
                  disabled={submitting}
                >
                  Change Selection
                </Button>
                <Button
                  onClick={handleSubmit}
                  disabled={submitting}
                  size="lg"
                  className="min-w-[200px]"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      <Heart className="w-4 h-4 mr-2 fill-current" />
                      Submit Vote
                    </>
                  )}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Voting Info */}
      <Card className="bg-muted">
        <CardContent className="pt-6">
          <div className="space-y-2 text-sm text-muted-foreground">
            <p>
              <strong>Note:</strong> You can only vote once per stage. Your vote contributes to the
              overall score with a weight of {voter.voter_type === 'in_house' ? '25%' : '15%'}.
            </p>
            <p>Choose wisely and support your favorite contestant!</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
