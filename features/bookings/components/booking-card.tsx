import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Booking, Event } from '@/types'

interface BookingCardProps {
  booking: Booking
  event: Event
  onCancel: (id: string) => void
}

export function BookingCard({ booking, event, onCancel }: BookingCardProps) {
  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold">{event.title}</h3>
      <p className="text-muted-foreground">{event.date}</p>
      <div className="mt-4 flex justify-between">
        <span>Quantity: {booking.quantity}</span>
        <span>₦{booking.totalAmount.toLocaleString()}</span>
      </div>
      <Button 
        variant="outline" 
        className="mt-4"
        onClick={() => onCancel(booking.id)}
      >
        Cancel Booking
      </Button>
    </Card>
  )
}