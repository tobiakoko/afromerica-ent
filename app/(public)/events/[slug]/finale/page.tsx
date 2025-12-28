import { createCachedClient } from '@/utils/supabase/server-cached'
import { PageHero } from '@/components/layout/page-hero'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Trophy, Calendar, MapPin, Sparkles, Music, Star } from 'lucide-react'
import Link from 'next/link'
import { notFound } from 'next/navigation'

export const dynamic = 'force-dynamic'

interface FinalePageProps {
  params: Promise<{ slug: string }>
}

export default async function FinalePage({ params }: FinalePageProps) {
  const { slug } = await params
  const supabase = createCachedClient()

  // Fetch event details
  const { data: event, error } = await supabase
    .from('events')
    .select('id, title, slug, event_date, venue, city')
    .eq('slug', slug)
    .eq('is_active', true)
    .single()

  if (error || !event) {
    notFound()
  }

  return (
    <div className="min-h-screen">
      <PageHero
        title={
          <span className="flex items-center justify-center gap-3">
            <Trophy className="size-8 sm:size-10 text-yellow-500" />
            Grand Finale
          </span>
        }
        description="The ultimate showdown - Top 10 finalists compete for the crown"
        badge={event.title}
        badgeHref={`/events/${slug}`}
      />

      <div className="container mx-auto px-4 py-12 space-y-8">
        {/* Coming Soon Banner */}
        <Card className="border-2 border-yellow-400 bg-linear-to-br from-yellow-50 to-orange-50 dark:from-yellow-950 dark:to-orange-950">
          <CardContent className="py-12">
            <div className="text-center space-y-6">
              <div className="flex justify-center">
                <div className="relative">
                  <div className="absolute inset-0 bg-yellow-400 blur-3xl opacity-20 animate-pulse" />
                  <Sparkles className="relative w-20 h-20 text-yellow-600 dark:text-yellow-400" />
                </div>
              </div>

              <div className="space-y-3">
                <h2 className="text-4xl md:text-5xl font-bold text-yellow-900 dark:text-yellow-100">
                  Coming Soon
                </h2>
                <p className="text-xl text-yellow-800 dark:text-yellow-200 max-w-2xl mx-auto">
                  The Grand Finale page is currently under construction. Check back soon for exclusive content, live updates, and more!
                </p>
              </div>

              <div className="flex flex-wrap gap-4 justify-center pt-4">
                <Button asChild size="lg" className="bg-yellow-600 hover:bg-yellow-700">
                  <Link href={`/events/${slug}/leaderboard`}>
                    <Trophy className="w-5 h-5 mr-2" />
                    View Leaderboard
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <Link href={`/events/${slug}`}>
                    View Event Details
                  </Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* What to Expect */}
        <div className="grid md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Trophy className="w-5 h-5 text-yellow-600" />
                Top 10 Showdown
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Watch the top 10 finalists compete in a spectacular live performance showcase
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Music className="w-5 h-5 text-purple-600" />
                Live Performances
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Experience electrifying performances from each finalist as they give it their all
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Star className="w-5 h-5 text-blue-600" />
                Final Results
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Witness the crowning of the champion based on the complete scoring breakdown
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Event Details Preview */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Event Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="flex items-start gap-3">
                <Calendar className="w-5 h-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="font-medium">Date</p>
                  <p className="text-sm text-muted-foreground">
                    {new Date(event.event_date).toLocaleDateString('en-US', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="font-medium">Venue</p>
                  <p className="text-sm text-muted-foreground">
                    {event.venue}
                    {event.city && `, ${event.city}`}
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t">
              <p className="text-sm text-muted-foreground">
                Stay tuned for more details about the grand finale event. This page will be updated with live streaming information, special announcements, and exclusive behind-the-scenes content.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Call to Action */}
        <Card className="bg-linear-to-r from-purple-50 to-blue-50 dark:from-purple-950 dark:to-blue-950 border-purple-200 dark:border-purple-800">
          <CardContent className="py-8 text-center">
            <h3 className="text-2xl font-bold mb-4 text-purple-900 dark:text-purple-100">
              Don&apos;t Miss the Action
            </h3>
            <p className="text-purple-800 dark:text-purple-200 mb-6 max-w-2xl mx-auto">
              Follow us on social media and check the leaderboard regularly to stay updated on the latest developments for the grand finale!
            </p>
            <Button asChild size="lg" className="bg-purple-600 hover:bg-purple-700">
              <Link href={`/events/${slug}/leaderboard`}>
                <Trophy className="w-5 h-5 mr-2" />
                Check Current Rankings
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
