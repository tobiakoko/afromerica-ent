import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Calendar,
  MapPin,
  Clock,
  Users,
  Ticket,
  Share2,
  Music,
  Info,
  DollarSign,
  Mail
} from "lucide-react";

interface EventPageProps {
  params: Promise<{ slug: string }>;
}

export default async function EventDetailPage({ params }: EventPageProps) {
  const { slug } = await params;

  // Mock event data - in production this would come from your database
  const event = {
    id: slug,
    title: "Afrobeat Night",
    description: "Experience the vibrant sounds of Afrobeat with live performances from top artists. Dance the night away to infectious rhythms and immerse yourself in the rich culture of African music. This is more than just a concert - it's a celebration of heritage, community, and the power of music to bring people together.",
    date: "March 15, 2025",
    time: "8:00 PM - 2:00 AM",
    venue: "Brooklyn Bowl",
    address: "61 Wythe Ave, Brooklyn, NY 11249",
    location: "Brooklyn, NY",
    category: "Club Nights",
    price: "$35",
    priceDetails: {
      earlyBird: "$25",
      general: "$35",
      vip: "$75",
    },
    attendees: 250,
    capacity: 500,
    image: "<µ",
    lineup: [
      { name: "Kofi Mensah", role: "Headliner", genre: "Afrobeat" },
      { name: "DJ Kwame", role: "DJ Set", genre: "Afrobeat/Hip Hop" },
      { name: "Amara Jones", role: "Special Guest", genre: "Dancehall" },
    ],
    highlights: [
      "Live performances from award-winning artists",
      "DJ sets featuring the best of Afrobeat and African music",
      "Authentic African cuisine and drinks",
      "Cultural vendors and art displays",
      "Late-night dance party",
    ],
    ageRequirement: "21+",
    dressCode: "Casual/Afrocentric attire encouraged",
  };

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary/10 via-purple-500/10 to-pink-500/10 py-12">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Event Image */}
            <div className="lg:col-span-1">
              <div className="aspect-square bg-gradient-to-br from-primary/20 to-purple-500/20 rounded-2xl flex items-center justify-center text-8xl shadow-lg sticky top-24">
                {event.image}
              </div>
            </div>

            {/* Event Info */}
            <div className="lg:col-span-2">
              <div className="mb-4">
                <span className="inline-flex items-center gap-1 text-sm bg-primary/10 text-primary px-3 py-1.5 rounded-full font-medium mb-4">
                  {event.category}
                </span>
                <h1 className="text-4xl font-bold tracking-tight mb-4">
                  {event.title}
                </h1>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  {event.description}
                </p>
              </div>

              {/* Quick Info Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-6">
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-start gap-3">
                      <Calendar className="h-5 w-5 text-primary mt-0.5" />
                      <div>
                        <div className="font-semibold mb-1">Date & Time</div>
                        <div className="text-sm text-muted-foreground">{event.date}</div>
                        <div className="text-sm text-muted-foreground">{event.time}</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-start gap-3">
                      <MapPin className="h-5 w-5 text-primary mt-0.5" />
                      <div>
                        <div className="font-semibold mb-1">Location</div>
                        <div className="text-sm text-muted-foreground">{event.venue}</div>
                        <div className="text-sm text-muted-foreground">{event.address}</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-start gap-3">
                      <DollarSign className="h-5 w-5 text-primary mt-0.5" />
                      <div>
                        <div className="font-semibold mb-1">Pricing</div>
                        <div className="text-sm text-muted-foreground">From {event.priceDetails.earlyBird}</div>
                        <div className="text-sm text-muted-foreground">General: {event.priceDetails.general}</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-start gap-3">
                      <Users className="h-5 w-5 text-primary mt-0.5" />
                      <div>
                        <div className="font-semibold mb-1">Attendance</div>
                        <div className="text-sm text-muted-foreground">{event.attendees} attending</div>
                        <div className="text-sm text-muted-foreground">{event.capacity - event.attendees} spots left</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-3 mt-6">
                <Button size="lg" asChild>
                  <Link href="/contact">
                    <Ticket className="mr-2 h-4 w-4" />
                    Get Tickets
                  </Link>
                </Button>
                <Button size="lg" variant="outline">
                  <Share2 className="mr-2 h-4 w-4" />
                  Share Event
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Lineup Section */}
      <section className="py-12 lg:py-20">
        <div className="container mx-auto px-4 lg:px-8">
          <h2 className="text-3xl font-bold mb-8 flex items-center gap-2">
            <Music className="h-8 w-8 text-primary" />
            Artist Lineup
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {event.lineup.map((artist) => (
              <Card key={artist.name} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="h-32 bg-gradient-to-br from-primary/20 to-purple-500/20 rounded-lg flex items-center justify-center text-4xl mb-4">
                    <¤
                  </div>
                  <CardTitle>{artist.name}</CardTitle>
                  <CardDescription>
                    <div className="flex flex-col gap-1 mt-2">
                      <span className="text-sm font-medium text-primary">{artist.role}</span>
                      <span className="text-sm">{artist.genre}</span>
                    </div>
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button variant="outline" className="w-full" asChild>
                    <Link href="/artists">View Profile</Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Event Highlights */}
      <section className="py-12 lg:py-20 bg-muted/30">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div>
              <h2 className="text-3xl font-bold mb-6">Event Highlights</h2>
              <ul className="space-y-3">
                {event.highlights.map((highlight, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                      <span className="text-xs font-bold text-primary">{index + 1}</span>
                    </div>
                    <span className="text-muted-foreground">{highlight}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h2 className="text-3xl font-bold mb-6 flex items-center gap-2">
                <Info className="h-8 w-8 text-primary" />
                Important Information
              </h2>
              <Card>
                <CardContent className="pt-6 space-y-4">
                  <div>
                    <div className="font-semibold mb-2">Age Requirement</div>
                    <div className="text-sm text-muted-foreground">{event.ageRequirement}</div>
                  </div>
                  <div>
                    <div className="font-semibold mb-2">Dress Code</div>
                    <div className="text-sm text-muted-foreground">{event.dressCode}</div>
                  </div>
                  <div>
                    <div className="font-semibold mb-2">Refund Policy</div>
                    <div className="text-sm text-muted-foreground">
                      Tickets are non-refundable but transferable. Contact us for special circumstances.
                    </div>
                  </div>
                  <div>
                    <div className="font-semibold mb-2">Accessibility</div>
                    <div className="text-sm text-muted-foreground">
                      Venue is wheelchair accessible. Please contact us in advance for specific accommodations.
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-12 lg:py-20">
        <div className="container mx-auto px-4 lg:px-8">
          <h2 className="text-3xl font-bold mb-8 text-center">Ticket Options</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <Card className="border-2">
              <CardHeader className="text-center">
                <CardTitle>Early Bird</CardTitle>
                <div className="text-3xl font-bold text-primary mt-4">{event.priceDetails.earlyBird}</div>
                <CardDescription>Limited time offer</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm mb-6">
                  <li className="flex items-center gap-2"> General admission</li>
                  <li className="flex items-center gap-2"> Access to all performances</li>
                  <li className="flex items-center gap-2"> Best value</li>
                </ul>
                <Button className="w-full" variant="outline" asChild>
                  <Link href="/contact">Get Tickets</Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="border-2 border-primary">
              <CardHeader className="text-center">
                <div className="inline-block bg-primary text-primary-foreground text-xs font-bold px-2 py-1 rounded-full mb-2">
                  POPULAR
                </div>
                <CardTitle>General Admission</CardTitle>
                <div className="text-3xl font-bold text-primary mt-4">{event.priceDetails.general}</div>
                <CardDescription>Standard entry</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm mb-6">
                  <li className="flex items-center gap-2"> General admission</li>
                  <li className="flex items-center gap-2"> Access to all performances</li>
                  <li className="flex items-center gap-2"> Most popular option</li>
                </ul>
                <Button className="w-full" asChild>
                  <Link href="/contact">Get Tickets</Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="border-2">
              <CardHeader className="text-center">
                <CardTitle>VIP Package</CardTitle>
                <div className="text-3xl font-bold text-primary mt-4">{event.priceDetails.vip}</div>
                <CardDescription>Premium experience</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm mb-6">
                  <li className="flex items-center gap-2"> VIP area access</li>
                  <li className="flex items-center gap-2"> Meet & greet with artists</li>
                  <li className="flex items-center gap-2"> Complimentary drinks</li>
                  <li className="flex items-center gap-2"> Priority entry</li>
                </ul>
                <Button className="w-full" variant="outline" asChild>
                  <Link href="/contact">Get Tickets</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 lg:py-20 bg-muted/30">
        <div className="container mx-auto px-4 lg:px-8">
          <Card className="border-2 bg-gradient-to-br from-primary/5 to-purple-500/5">
            <CardContent className="py-12 text-center">
              <h2 className="text-3xl font-bold tracking-tight mb-4">
                Questions About This Event?
              </h2>
              <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
                Need more information or have special requests? Our team is here to help make your experience unforgettable.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" asChild>
                  <Link href="/contact">
                    <Mail className="mr-2 h-4 w-4" />
                    Contact Us
                  </Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <Link href="/events">View More Events</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
