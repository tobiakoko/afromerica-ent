import { PageHero } from "@/components/layout/page-hero";
import { Card } from "@/components/ui/card";
import { Music, Users, Trophy, Heart } from "lucide-react";

const values = [
  {
    icon: Music,
    title: "Authentic African Music",
    description: "We celebrate the rich diversity of African music and culture"
  },
  {
    icon: Users,
    title: "Community First",
    description: "Building a vibrant community of artists and music lovers"
  },
  {
    icon: Trophy,
    title: "Excellence",
    description: "Showcasing the best talent and delivering premium experiences"
  },
  {
    icon: Heart,
    title: "Passion",
    description: "Driven by our love for African music and culture"
  },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen">
      <PageHero
        title="About Afromerica"
        description="Celebrating African culture through music and events"
        badge="Our Story"
      />

      <section className="container-wide py-16">
        <div className="max-w-3xl mx-auto prose prose-lg dark:prose-invert">
          <h2>Who We Are</h2>
          <p>
            Afromerica Entertainment is a premier entertainment company dedicated to promoting 
            African music and culture. We organize world-class events, support emerging artists, 
            and create unforgettable experiences for music lovers.
          </p>

          <h2>Our Mission</h2>
          <p>
            To bridge the gap between African artists and global audiences by providing platforms 
            for talent showcase, cultural exchange, and community building.
          </p>
        </div>
      </section>

      <section className="container-wide py-16">
        <h2 className="text-3xl font-bold text-center mb-12">Our Values</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {values.map((value) => {
            const Icon = value.icon;
            return (
              <Card key={value.title} className="p-6 text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
                  <Icon className="w-8 h-8 text-primary" />
                </div>
                <h3 className="font-semibold text-lg mb-2">{value.title}</h3>
                <p className="text-sm text-muted-foreground">{value.description}</p>
              </Card>
            );
          })}
        </div>
      </section>
    </div>
  );
}
