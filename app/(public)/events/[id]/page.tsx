import { createClient } from "@/utils/supabase/server";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Calendar, MapPin, Clock, Users, TrendingUp } from "lucide-react";
import { format } from "date-fns";

export default async function EventPage({ params }: { params: { slug: string } }) {
  const supabase = await createClient();
  
  const { data: event, error } = await supabase
    .from('events')
    .select(`
      *,
      event_venues (
        venues (*)
      ),
      ticket_types (*),
      event_artists (
        artists (*)
      )
    `)
    .eq('slug', params.slug)
    .single();

  if (error || !event) {
    notFound();
  }

  const venue = event.event_venues?.[0]?.venues;
  const ticketTypes = event.ticket_types || [];
  const artists = event.event_artists?.map((ea: any) => ea.artists) || [];

  return (
    <div className="min-h-screen">
      {/* Hero Image */}
      <div className="relative h-[50vh] w-full">
        <Image
          src={event.cover_image_url || event.image_url || '/images/default-event.jpg'}
          alt={event.title}
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-linear-to-t from-background via-background/50 to-transparent" />
      </div>

      {/* Event Details */}
      <div className="container-wide py-12">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">{event.title}</h1>
            
            {/* Meta Info */}
            <div className="flex flex-wrap gap-4 text-muted-foreground mb-6">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                <span>{format(new Date(event.date), 'MMMM d, yyyy')}</span>
              </div>
              {event.time && (
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  <span>{event.time}</span>
                </div>
              )}
              {venue && (
                <div className="flex items-center gap-2">
                  <MapPin className="w-5 h-5" />
                  <span>{venue.name}, {venue.city}</span>
                </div>
              )}
              {event.capacity && (
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  <span>{event.tickets_sold} / {event.capacity} tickets sold</span>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-4">
              <Button size="lg" asChild>
                <Link href={`/events/${event.slug}/checkout`}>
                  Get Tickets
                </Link>
              </Button>
              
              {/* Show leaderboard for December Showcase */}
              {event.slug === 'december-showcase-2025' && (
                <Button size="lg" variant="outline" asChild>
                  <Link href={`/events/${event.slug}/leaderboard`}>
                    <TrendingUp className="w-5 h-5" />
                    View Leaderboard
                  </Link>
                </Button>
              )}
            </div>
          </div>

          {/* Description */}
          <div className="prose prose-lg dark:prose-invert max-w-none mb-12">
            <h2>About This Event</h2>
            <p>{event.description}</p>
            {event.short_description && <p>{event.short_description}</p>}
          </div>

          {/* Ticket Types */}
          {ticketTypes.length > 0 && (
            <div className="mb-12">
              <h2 className="text-2xl font-bold mb-6">Ticket Options</h2>
              <div className="grid gap-4">
                {ticketTypes.map((ticket: any) => (
                  <div
                    key={ticket.id}
                    className="border rounded-lg p-6 flex justify-between items-center"
                  >
                    <div>
                      <h3 className="font-semibold text-lg">{ticket.name}</h3>
                      {ticket.description && (
                        <p className="text-muted-foreground">{ticket.description}</p>
                      )}
                      <p className="text-sm text-muted-foreground mt-2">
                        {ticket.available} / {ticket.quantity} available
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold">₦{ticket.price.toLocaleString()}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Lineup */}
          {artists.length > 0 && (
            <div>
              <h2 className="text-2xl font-bold mb-6">Artist Lineup</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {artists.map((artist: any) => (
                  <Link
                    key={artist.id}
                    href={`/artists/${artist.slug}`}
                    className="text-center group"
                  >
                    <div className="relative aspect-square rounded-lg overflow-hidden mb-2">
                      <Image
                        src={artist.image_url || '/images/default-artist.jpg'}
                        alt={artist.name}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform"
                      />
                    </div>
                    <p className="font-semibold text-sm">{artist.name}</p>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}