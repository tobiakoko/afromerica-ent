import { createClient } from "@/utils/supabase/server";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";
import { EventTable } from "@/components/admin/EventTable";

export default async function AdminEventsPage() {
  const supabase = await createClient();
  
  const { data: events } = await supabase
    .from('events')
    .select('*')
    .order('date', { ascending: false });

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

      <EventTable events={events || []} />
    </div>
  );
}