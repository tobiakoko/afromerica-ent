'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Copy,
  CheckCircle2,
  XCircle,
  Download,
  Search,
  Users,
  UserCheck,
  Globe,
  Gavel,
  Share2,
  Megaphone,
} from 'lucide-react'
import { toast } from 'sonner'
import type { FinaleConfig, FinaleVoter } from '@/types/finale'

interface FinaleJudgesTabProps {
  eventId: string
}

export function FinaleJudgesTab({ eventId }: FinaleJudgesTabProps) {
  const [voters, setVoters] = useState<{
    judges: FinaleVoter[]
    in_house: FinaleVoter[]
    online: FinaleVoter[]
    total: number
  } | null>(null)
  const [config, setConfig] = useState<FinaleConfig | null>(null)
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    fetchVoters()
    fetchConfig()
  }, [eventId])

  const fetchVoters = async () => {
    try {
      const response = await fetch(`/api/finale/admin/voters?event_id=${eventId}`)
      const data = await response.json()

      if (data.success) {
        setVoters(data.voters)
      } else {
        toast.error(data.message || 'Failed to load voters')
      }
    } catch (error) {
      console.error('Error fetching voters:', error)
      toast.error('Failed to load voters')
    } finally {
      setLoading(false)
    }
  }

  const fetchConfig = async () => {
    try {
      const response = await fetch(`/api/finale/admin/config?event_id=${eventId}`)
      const data = await response.json()
      if (data.success) {
        setConfig(data.config)
      }
    } catch (error) {
      console.error('Error fetching finale config:', error)
    }
  }

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text)
    toast.success(`${label} copied to clipboard!`)
  }

  const exportVoters = (voterList: FinaleVoter[], type: string) => {
    const csv = [
      ['Name', 'Code', 'Type', 'Judge #', 'Stage 1', 'Stage 2', 'Stage 3', 'Stage 4'].join(','),
      ...voterList.map((v) =>
        [
          v.name,
          v.voter_code,
          v.voter_type,
          v.judge_number || '',
          v.has_voted_stage_1 ? 'Yes' : 'No',
          v.has_voted_stage_2 ? 'Yes' : 'No',
          v.has_voted_stage_3 ? 'Yes' : 'No',
          v.has_voted_stage_4 ? 'Yes' : 'No',
        ].join(',')
      ),
    ].join('\n')

    const blob = new Blob([csv], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${type}-voters-${new Date().toISOString().split('T')[0]}.csv`
    a.click()
    toast.success(`${type} voters exported successfully!`)
  }

  const filterVoters = (voterList: FinaleVoter[]) => {
    if (!searchTerm) return voterList
    return voterList.filter(
      (v) =>
        v.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        v.voter_code.toLowerCase().includes(searchTerm.toLowerCase())
    )
  }

  const VoterTable = ({ voterList, type }: { voterList: FinaleVoter[]; type: string }) => {
    const filtered = filterVoters(voterList)

    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Showing {filtered.length} of {voterList.length} voters
          </p>
          <Button
            onClick={() => exportVoters(voterList, type)}
            variant="outline"
            size="sm"
          >
            <Download className="w-4 h-4 mr-2" />
            Export CSV
          </Button>
        </div>

        <div className="border rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                {type === 'Judge' && <TableHead className="w-20">#</TableHead>}
                <TableHead>Name</TableHead>
                <TableHead>Code</TableHead>
                <TableHead className="text-center">S1</TableHead>
                <TableHead className="text-center">S2</TableHead>
                <TableHead className="text-center">S3</TableHead>
                <TableHead className="text-center">S4</TableHead>
                <TableHead className="w-24">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={type === 'Judge' ? 8 : 7} className="text-center py-8 text-muted-foreground">
                    No voters found
                  </TableCell>
                </TableRow>
              ) : (
                filtered.map((voter) => (
                  <TableRow key={voter.id}>
                    {type === 'Judge' && (
                      <TableCell className="font-medium">
                        <Badge variant="outline">#{voter.judge_number}</Badge>
                      </TableCell>
                    )}
                    <TableCell className="font-medium">{voter.name}</TableCell>
                    <TableCell>
                      <code className="px-2 py-1 rounded bg-muted text-sm font-mono">
                        {voter.voter_code}
                      </code>
                    </TableCell>
                    <TableCell className="text-center">
                      {voter.has_voted_stage_1 ? (
                        <CheckCircle2 className="w-4 h-4 text-green-500 mx-auto" />
                      ) : (
                        <XCircle className="w-4 h-4 text-gray-300 mx-auto" />
                      )}
                    </TableCell>
                    <TableCell className="text-center">
                      {voter.has_voted_stage_2 ? (
                        <CheckCircle2 className="w-4 h-4 text-green-500 mx-auto" />
                      ) : (
                        <XCircle className="w-4 h-4 text-gray-300 mx-auto" />
                      )}
                    </TableCell>
                    <TableCell className="text-center">
                      {voter.has_voted_stage_3 ? (
                        <CheckCircle2 className="w-4 h-4 text-green-500 mx-auto" />
                      ) : (
                        <XCircle className="w-4 h-4 text-gray-300 mx-auto" />
                      )}
                    </TableCell>
                    <TableCell className="text-center">
                      {voter.has_voted_stage_4 ? (
                        <CheckCircle2 className="w-4 h-4 text-green-500 mx-auto" />
                      ) : (
                        <XCircle className="w-4 h-4 text-gray-300 mx-auto" />
                      )}
                    </TableCell>
                    <TableCell>
                      <Button
                        onClick={() => copyToClipboard(voter.voter_code, 'Code')}
                        variant="ghost"
                        size="sm"
                      >
                        <Copy className="w-4 h-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    )
  }

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

  if (!voters) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center py-12 text-muted-foreground">
            Failed to load voters
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Gavel className="w-4 h-4" />
              Judges
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{voters.judges.length}</p>
            <p className="text-xs text-muted-foreground mt-1">60% vote weight</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <UserCheck className="w-4 h-4" />
              In-House
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{voters.in_house.length}</p>
            <p className="text-xs text-muted-foreground mt-1">25% vote weight</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Globe className="w-4 h-4" />
              Online
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{voters.online.length}</p>
            <p className="text-xs text-muted-foreground mt-1">15% vote weight</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Users className="w-4 h-4" />
              Total
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{voters.total}</p>
            <p className="text-xs text-muted-foreground mt-1">All voter types</p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Codes */}
      {voters && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Share2 className="w-4 h-4" />
              Finale Voter Codes
            </CardTitle>
            <CardDescription>Share these codes with your judges and audience groups</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-3 lg:grid-cols-3">
            <div className="p-4 rounded-lg border flex items-center justify-between gap-2">
              <div>
                <p className="text-xs uppercase text-muted-foreground">Judges</p>
                <p className="text-sm font-semibold">{voters.judges.length} codes</p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  copyToClipboard(
                    config?.settings?.judge_codes?.join('\n') ||
                      voters.judges.map((v) => `${v.judge_number}: ${v.voter_code}`).join('\n'),
                    'Judge codes'
                  )
                }
              >
                <Copy className="w-4 h-4 mr-1" />
                Copy All
              </Button>
            </div>
            <div className="p-4 rounded-lg border flex items-center justify-between gap-2">
              <div>
                <p className="text-xs uppercase text-muted-foreground">In-house Audience</p>
                <p className="text-sm font-semibold">
                  {config?.settings?.in_house_code || voters.in_house[0]?.voter_code || 'Not generated'}
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  (config?.settings?.in_house_code || voters.in_house[0]?.voter_code) &&
                  copyToClipboard(
                    config?.settings?.in_house_code || voters.in_house[0].voter_code,
                    'In-house code'
                  )
                }
                disabled={!config?.settings?.in_house_code && !voters.in_house[0]?.voter_code}
              >
                <Megaphone className="w-4 h-4 mr-1" />
                Copy
              </Button>
            </div>
            <div className="p-4 rounded-lg border flex items-center justify-between gap-2">
              <div>
                <p className="text-xs uppercase text-muted-foreground">Online Audience</p>
                <p className="text-sm font-semibold">
                  {config?.settings?.online_code || voters.online[0]?.voter_code || 'Not generated'}
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  (config?.settings?.online_code || voters.online[0]?.voter_code) &&
                  copyToClipboard(
                    config?.settings?.online_code || voters.online[0].voter_code,
                    'Online code'
                  )
                }
                disabled={!config?.settings?.online_code && !voters.online[0]?.voter_code}
              >
                <Megaphone className="w-4 h-4 mr-1" />
                Copy
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Search */}
      <Card>
        <CardHeader>
          <CardTitle>Search Voters</CardTitle>
          <CardDescription>Find voters by name or code</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search by name or code..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Voter Tables */}
      <Tabs defaultValue="judges">
        <TabsList className="flex flex-wrap w-full gap-2">
          <TabsTrigger className="flex-1 min-w-[140px]" value="judges">
            Judges ({voters.judges.length})
          </TabsTrigger>
          <TabsTrigger className="flex-1 min-w-[140px]" value="in-house">
            In-House ({voters.in_house.length})
          </TabsTrigger>
          <TabsTrigger className="flex-1 min-w-[140px]" value="online">
            Online ({voters.online.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="judges" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Gavel className="w-5 h-5" />
                Judge Voter Codes
              </CardTitle>
              <CardDescription>
                Provide these codes to your judges. Each judge has a unique code.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <VoterTable voterList={voters.judges} type="Judge" />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="in-house" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UserCheck className="w-5 h-5" />
                In-House Audience Codes
              </CardTitle>
              <CardDescription>
                Distribute these codes to your in-house audience members.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <VoterTable voterList={voters.in_house} type="In-House" />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="online" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="w-5 h-5" />
                Online Viewer Codes
              </CardTitle>
              <CardDescription>
                Share these codes with your online viewers.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <VoterTable voterList={voters.online} type="Online" />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
