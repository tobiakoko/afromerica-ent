export const formatEventDate = (date: string): string => {
  const eventDate = new Date(date)
  const day = eventDate.getDate()
  const month = eventDate.toLocaleDateString('en-US', { month: 'short' })
  const year = eventDate.getFullYear()
  
  return `${month} ${day}, ${year}`
}

export const getEventStatus = (date: string): 'upcoming' | 'ongoing' | 'past' => {
  const eventDate = new Date(date)
  const now = new Date()
  
  if (eventDate > now) return 'upcoming'
  if (eventDate.toDateString() === now.toDateString()) return 'ongoing'
  return 'past'
}