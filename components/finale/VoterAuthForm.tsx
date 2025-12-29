'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { toast } from 'sonner'
import { Loader2, ShieldCheck } from 'lucide-react'
import type { VoterAuthResponse } from '@/types/finale'

interface VoterAuthFormProps {
  eventId: string
  eventSlug: string
}

export function VoterAuthForm({ eventId, eventSlug }: VoterAuthFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    code: '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch('/api/finale/auth', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          code: formData.code.toUpperCase(),
          event_id: eventId,
        }),
      })

      const data: VoterAuthResponse = await response.json()

      if (!response.ok || !data.success) {
        toast.error(data.message || 'Authentication failed')
        setLoading(false)
        return
      }

      if (!data.token || !data.voter) {
        toast.error('Invalid response from server')
        setLoading(false)
        return
      }

      // Store token in localStorage for persistence
      localStorage.setItem('finale_voter_token', data.token)
      localStorage.setItem('finale_voter_data', JSON.stringify(data.voter))
      localStorage.setItem('finale_config', JSON.stringify(data.config))

      toast.success('Authentication successful! Redirecting...')

      // Redirect to voting page - token is read from localStorage, not URL
      setTimeout(() => {
        router.push(`/events/${eventSlug}/finale/vote/submit`)
      }, 500)
    } catch (error) {
      console.error('Authentication error:', error)
      toast.error('An error occurred during authentication')
      setLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader className="text-center">
        <div className="flex justify-center mb-4">
          <ShieldCheck className="w-12 h-12 text-primary" />
        </div>
        <CardTitle>Voter Authentication</CardTitle>
        <CardDescription>
          Enter your name and voter code to access the voting system
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              type="text"
              placeholder="Enter your full name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
              disabled={loading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="code">Voter Code</Label>
            <Input
              id="code"
              type="text"
              placeholder="Enter your 10 character code"
              value={formData.code}
              onChange={(e) =>
                setFormData({ ...formData, code: e.target.value.toUpperCase() })
              }
              maxLength={10}
              minLength={10}
              required
              disabled={loading}
              className="font-mono uppercase text-center tracking-wider"
              pattern="AFR-[JIO][A-Z0-9]{5}"
              title="Code must be in format: AFR-J, AFR-I, or AFR-O followed by 5 characters"
            />
            <p className="text-xs text-muted-foreground text-center">
              Enter your voter code
            </p>
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Authenticating...
              </>
            ) : (
              'Continue to Vote'
            )}
          </Button>
        </form>

        <div className="mt-6 p-4 bg-muted rounded-lg">
          <p className="text-sm text-muted-foreground">
            <strong>Note:</strong> Judge codes (AFR-J) are unique and personal. In-house (AFR-I)
            and online (AFR-O) codes are shared with your audience group. You can only vote once
            per stage.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
