
export function BookingsTable({ bookings }: { bookings: any[] }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full table-auto">
        <thead>
          <tr>
            <th className="text-left">ID</th>
            <th className="text-left">User</th>
            <th className="text-left">Event</th>
            <th className="text-left">Status</th>
          </tr>
        </thead>
        <tbody>
          {bookings.map((b: any) => (
            <tr key={b.id} className="border-t">
              <td>{b.id}</td>
              <td>{b.userName ?? b.user?.name ?? '—'}</td>
              <td>{b.eventTitle ?? b.event?.title ?? '—'}</td>
              <td>{b.status ?? '—'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
