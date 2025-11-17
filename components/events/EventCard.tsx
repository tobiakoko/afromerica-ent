import Link from "next/link";
import Image from "next/image";
import { Card } from "@/components/ui/card";
import { Calendar, MapPin } from "lucide-react";
import { format } from "date-fns";

interface EventCardProps {
  event: {
    id: string;
    slug: string;
    title: string;
    date: string;
    image_url?: string;
    status: string;
    event_venues?: Array<{
      venues: {
        name: string;
        city: string;
      };
    }>;
  };
}

export function EventCard({ event }: EventCardProps) {
  const venue = event.event_venues?.[0]?.venues;

  return (
    <Link href={`/events/${event.slug}`}>
      <Card className="group overflow-hidden hover:shadow-lg transition-all duration-300">
        {/* Image */}
        <div className="relative aspect-video overflow-hidden">
          <Image
            src={event.image_url || '/images/default-event.jpg'}
            alt={event.title}
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-300"
          />
          {event.status === 'soldout' && (
            <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
              <span className="text-white font-bold text-xl">SOLD OUT</span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-5">
          <h3 className="font-semibold text-lg mb-3 line-clamp-2">{event.title}</h3>
          
          <div className="space-y-2 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <span>{format(new Date(event.date), 'MMM d, yyyy')}</span>
            </div>
            {venue && (
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                <span>{venue.name}, {venue.city}</span>
              </div>
            )}
          </div>
        </div>
      </Card>
    </Link>
  );
}