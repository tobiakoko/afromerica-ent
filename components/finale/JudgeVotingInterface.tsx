'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { toast } from 'sonner'
import { Loader2, CheckCircle2, AlertCircle } from 'lucide-react'
import type {
  FinaleVoter,
  FinaleConfig,
  FinaleContestant,
  StageCriteria,
  VoteResponse,
} from '@/types/finale'
import {
  STAGE_CONFIGS,
  calculateTotalScore,
  hasVotedForStage,
  getStageDisplayName,
} from '@/types/finale'
import { createClient } from '@/utils/supabase/client'

interface JudgeVotingInterfaceProps {
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

export function JudgeVotingInterface({
  voter,
  config,
  eventSlug,
  token,
}: JudgeVotingInterfaceProps) {
  const router = useRouter()
  const supabase = createClient()

  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [contestants, setContestants] = useState<ContestantWithArtist[]>([])
  const [selectedContestant, setSelectedContestant] = useState<string | null>(null)
  const [scores, setScores] = useState<Record<string, number>>({})
  const [notes, setNotes] = useState('')

  const currentStage = config.current_stage
  const stageConfig = currentStage ? STAGE_CONFIGS[currentStage] : null

  // Check if judge has already voted for this stage
  const alreadyVoted = currentStage ? hasVotedForStage(voter, currentStage) : false

  useEffect(() => {
    async function fetchContestants() {
      try {
        let query = supabase
          .from('finale_contestants')
          .select('*, artists:artist_id(id, name, stage_name, photo_url)')
          .eq('event_id', voter.event_id)
          .eq('is_active', true)
          .order('contestant_number')

        // For stage 4, only show finalists
        if (currentStage === 'stage_4') {
          query = query.eq('is_finalist', true)
        }

        const { data, error } = await query

        if (error) throw error

        setContestants((data || []) as ContestantWithArtist[])
      } catch (error) {
        console.error('Error fetching contestants:', error)
        toast.error('Failed to load contestants')
      } finally {
        setLoading(false)
      }
    }

    fetchContestants()
  }, [supabase, voter.event_id, currentStage])

  // Initialize scores when stage config changes
  useEffect(() => {
    if (stageConfig) {
      const initialScores: Record<string, number> = {}
      stageConfig.criteria.forEach((criterion) => {
        initialScores[criterion.key] = 0
      })
      setScores(initialScores)
    }
  }, [stageConfig])

  const handleScoreChange = (key: string, value: number) => {
    const criterion = stageConfig?.criteria.find((c) => c.key === key)
    if (!criterion) return

    // Ensure value is within valid range
    const clampedValue = Math.max(0, Math.min(value, criterion.max))
    setScores({ ...scores, [key]: clampedValue })
  }

  const handleSubmit = async () => {
    if (!selectedContestant) {
      toast.error('Please select a contestant to vote for')
      return
    }

    if (!currentStage) {
      toast.error('No active stage')
      return
    }

    // Validate all scores are filled
    const allScoresFilled = stageConfig?.criteria.every(
      (criterion) => scores[criterion.key] !== undefined
    )

    if (!allScoresFilled) {
      toast.error('Please fill in all scoring criteria')
      return
    }

    const totalScore = calculateTotalScore(scores as StageCriteria)
    const maxScore = stageConfig?.max_score || 0

    if (totalScore > maxScore) {
      toast.error(`Total score (${totalScore}) exceeds maximum (${maxScore})`)
      return
    }

    setSubmitting(true)

    try {
      const response = await fetch('/api/finale/vote/judge', {
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
          criteria_scores: scores,
          notes: notes || undefined,
        }),
      })

      const data: VoteResponse = await response.json()

      if (!response.ok || !data.success) {
        toast.error(data.message || 'Failed to submit vote')
        setSubmitting(false)
        return
      }

      toast.success('Vote submitted successfully!')

      // Clear form
      setSelectedContestant(null)
      setScores({})
      setNotes('')

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
            </p>
            <Button onClick={() => router.push(`/events/${eventSlug}/finale/leaderboard`)}>
              View Leaderboard
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!stageConfig) {
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

  const totalScore = calculateTotalScore(scores as StageCriteria)

  return (
    <div className="space-y-6">
      {/* Current Stage Info */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>{stageConfig.name}</CardTitle>
              <CardDescription>{stageConfig.description}</CardDescription>
            </div>
            <Badge variant="secondary" className="text-lg px-4 py-2">
              Max Score: {stageConfig.max_score}
            </Badge>
          </div>
        </CardHeader>
      </Card>

      {/* Contestant Selection */}
      <Card>
        <CardHeader>
          <CardTitle>Select Contestant</CardTitle>
          <CardDescription>Choose the contestant you are scoring</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {contestants.map((contestant) => (
              <button
                key={contestant.id}
                onClick={() => setSelectedContestant(contestant.id)}
                className={`p-4 rounded-lg border-2 transition-all hover:border-primary ${
                  selectedContestant === contestant.id
                    ? 'border-primary bg-primary/5'
                    : 'border-border'
                }`}
              >
                <div className="flex items-center gap-3">
                  {contestant.artists.photo_url && (
                    <img
                      src={contestant.artists.photo_url}
                      alt={contestant.artists.name}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                  )}
                  <div className="text-left">
                    <p className="font-semibold">#{contestant.contestant_number}</p>
                    <p className="text-sm">
                      {contestant.artists.stage_name || contestant.artists.name}
                    </p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Scoring Criteria */}
      {selectedContestant && (
        <Card>
          <CardHeader>
            <CardTitle>Score Contestant</CardTitle>
            <CardDescription>
              Enter scores for each criterion. Total: {totalScore} / {stageConfig.max_score}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {stageConfig.criteria.map((criterion) => (
              <div key={criterion.key} className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor={criterion.key}>{criterion.label}</Label>
                  <Badge variant="outline">Max: {criterion.max}</Badge>
                </div>
                <Input
                  id={criterion.key}
                  type="number"
                  min={0}
                  max={criterion.max}
                  value={scores[criterion.key] || 0}
                  onChange={(e) =>
                    handleScoreChange(criterion.key, parseFloat(e.target.value) || 0)
                  }
                  className="text-lg"
                />
              </div>
            ))}

            <Separator />

            <div className="space-y-2">
              <Label htmlFor="notes">Notes (Optional)</Label>
              <Textarea
                id="notes"
                placeholder="Add any additional notes about this performance..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
              />
            </div>

            <Button
              onClick={handleSubmit}
              disabled={submitting || !selectedContestant}
              className="w-full"
              size="lg"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Submitting Vote...
                </>
              ) : (
                `Submit Vote (Total: ${totalScore})`
              )}
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
