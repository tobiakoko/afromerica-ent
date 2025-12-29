'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { jwtVerify } from 'jose'
import { PageHero } from '@/components/layout/page-hero'
import { JudgeVotingInterface } from '@/components/finale/JudgeVotingInterface'
import { AudienceVotingInterface } from '@/components/finale/AudienceVotingInterface'
import { Card, CardContent } from '@/components/ui/card'
import { Loader2 } from 'lucide-react'
import type { FinaleVoter, FinaleConfig } from '@/types/finale'

export default function VoteSubmitPage({ params }: { params: { slug: string } }) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const token = searchParams.get('token')

  const [loading, setLoading] = useState(true)
  const [voter, setVoter] = useState<FinaleVoter | null>(null)
  const [config, setConfig] = useState<FinaleConfig | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function validateToken() {
      if (!token) {
        // Try to get from sessionStorage
        const storedToken = sessionStorage.getItem('finale_voter_token')
        const storedVoter = sessionStorage.getItem('finale_voter_data')
        const storedConfig = sessionStorage.getItem('finale_config')

        if (!storedToken || !storedVoter || !storedConfig) {
          setError('No authentication token found. Please authenticate first.')
          setLoading(false)
          setTimeout(() => {
            router.push(`/events/${params.slug}/finale/vote`)
          }, 2000)
          return
        }

        setVoter(JSON.parse(storedVoter))
        setConfig(JSON.parse(storedConfig))
        setLoading(false)
        return
      }

      try {
        // Verify token structure (basic check, full verification happens on API)
        const JWT_SECRET = new TextEncoder().encode(process.env.NEXT_PUBLIC_JWT_SECRET || '')
        const verified = await jwtVerify(token, JWT_SECRET)

        const voterData = sessionStorage.getItem('finale_voter_data')
        const configData = sessionStorage.getItem('finale_config')

        if (voterData && configData) {
          setVoter(JSON.parse(voterData))
          setConfig(JSON.parse(configData))
        } else {
          setError('Voter data not found. Please authenticate again.')
          setTimeout(() => {
            router.push(`/events/${params.slug}/finale/vote`)
          }, 2000)
        }
      } catch (err) {
        console.error('Token validation error:', err)
        setError('Invalid or expired token. Please authenticate again.')
        setTimeout(() => {
          router.push(`/events/${params.slug}/finale/vote`)
        }, 2000)
      } finally {
        setLoading(false)
      }
    }

    validateToken()
  }, [token, params.slug, router])

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
            eventSlug={params.slug}
            token={token || sessionStorage.getItem('finale_voter_token') || ''}
          />
        ) : (
          <AudienceVotingInterface
            voter={voter}
            config={config}
            eventSlug={params.slug}
            token={token || sessionStorage.getItem('finale_voter_token') || ''}
          />
        )}
      </div>
    </div>
  )
}
