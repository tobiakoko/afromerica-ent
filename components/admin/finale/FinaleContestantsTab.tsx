'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Trophy, Star, XCircle, Edit2, CheckCircle2 } from 'lucide-react'
import { toast } from 'sonner'

interface Contestant {
  id: string
  contestant_number: number
  is_finalist: boolean
  is_eliminated: boolean
  eliminated_at_stage: string | null
  artist: {
    id: string
    name: string
    stage_name: string | null
    photo_url: string | null
    slug: string
  }
}

interface FinaleContestantsTabProps {
  eventId: string
}

export function FinaleContestantsTab({ eventId }: FinaleContestantsTabProps) {
  const [contestants, setContestants] = useState<Contestant[]>([])
  const [loading, setLoading] = useState(true)
  const [editingContestant, setEditingContestant] = useState<Contestant | null>(null)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    fetchContestants()
  }, [eventId])

  const fetchContestants = async () => {
    try {
      const response = await fetch(`/api/finale/admin/contestants?event_id=${eventId}`)
      const data = await response.json()

      if (data.success) {
        setContestants(data.contestants)
      } else {
        toast.error(data.message || 'Failed to load contestants')
      }
    } catch (error) {
      console.error('Error fetching contestants:', error)
      toast.error('Failed to load contestants')
    } finally {
      setLoading(false)
    }
  }

  const updateContestant = async () => {
    if (!editingContestant) return

    setSaving(true)
    try {
      const response = await fetch('/api/finale/admin/contestants', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contestant_id: editingContestant.id,
          is_finalist: editingContestant.is_finalist,
          is_eliminated: editingContestant.is_eliminated,
          eliminated_at_stage: editingContestant.eliminated_at_stage,
        }),
      })

      const data = await response.json()

      if (data.success) {
        toast.success('Contestant updated successfully')
        setEditingContestant(null)
        fetchContestants()
      } else {
        toast.error(data.message || 'Failed to update contestant')
      }
    } catch (error) {
      console.error('Error updating contestant:', error)
      toast.error('Failed to update contestant')
    } finally {
      setSaving(false)
    }
  }

  const finalists = contestants.filter((c) => c.is_finalist)
  const eliminated = contestants.filter((c) => c.is_eliminated)
  const active = contestants.filter((c) => !c.is_eliminated && !c.is_finalist)

  if (loading) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    )
  }

  const ContestantCard = ({ contestant }: { contestant: Contestant }) => (
    <Card className="overflow-hidden">
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          <div className="relative">
            <Avatar className="w-16 h-16">
              <AvatarImage src={contestant.artist.photo_url || undefined} />
              <AvatarFallback>
                {contestant.artist.name.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold">
              #{contestant.contestant_number}
            </div>
          </div>

          <div className="flex-1 min-w-0">
            <h3 className="font-semibold truncate">{contestant.artist.name}</h3>
            {contestant.artist.stage_name && (
              <p className="text-sm text-muted-foreground truncate">
                {contestant.artist.stage_name}
              </p>
            )}

            <div className="flex flex-wrap gap-2 mt-2">
              {contestant.is_finalist && (
                <Badge className="bg-yellow-500">
                  <Trophy className="w-3 h-3 mr-1" />
                  Top 5 Finalist
                </Badge>
              )}
              {contestant.is_eliminated && (
                <Badge variant="destructive">
                  <XCircle className="w-3 h-3 mr-1" />
                  Eliminated
                </Badge>
              )}
              {!contestant.is_eliminated && !contestant.is_finalist && (
                <Badge variant="secondary">
                  <CheckCircle2 className="w-3 h-3 mr-1" />
                  Active
                </Badge>
              )}
            </div>

            {contestant.eliminated_at_stage && (
              <p className="text-xs text-muted-foreground mt-1">
                Eliminated at: Stage {contestant.eliminated_at_stage.split('_')[1]}
              </p>
            )}
          </div>

          <Dialog>
            <DialogTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setEditingContestant({ ...contestant })}
              >
                <Edit2 className="w-4 h-4" />
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Edit Contestant</DialogTitle>
                <DialogDescription>
                  Update the status of {contestant.artist.name}
                </DialogDescription>
              </DialogHeader>

              {editingContestant && editingContestant.id === contestant.id && (
                <div className="space-y-4 py-4">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="is-finalist">Top 5 Finalist</Label>
                    <Switch
                      id="is-finalist"
                      checked={editingContestant.is_finalist}
                      onCheckedChange={(checked) =>
                        setEditingContestant({
                          ...editingContestant,
                          is_finalist: checked,
                        })
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <Label htmlFor="is-eliminated">Eliminated</Label>
                    <Switch
                      id="is-eliminated"
                      checked={editingContestant.is_eliminated}
                      onCheckedChange={(checked) =>
                        setEditingContestant({
                          ...editingContestant,
                          is_eliminated: checked,
                        })
                      }
                    />
                  </div>

                  {editingContestant.is_eliminated && (
                    <div className="space-y-2">
                      <Label>Eliminated At Stage</Label>
                      <Select
                        value={editingContestant.eliminated_at_stage || ''}
                        onValueChange={(value) =>
                          setEditingContestant({
                            ...editingContestant,
                            eliminated_at_stage: value || null,
                          })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select stage" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="stage_1">Stage 1</SelectItem>
                          <SelectItem value="stage_2">Stage 2</SelectItem>
                          <SelectItem value="stage_3">Stage 3</SelectItem>
                          <SelectItem value="stage_4">Stage 4</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                </div>
              )}

              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setEditingContestant(null)}
                >
                  Cancel
                </Button>
                <Button onClick={updateContestant} disabled={saving}>
                  {saving ? 'Saving...' : 'Save Changes'}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </CardContent>
    </Card>
  )

  return (
    <div className="space-y-6">
      {/* Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Contestants</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{contestants.length}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Trophy className="w-4 h-4 text-yellow-500" />
              Top 5 Finalists
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{finalists.length}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-green-500" />
              Active
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{active.length}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <XCircle className="w-4 h-4 text-red-500" />
              Eliminated
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{eliminated.length}</p>
          </CardContent>
        </Card>
      </div>

      {/* Top 5 Finalists */}
      {finalists.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Star className="w-5 h-5 text-yellow-500" />
              Top 5 Finalists
            </CardTitle>
            <CardDescription>
              These contestants have qualified for the final battle
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {finalists.map((contestant) => (
                <ContestantCard key={contestant.id} contestant={contestant} />
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Active Contestants */}
      {active.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-green-500" />
              Active Contestants
            </CardTitle>
            <CardDescription>
              Currently competing in the event
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {active.map((contestant) => (
                <ContestantCard key={contestant.id} contestant={contestant} />
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Eliminated Contestants */}
      {eliminated.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <XCircle className="w-5 h-5 text-red-500" />
              Eliminated Contestants
            </CardTitle>
            <CardDescription>
              No longer competing in the event
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {eliminated.map((contestant) => (
                <ContestantCard key={contestant.id} contestant={contestant} />
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
