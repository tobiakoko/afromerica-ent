'use client'

import { use, useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { PageHero } from '@/components/layout/page-hero'
import { JudgeVotingInterface } from '@/components/finale/JudgeVotingInterface'
import { AudienceVotingInterface } from '@/components/finale/AudienceVotingInterface'
import { Card, CardContent } from '@/components/ui/card'
import { Loader2 } from 'lucide-react'
import type { FinaleVoter, FinaleConfig } from '@/types/finale'

export default function VoteSubmitPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params)
  const router = useRouter()
  const searchParams = useSearchParams()
  const urlToken = searchParams.get('token')

  const [loading, setLoading] = useState(true)
  const [voter, setVoter] = useState<FinaleVoter | null>(null)
  const [config, setConfig] = useState<FinaleConfig | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    function loadAuthData() {
      try {
        // Get token from localStorage (URL tokens deprecated for security)
        const storedToken = localStorage.getItem('finale_voter_token') || urlToken
        const storedVoter = localStorage.getItem('finale_voter_data')
        const storedConfig = localStorage.getItem('finale_config')

        if (!storedToken || !storedVoter || !storedConfig) {
          setError('No authentication token found. Please authenticate first.')
          setLoading(false)
          setTimeout(() => {
            router.push(`/events/${slug}/finale/vote`)
          }, 2000)
          return
        }

        // Parse stored data
        const voterData = JSON.parse(storedVoter) as FinaleVoter
        const configData = JSON.parse(storedConfig) as FinaleConfig

        // Basic validation - check if token is a non-empty string
        if (!storedToken || storedToken.split('.').length !== 3) {
          setError('Invalid authentication token. Please authenticate again.')
          setLoading(false)
          setTimeout(() => {
            router.push(`/events/${slug}/finale/vote`)
          }, 2000)
          return
        }

        setToken(storedToken)
        setVoter(voterData)
        setConfig(configData)
        setLoading(false)
      } catch (err) {
        console.error('Error loading auth data:', err)
        setError('Failed to load authentication data. Please authenticate again.')
        setLoading(false)
        setTimeout(() => {
          router.push(`/events/${slug}/finale/vote`)
        }, 2000)
      }
    }

    loadAuthData()
  }, [urlToken, slug, router])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="w-12 h-12 animate-spin mx-auto text-primary" />
          <p className="text-muted-foreground">Validating your credentials...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="max-w-md w-full">
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <p className="text-destructive font-medium">{error}</p>
              <p className="text-sm text-muted-foreground">
                Redirecting to authentication page...
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!voter || !config) {
    return null
  }

  const title =
    voter.voter_type === 'judge' ? 'Judge Voting Panel' : 'Cast Your Vote'
  const description =
    voter.voter_type === 'judge'
      ? `Judge ${voter.judge_number} - Score each contestant based on the criteria`
      : 'Select your favorite contestant for this stage'

  return (
    <div className="min-h-screen">
      <PageHero
        title={title}
        description={description}
        badge={`Welcome, ${voter.name}`}
      />

      <div className="container mx-auto px-4 py-8">
        {voter.voter_type === 'judge' ? (
          <JudgeVotingInterface
            voter={voter}
            config={config}
            eventSlug={slug}
            token={token || ''}
          />
        ) : (
          <AudienceVotingInterface
            voter={voter}
            config={config}
            eventSlug={slug}
            token={token || ''}
          />
        )}
      </div>
    </div>
  )
}
