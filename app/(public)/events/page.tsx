import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, MapPin, Clock, Users, Ticket, Filter } from "lucide-react";
 
export default function EventsPage() {
  const categories = [
    "All Events",
    "Concerts",
    "Festivals",
    "Club Nights",
    "Cultural Events",
    "Workshops",
  ];
 
  const events = [
    {
      id: "1",
      title: "Afrobeat Night",
      description: "Experience the vibrant sounds of Afrobeat with live performances from top artists. Dance the night away to infectious rhythms!",
      date: "March 15, 2025",
      time: "8:00 PM - 2:00 AM",
      venue: "Brooklyn Bowl",
      location: "Brooklyn, NY",
      category: "Club Nights",
      price: "$35",
      attendees: 250,
      image: "🎵",
    },
    {
      id: "2",
      title: "Caribbean Festival",
      description: "A celebration of Caribbean culture featuring music, food, art, and performances from talented artists across the diaspora.",
      date: "March 22, 2025",
      time: "12:00 PM - 11:00 PM",
      venue: "Bayfront Park",
      location: "Miami, FL",
      category: "Festivals",
      price: "$50",
      attendees: 5000,
      image: "🎉",
    },
    {
      id: "3",
      title: "Reggae Live Concert",
      description: "An evening of conscious reggae music with live bands and special guest performers. Positive vibes guaranteed!",
      date: "March 29, 2025",
      time: "7:00 PM - 12:00 AM",
      venue: "The Tabernacle",
      location: "Atlanta, GA",
      category: "Concerts",
      price: "$45",
      attendees: 800,
      image: "🎸",
    },
    {
      id: "4",
      title: "Afro-Latin Dance Workshop",
      description: "Learn traditional and contemporary Afro-Latin dance styles from experienced instructors. All skill levels welcome!",
      date: "April 5, 2025",
      time: "2:00 PM - 6:00 PM",
      venue: "Dance Studio NYC",
      location: "New York, NY",
      category: "Workshops",
      price: "$30",
      attendees: 50,
      image: "💃",
    },
    {
      id: "5",
      title: "Gospel Music Celebration",
      description: "An uplifting evening of gospel music featuring renowned choirs and soloists. Come celebrate faith through song!",
      date: "April 12, 2025",
      time: "6:00 PM - 9:00 PM",
      venue: "Greater Grace Church",
      location: "Houston, TX",
      category: "Concerts",
      price: "Free",
      attendees: 1200,
      image: "🎙️",
    },
    {
      id: "6",
      title: "Summer Vibes Festival",
      description: "A full day of music, food, and culture celebrating African and Caribbean heritage. Family-friendly event!",
      date: "June 20, 2025",
      time: "11:00 AM - 10:00 PM",
      venue: "Grant Park",
      location: "Chicago, IL",
      category: "Festivals",
      price: "$40",
      attendees: 3000,
      image: "☀️",
    },
  ];
 
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary/10 via-purple-500/10 to-pink-500/10 py-20">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="text-4xl font-bold tracking-tight sm:text-6xl mb-6">
              Upcoming{" "}
              <span className="bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                Events
              </span>
            </h1>
            <p className="text-lg text-muted-foreground sm:text-xl">
              Discover and attend amazing cultural events, concerts, and festivals celebrating African and Afro-Caribbean heritage.
            </p>
          </div>
        </div>
      </section>
 
      {/* Filters Section */}
      <section className="py-8 border-b bg-background/95 backdrop-blur sticky top-[73px] z-40">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="flex items-center gap-2 overflow-x-auto pb-2">
            <Filter className="h-4 w-4 text-muted-foreground shrink-0" />
            {categories.map((category) => (
              <Button
                key={category}
                variant={category === "All Events" ? "default" : "outline"}
                size="sm"
                className="whitespace-nowrap"
              >
                {category}
              </Button>
            ))}
          </div>
        </div>
      </section>
 
      {/* Events Grid */}
      <section className="py-12 lg:py-20">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold tracking-tight mb-2">
                All Events
              </h2>
              <p className="text-muted-foreground">
                {events.length} events coming up
              </p>
            </div>
          </div>
 
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((event) => (
              <Card key={event.id} className="rounded-xl overflow-hidden hover:shadow-lg transition-all group">
                <div className="h-44 bg-gradient-to-br from-primary/20 to-purple-500/20 flex items-center justify-center text-6xl group-hover:scale-105 transition-transform">
                  {event.image}
                </div>
                <CardHeader>
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <CardTitle className="text-xl mb-2">{event.title}</CardTitle>
                      <span className="inline-flex items-center gap-1 text-xs bg-primary/10 text-primary px-2 py-1 rounded-full font-medium">
                        {event.category}
                      </span>
                    </div>
                  </div>
                  <CardDescription className="line-clamp-2 mt-3">
                    {event.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Calendar className="h-4 w-4 shrink-0" />
                      <span>{event.date}</span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Clock className="h-4 w-4 shrink-0" />
                      <span>{event.time}</span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <MapPin className="h-4 w-4 shrink-0" />
                      <span>{event.venue}, {event.location}</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between pt-3 border-t">
                    <div className="flex items-center gap-4">
                      <span className="text-lg font-bold text-primary">{event.price}</span>
                      <span className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Users className="h-3 w-3" />
                        {event.attendees}
                      </span>
                    </div>
                  </div>
                  <Button className="w-full" asChild>
                    <Link href={`/events/${event.id}`}>
                      <Ticket className="mr-2 h-4 w-4" />
                      View Details
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
 
          {/* Load More */}
          <div className="mt-12 text-center">
            <Button size="lg" variant="outline">
              Load More Events
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
                <Calendar className="h-6 w-6 text-primary" />
              </div>
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">
                Host Your Event With Us
              </h2>
              <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
                Looking to organize a cultural event, concert, or festival? We can help you bring your vision to life and connect with our engaged community.
              </p>
              <Button size="lg" asChild>
                <Link href="/contact">Get in Touch</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}