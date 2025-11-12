
export function BookingListPresenter({
  bookings,
  isLoading,
  error,
  filter,
  onFilterChange,
  onCancel,
}: any) {
  if (isLoading) return <div>Loading...</div>
  if (error) return <div className="text-red-500">Error loading bookings</div>

  return (
    <div>
      <div className="mb-4">Filter: {filter}</div>
      <ul className="space-y-2">
        {bookings.map((b: any) => (
          <li key={b.id} className="p-2 border rounded">
            <div className="flex justify-between items-center">
              <div>
                <div className="font-medium">{b.userName ?? b.id}</div>
                <div className="text-sm text-muted-foreground">{b.eventTitle ?? ''}</div>
              </div>
              <div>
                <button
                  className="text-sm text-red-600"
                  onClick={() => onCancel?.(b.id)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}
