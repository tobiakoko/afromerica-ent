import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Music, MapPin, Star, Users } from "lucide-react";

export default function ArtistsPage() {
  const genres = [
    "All Genres",
    "Afrobeat",
    "Reggae",
    "Hip Hop",
    "R&B",
    "Dancehall",
    "Soca",
    "Gospel",
  ];

  const artists = [
    {
      id: "artist-1",
      name: "Kofi Mensah",
      genre: "Afrobeat",
      location: "New York, NY",
      rating: 4.9,
      bookings: 127,
      image: "<¤",
      description: "Award-winning Afrobeat artist bringing authentic African rhythms to audiences worldwide.",
    },
    {
      id: "artist-2",
      name: "Zara Williams",
      genre: "R&B",
      location: "Los Angeles, CA",
      rating: 4.8,
      bookings: 98,
      image: "<µ",
      description: "Soulful R&B vocalist with a passion for blending traditional and contemporary sounds.",
    },
    {
      id: "artist-3",
      name: "Marcus Thompson",
      genre: "Reggae",
      location: "Miami, FL",
      rating: 4.9,
      bookings: 156,
      image: "<¸",
      description: "Authentic reggae artist spreading positive vibes through conscious music.",
    },
    {
      id: "artist-4",
      name: "Amara Jones",
      genre: "Dancehall",
      location: "Atlanta, GA",
      rating: 4.7,
      bookings: 89,
      image: "<¶",
      description: "Dynamic dancehall performer known for high-energy shows and crowd engagement.",
    },
    {
      id: "artist-5",
      name: "DJ Kwame",
      genre: "Afrobeat",
      location: "Chicago, IL",
      rating: 4.8,
      bookings: 143,
      image: "<§",
      description: "Master DJ blending Afrobeat, Hip Hop, and electronic music for unforgettable sets.",
    },
    {
      id: "artist-6",
      name: "Imani Davis",
      genre: "Gospel",
      location: "Houston, TX",
      rating: 5.0,
      bookings: 112,
      image: "<™",
      description: "Powerful gospel singer inspiring audiences with uplifting spiritual music.",
    },
  ];

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary/10 via-purple-500/10 to-pink-500/10 py-20">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="text-4xl font-bold tracking-tight sm:text-6xl mb-6">
              Discover Amazing{" "}
              <span className="bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                Artists
              </span>
            </h1>
            <p className="text-lg text-muted-foreground sm:text-xl">
              Connect with talented artists from African and Afro-Caribbean communities. Browse profiles, listen to samples, and book for your next event.
            </p>
          </div>
        </div>
      </section>

      {/* Filters Section */}
      <section className="py-8 border-b bg-background/95 backdrop-blur sticky top-[73px] z-40">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="flex items-center gap-2 overflow-x-auto pb-2">
            {genres.map((genre) => (
              <Button
                key={genre}
                variant={genre === "All Genres" ? "default" : "outline"}
                size="sm"
                className="whitespace-nowrap"
              >
                {genre}
              </Button>
            ))}
          </div>
        </div>
      </section>

      {/* Artists Grid */}
      <section className="py-12 lg:py-20">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold tracking-tight mb-2">
                Featured Artists
              </h2>
              <p className="text-muted-foreground">
                {artists.length} talented artists available for booking
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {artists.map((artist) => (
              <Card key={artist.id} className="overflow-hidden hover:shadow-lg transition-all group">
                <div className="h-48 bg-gradient-to-br from-primary/20 to-purple-500/20 flex items-center justify-center text-6xl group-hover:scale-105 transition-transform">
                  {artist.image}
                </div>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-xl mb-2">{artist.name}</CardTitle>
                      <div className="flex flex-wrap gap-2 mb-3">
                        <span className="inline-flex items-center gap-1 text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                          <Music className="h-3 w-3" />
                          {artist.genre}
                        </span>
                        <span className="inline-flex items-center gap-1 text-xs bg-muted text-muted-foreground px-2 py-1 rounded-full">
                          <MapPin className="h-3 w-3" />
                          {artist.location}
                        </span>
                      </div>
                    </div>
                  </div>
                  <CardDescription className="line-clamp-2">
                    {artist.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-1 text-sm">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="font-semibold">{artist.rating}</span>
                      <span className="text-muted-foreground">({artist.bookings} bookings)</span>
                    </div>
                  </div>
                  <Button variant="outline" className="w-full" asChild>
                    <Link href={`/artists/${artist.id}`}>View Profile</Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Load More */}
          <div className="mt-12 text-center">
            <Button size="lg" variant="outline">
              Load More Artists
            </Button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4 lg:px-8">
          <Card className="border-2 bg-gradient-to-br from-primary/5 to-purple-500/5">
            <CardContent className="py-12 text-center">
              <div className="mx-auto mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">
                Are You an Artist?
              </h2>
              <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
                Join our platform and connect with event organizers looking for talented performers. Create your profile today and start getting booked!
              </p>
              <Button size="lg" asChild>
                <Link href="/contact">Join as an Artist</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}