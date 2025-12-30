import { createAdminClient } from "@/utils/supabase/admin";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";
import { EventTable } from "@/components/admin/EventTable";

export const dynamic = 'force-dynamic'

export default async function AdminEventsPage() {
  const supabase = createAdminClient();
  
  const { data: events, error } = await supabase
    .from('events')
    .select('id, title, slug, status, event_date, capacity, tickets_sold, image_url, cover_image_url, venue')
    .eq('is_active', true)
    .order('event_date', { ascending: false });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Events</h1>
          <p className="text-muted-foreground">Manage your events</p>
        </div>
        <Button asChild>
          <Link href="/admin/events/new">
            <Plus className="w-4 h-4" />
            Add Event
          </Link>
        </Button>
      </div>

      {error && (
        <div className="p-3 rounded border border-destructive text-destructive text-sm">
          Failed to load events: {error.message}
        </div>
      )}

      <EventTable events={events || []} />
    </div>
  );
}
