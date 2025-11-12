'use client'

import { useForm, useFieldArray } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { bookingSchema, BookingFormData } from '../../types/booking.schema'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useCreateBooking } from '../../hooks/use-create-booking'

interface BookingFormProps {
  eventId: string
  ticketPrice: number
}

export function BookingForm({ eventId, ticketPrice }: BookingFormProps) {
  const { mutate: createBooking, isPending } = useCreateBooking()

  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors },
  } = useForm<BookingFormData>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      eventId,
      quantity: 1,
      attendeeInfo: [{ name: '', email: '', phone: '' }],
    },
  })

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'attendeeInfo',
  })

  const quantity = watch('quantity')
  const totalAmount = quantity * ticketPrice

  const onSubmit = (data: BookingFormData) => {
    createBooking({
      ...data,
      quantity,
    })
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Ticket Type Selection */}
      <div>
        <Label>Ticket Type</Label>
        <select {...register('ticketType')} className="w-full">
          <option value="general">General - ₦{ticketPrice}</option>
          <option value="vip">VIP - ₦{ticketPrice * 2}</option>
          <option value="premium">Premium - ₦{ticketPrice * 3}</option>
        </select>
        {errors.ticketType && (
          <p className="text-sm text-red-500">{errors.ticketType.message}</p>
        )}
      </div>

      {/* Quantity -- Number of tickets*/}
      <div>
        <Label>Quantity</Label>
        <Input
          type="number"
          {...register('quantity', { valueAsNumber: true })}
          min={1}
          max={10}
        />
        {errors.quantity && (
          <p className="text-sm text-red-500">{errors.quantity.message}</p>
        )}
      </div>

      {/* Dynamic Attendee Fields */}
      <div className="space-y-4">
        <Label>Attendee Information</Label>
        {fields.map((field, index) => (
          <div key={field.id} className="space-y-2 rounded-lg border p-4">
            <h4 className="font-medium">Attendee {index + 1}</h4>
            
            <Input
              {...register(`attendeeInfo.${index}.name`)}
              placeholder="Full Name"
            />
            {errors.attendeeInfo?.[index]?.name && (
              <p className="text-sm text-red-500">
                {errors.attendeeInfo[index].name.message}
              </p>
            )}

            <Input
              {...register(`attendeeInfo.${index}.email`)}
              type="email"
              placeholder="Email"
            />
            {errors.attendeeInfo?.[index]?.email && (
              <p className="text-sm text-red-500">
                {errors.attendeeInfo[index].email.message}
              </p>
            )}

            <Input
              {...register(`attendeeInfo.${index}.phone`)}
              placeholder="Phone Number"
            />
            {errors.attendeeInfo?.[index]?.phone && (
              <p className="text-sm text-red-500">
                {errors.attendeeInfo[index].phone.message}
              </p>
            )}

            {fields.length > 1 && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => remove(index)}
              >
                Remove
              </Button>
            )}
          </div>
        ))}

        {fields.length < quantity && (
          <Button
            type="button"
            variant="outline"
            onClick={() => append({ name: '', email: '', phone: '' })}
          >
            Add Another Attendee
          </Button>
        )}
      </div>

      {/* Terms and Conditions */}
      <div className="flex items-center space-x-2">
        <input
          type="checkbox"
          {...register('agreeToTerms')}
          id="terms"
        />
        <Label htmlFor="terms">
          I agree to the terms and conditions
        </Label>
      </div>
      {errors.agreeToTerms && (
        <p className="text-sm text-red-500">{errors.agreeToTerms.message}</p>
      )}

      {/* Total and Submit */}
      <div className="space-y-4">
        <div className="flex justify-between text-lg font-semibold">
          <span>Total:</span>
          <span>₦{totalAmount.toLocaleString()}</span>
        </div>

        <Button type="submit" className="w-full" disabled={isPending}>
          {isPending ? 'Processing...' : 'Proceed to Payment'}
        </Button>
      </div>
    </form>
  )
}