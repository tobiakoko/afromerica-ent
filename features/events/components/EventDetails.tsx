
export function EventDetails({ event }: { event: any }) {
  // Minimal placeholder renderer. Replace with the richer detail layout later.
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">{event?.title ?? 'Event Title'}</h1>
      <p className="text-sm text-muted-foreground">{event?.description ?? 'Description coming soon.'}</p>
      <div className="mt-4">{event?.tickets ? <div>Tickets available</div> : <div>No tickets</div>}</div>
    </div>
  )
}
