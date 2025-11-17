import { createClient } from "@/utils/supabase/server";
import { EventCard } from "@/components/events/EventCard";
import { PageHero } from "@/components/layout/page-hero";

export default async function EventsPage() {
  const supabase = await createClient();
  
  const { data: events, error } = await supabase
    .from('events')
    .select(`
      *,
      event_venues (
        venues (*)
      ),
      ticket_types (*)
    `)
    .gte('date', new Date().toISOString())
    .order('date', { ascending: true });

  if (error) {
    console.error('Error fetching events:', error);
  }

  return (
    <div className="min-h-screen">
      <PageHero
        title="Upcoming Events"
        description="Experience the best of African music and culture"
        badge="Events"
      />

      <section className="container-wide py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events?.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>

        {!events?.length && (
          <div className="text-center py-16">
            <p className="text-muted-foreground">No upcoming events</p>
          </div>
        )}
      </section>
    </div>
  );
}
