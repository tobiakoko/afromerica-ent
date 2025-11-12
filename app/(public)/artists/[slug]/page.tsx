import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Music,
  MapPin,
  Star,
  Calendar,
  Mail,
  Phone,
  Award,
  Users,
  Play
} from "lucide-react";

interface ArtistPageProps {
  params: Promise<{ slug: string }>;
}

export default async function ArtistDetailPage({ params }: ArtistPageProps) {
  const { slug } = await params;

  // Mock artist data - in production this would come from your database
  const artist = {
    id: slug,
    name: "Kofi Mensah",
    genre: "Afrobeat",
    location: "New York, NY",
    rating: 4.9,
    totalBookings: 127,
    joinedDate: "January 2023",
    image: "<¤",
    bio: "Kofi Mensah is an award-winning Afrobeat artist who has been captivating audiences with his unique blend of traditional African rhythms and contemporary sounds. With roots in Ghana and influences from across the African diaspora, Kofi brings an authentic and energetic performance to every stage.",
    specialties: ["Live Performances", "Studio Recording", "Music Production", "Cultural Events"],
    awards: [
      "Best Afrobeat Artist 2024",
      "Cultural Ambassador Award",
      "Outstanding Performance Excellence",
    ],
    upcomingEvents: [
      {
        id: "1",
        name: "Afrobeat Night",
        date: "March 15, 2025",
        venue: "Brooklyn Bowl",
        city: "Brooklyn, NY",
      },
      {
        id: "2",
        name: "Summer Music Festival",
        date: "June 20, 2025",
        venue: "Central Park",
        city: "New York, NY",
      },
    ],
    pastPerformances: [
      { venue: "Madison Square Garden", year: "2024" },
      { venue: "Barclays Center", year: "2024" },
      { venue: "Apollo Theater", year: "2023" },
      { venue: "SOB's", year: "2023" },
    ],
  };

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary/10 via-purple-500/10 to-pink-500/10 py-12">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Artist Image */}
            <div className="lg:col-span-1">
              <div className="aspect-square bg-gradient-to-br from-primary/20 to-purple-500/20 rounded-2xl flex items-center justify-center text-8xl shadow-lg sticky top-24">
                {artist.image}
              </div>
            </div>

            {/* Artist Info */}
            <div className="lg:col-span-2">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className="text-4xl font-bold tracking-tight mb-2">
                    {artist.name}
                  </h1>
                  <div className="flex flex-wrap gap-3 mb-4">
                    <span className="inline-flex items-center gap-1.5 text-sm bg-primary/10 text-primary px-3 py-1.5 rounded-full font-medium">
                      <Music className="h-4 w-4" />
                      {artist.genre}
                    </span>
                    <span className="inline-flex items-center gap-1.5 text-sm bg-muted text-muted-foreground px-3 py-1.5 rounded-full">
                      <MapPin className="h-4 w-4" />
                      {artist.location}
                    </span>
                  </div>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-4 mb-6">
                <Card>
                  <CardContent className="pt-6 text-center">
                    <div className="flex items-center justify-center gap-1 text-2xl font-bold text-primary mb-1">
                      <Star className="h-5 w-5 fill-current" />
                      {artist.rating}
                    </div>
                    <div className="text-sm text-muted-foreground">Rating</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6 text-center">
                    <div className="text-2xl font-bold text-primary mb-1">{artist.totalBookings}</div>
                    <div className="text-sm text-muted-foreground">Bookings</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6 text-center">
                    <div className="text-2xl font-bold text-primary mb-1">
                      <Calendar className="h-6 w-6 mx-auto" />
                    </div>
                    <div className="text-sm text-muted-foreground">Since {artist.joinedDate}</div>
                  </CardContent>
                </Card>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-3 mb-8">
                <Button size="lg" asChild>
                  <Link href="/contact">Book Now</Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <Link href="#contact">
                    <Mail className="mr-2 h-4 w-4" />
                    Contact Artist
                  </Link>
                </Button>
                <Button size="lg" variant="outline">
                  <Play className="mr-2 h-4 w-4" />
                  Play Sample
                </Button>
              </div>

              {/* Bio */}
              <div>
                <h2 className="text-2xl font-bold mb-4">About</h2>
                <p className="text-muted-foreground leading-relaxed">
                  {artist.bio}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Specialties & Awards */}
      <section className="py-12 lg:py-20">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Specialties */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Music className="h-5 w-5 text-primary" />
                  Specialties
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {artist.specialties.map((specialty) => (
                    <span
                      key={specialty}
                      className="inline-flex items-center px-3 py-1.5 rounded-full text-sm bg-primary/10 text-primary font-medium"
                    >
                      {specialty}
                    </span>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Awards */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="h-5 w-5 text-primary" />
                  Awards & Recognition
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {artist.awards.map((award) => (
                    <li key={award} className="flex items-start gap-2">
                      <Star className="h-4 w-4 text-yellow-500 mt-0.5 shrink-0" />
                      <span className="text-sm">{award}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Upcoming Events */}
      <section className="py-12 lg:py-20 bg-muted/30">
        <div className="container mx-auto px-4 lg:px-8">
          <h2 className="text-3xl font-bold mb-8">Upcoming Performances</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {artist.upcomingEvents.map((event) => (
              <Card key={event.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle>{event.name}</CardTitle>
                  <CardDescription>
                    <div className="flex flex-col gap-2 mt-2">
                      <span className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        {event.date}
                      </span>
                      <span className="flex items-center gap-2">
                        <MapPin className="h-4 w-4" />
                        {event.venue}, {event.city}
                      </span>
                    </div>
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button variant="outline" className="w-full" asChild>
                    <Link href={`/events/${event.id}`}>View Event Details</Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Past Performances */}
      <section className="py-12 lg:py-20">
        <div className="container mx-auto px-4 lg:px-8">
          <h2 className="text-3xl font-bold mb-8">Past Performances</h2>
          <Card>
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {artist.pastPerformances.map((performance, index) => (
                  <div key={index} className="text-center p-4 rounded-lg bg-muted/50">
                    <div className="font-semibold mb-1">{performance.venue}</div>
                    <div className="text-sm text-muted-foreground">{performance.year}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-12 lg:py-20 bg-muted/30" id="contact">
        <div className="container mx-auto px-4 lg:px-8">
          <Card className="border-2 bg-gradient-to-br from-primary/5 to-purple-500/5">
            <CardContent className="py-12 text-center">
              <div className="mx-auto mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <h2 className="text-3xl font-bold tracking-tight mb-4">
                Book {artist.name} for Your Event
              </h2>
              <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
                Ready to bring an unforgettable performance to your next event? Get in touch to discuss availability and booking details.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" asChild>
                  <Link href="/contact">Request Booking</Link>
                </Button>
                <Button size="lg" variant="outline">
                  <Phone className="mr-2 h-4 w-4" />
                  Call Now
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}