'use client'

/**
 * Tracked Link Component
 * A Link wrapper that tracks analytics on click
 */

import Link from 'next/link'
import { ReactNode } from 'react'
import { analytics, AnalyticsEvent } from '@/lib/analytics'

interface TrackedLinkProps {
  href: string
  children: ReactNode
  className?: string
  event: AnalyticsEvent
  eventProperties?: {
    [key: string]: string | number | boolean | undefined
  }
  [key: string]: unknown
}

export function TrackedLink({
  href,
  children,
  className,
  event,
  eventProperties,
  ...props
}: TrackedLinkProps) {
  const handleClick = () => {
    if (eventProperties) {
      analytics.track(event, eventProperties as { [key: string]: string | number | boolean | undefined })
    } else {
      analytics.track(event)
    }
  }

  return (
    <Link href={href} className={className} onClick={handleClick} {...props}>
      {children}
    </Link>
  )
}
