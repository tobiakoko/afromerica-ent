/**
 * Analytics Tracking Service
 *
 * Centralized analytics tracking using Vercel Analytics
 * Following industry best practices for event tracking
 */

import { track } from '@vercel/analytics'

// ============================================================================
// ANALYTICS EVENT TYPES
// ============================================================================

export enum AnalyticsEvent {
  // Page Views
  PAGE_VIEW = 'page_view',

  // Navigation
  NAV_CLICK = 'nav_click',
  FOOTER_LINK_CLICK = 'footer_link_click',

  // Events
  EVENT_VIEW = 'event_view',
  EVENT_CARD_CLICK = 'event_card_click',
  EVENT_SHARE = 'event_share',
  EVENT_FILTER = 'event_filter',
  EVENT_SEARCH = 'event_search',

  // Tickets
  TICKET_VIEW_START = 'ticket_view_start',
  TICKET_CHECKOUT_START = 'ticket_checkout_start',
  TICKET_CHECKOUT_INFO = 'ticket_checkout_info',
  TICKET_PAYMENT_INIT = 'ticket_payment_init',
  TICKET_PURCHASE_SUCCESS = 'ticket_purchase_success',
  TICKET_PURCHASE_FAILED = 'ticket_purchase_failed',

  // Voting
  VOTE_LEADERBOARD_VIEW = 'vote_leaderboard_view',
  VOTE_ARTIST_SELECT = 'vote_artist_select',
  VOTE_PACKAGE_SELECT = 'vote_package_select',
  VOTE_CHECKOUT_START = 'vote_checkout_start',
  VOTE_OTP_SENT = 'vote_otp_sent',
  VOTE_OTP_VERIFIED = 'vote_otp_verified',
  VOTE_PAYMENT_INIT = 'vote_payment_init',
  VOTE_SUCCESS = 'vote_success',
  VOTE_FAILED = 'vote_failed',

  // Artists
  ARTIST_VIEW = 'artist_view',
  ARTIST_CARD_CLICK = 'artist_card_click',
  ARTIST_SOCIAL_CLICK = 'artist_social_click',

  // Forms
  CONTACT_FORM_START = 'contact_form_start',
  CONTACT_FORM_SUBMIT = 'contact_form_submit',
  NEWSLETTER_SUBSCRIBE = 'newsletter_subscribe',

  // User Actions
  SCROLL_DEPTH = 'scroll_depth',
  EXTERNAL_LINK_CLICK = 'external_link_click',
  CTA_CLICK = 'cta_click',
  VIDEO_PLAY = 'video_play',
  IMAGE_GALLERY_VIEW = 'image_gallery_view',

  // Engagement
  TIME_ON_PAGE = 'time_on_page',
  BANNER_CLICK = 'banner_click',
  FEATURE_INTERACTION = 'feature_interaction',

  // Errors
  ERROR_BOUNDARY = 'error_boundary',
  API_ERROR = 'api_error',
  VALIDATION_ERROR = 'validation_error',
}

// ============================================================================
// EVENT PROPERTIES TYPES
// ============================================================================

interface BaseEventProperties {
  timestamp?: string
  page_url?: string
  page_title?: string
  referrer?: string
  [key: string]: string | number | boolean | undefined
}

interface EventViewProperties extends BaseEventProperties {
  event_id: string
  event_slug: string
  event_title: string
  event_date?: string
  event_price?: number
  event_status?: string
}

interface TicketProperties extends BaseEventProperties {
  event_id: string
  event_slug: string
  ticket_type?: string
  quantity?: number
  amount?: number
  currency?: string
}

interface VoteProperties extends BaseEventProperties {
  artist_id?: string
  artist_name?: string
  package_id?: string
  package_name?: string
  vote_count?: number
  amount?: number
  currency?: string
}

interface NavigationProperties extends BaseEventProperties {
  link_text?: string
  link_url?: string
  link_location?: 'header' | 'footer' | 'sidebar' | 'content' | 'cta' | string
}

interface FormProperties extends BaseEventProperties {
  form_name: string
  form_location?: string
  field_count?: number
  success?: boolean
}

interface ErrorProperties extends BaseEventProperties {
  error_message: string
  error_code?: string
  error_stack?: string
  component?: string
}

type EventProperties =
  | EventViewProperties
  | TicketProperties
  | VoteProperties
  | NavigationProperties
  | FormProperties
  | ErrorProperties
  | BaseEventProperties

// ============================================================================
// ANALYTICS SERVICE
// ============================================================================

class AnalyticsService {
  private static instance: AnalyticsService
  private enabled: boolean = true

  private constructor() {
    // Check if analytics should be enabled (respect DNT, etc.)
    if (typeof window !== 'undefined') {
      this.enabled = !navigator.doNotTrack || navigator.doNotTrack !== '1'
    }
  }

  static getInstance(): AnalyticsService {
    if (!AnalyticsService.instance) {
      AnalyticsService.instance = new AnalyticsService()
    }
    return AnalyticsService.instance
  }

  /**
   * Track an analytics event
   */
  track(event: AnalyticsEvent, properties?: EventProperties): void {
    if (!this.enabled) return

    try {
      const enrichedProperties = this.enrichProperties(properties)

      // Track with Vercel Analytics
      track(event, enrichedProperties as Record<string, string | number | boolean>)

      // Log in development
      if (process.env.NODE_ENV === 'development') {
        console.log('[Analytics]', event, enrichedProperties)
      }
    } catch (error) {
      console.error('[Analytics] Tracking error:', error)
    }
  }

  /**
   * Enrich event properties with standard metadata
   */
  private enrichProperties(properties?: EventProperties): Record<string, string | number | boolean | undefined> {
    if (typeof window === 'undefined') {
      return (properties || {}) as Record<string, string | number | boolean | undefined>
    }

    const baseProps = properties || {}
    return {
      ...(baseProps as Record<string, string | number | boolean | undefined>),
      timestamp: new Date().toISOString(),
      page_url: window.location.href,
      page_title: document.title,
      referrer: document.referrer || 'direct',
      viewport_width: window.innerWidth,
      viewport_height: window.innerHeight,
    }
  }

  /**
   * Track page view
   */
  pageView(pageName?: string): void {
    this.track(AnalyticsEvent.PAGE_VIEW, {
      page_title: pageName || (typeof document !== 'undefined' ? document.title : ''),
    })
  }

  /**
   * Track navigation click
   */
  navClick(linkText: string, linkUrl: string, location: NavigationProperties['link_location'] = 'header'): void {
    this.track(AnalyticsEvent.NAV_CLICK, {
      link_text: linkText,
      link_url: linkUrl,
      link_location: location,
    })
  }

  /**
   * Track event viewing
   */
  eventView(eventId: string, eventSlug: string, eventTitle: string, additionalProps?: Partial<EventViewProperties>): void {
    this.track(AnalyticsEvent.EVENT_VIEW, {
      event_id: eventId,
      event_slug: eventSlug,
      event_title: eventTitle,
      ...additionalProps,
    })
  }

  /**
   * Track ticket funnel
   */
  ticketCheckoutStart(eventId: string, eventSlug: string): void {
    this.track(AnalyticsEvent.TICKET_CHECKOUT_START, {
      event_id: eventId,
      event_slug: eventSlug,
    })
  }

  ticketPurchaseSuccess(eventId: string, eventSlug: string, amount: number, quantity: number): void {
    this.track(AnalyticsEvent.TICKET_PURCHASE_SUCCESS, {
      event_id: eventId,
      event_slug: eventSlug,
      amount,
      quantity,
      currency: 'NGN',
    })
  }

  /**
   * Track voting funnel
   */
  voteCheckoutStart(artistId: string, artistName: string, packageName?: string): void {
    this.track(AnalyticsEvent.VOTE_CHECKOUT_START, {
      artist_id: artistId,
      artist_name: artistName,
      package_name: packageName,
    })
  }

  voteSuccess(artistId: string, artistName: string, voteCount: number, amount: number): void {
    this.track(AnalyticsEvent.VOTE_SUCCESS, {
      artist_id: artistId,
      artist_name: artistName,
      vote_count: voteCount,
      amount,
      currency: 'NGN',
    })
  }

  /**
   * Track form interactions
   */
  formStart(formName: string, formLocation?: string): void {
    this.track(AnalyticsEvent.CONTACT_FORM_START, {
      form_name: formName,
      form_location: formLocation,
    })
  }

  formSubmit(formName: string, success: boolean = true): void {
    this.track(AnalyticsEvent.CONTACT_FORM_SUBMIT, {
      form_name: formName,
      success,
    })
  }

  /**
   * Track errors
   */
  trackError(errorMessage: string, errorCode?: string, component?: string): void {
    this.track(AnalyticsEvent.API_ERROR, {
      error_message: errorMessage,
      error_code: errorCode,
      component,
    })
  }

  /**
   * Track external link clicks
   */
  externalLinkClick(linkUrl: string, linkText?: string): void {
    this.track(AnalyticsEvent.EXTERNAL_LINK_CLICK, {
      link_url: linkUrl,
      link_text: linkText,
    })
  }

  /**
   * Track CTA clicks
   */
  ctaClick(ctaText: string, ctaLocation: string): void {
    this.track(AnalyticsEvent.CTA_CLICK, {
      link_text: ctaText,
      link_location: ctaLocation,
    })
  }

  /**
   * Track scroll depth
   */
  scrollDepth(depth: number): void {
    this.track(AnalyticsEvent.SCROLL_DEPTH, {
      depth_percentage: depth,
    })
  }
}

// Export singleton instance
export const analytics = AnalyticsService.getInstance()

// Export convenience functions
export const trackEvent = (event: AnalyticsEvent, properties?: EventProperties) =>
  analytics.track(event, properties)

export const trackPageView = (pageName?: string) =>
  analytics.pageView(pageName)

export const trackNavClick = (linkText: string, linkUrl: string, location?: NavigationProperties['link_location']) =>
  analytics.navClick(linkText, linkUrl, location)

export const trackEventView = (eventId: string, eventSlug: string, eventTitle: string, additionalProps?: Partial<EventViewProperties>) =>
  analytics.eventView(eventId, eventSlug, eventTitle, additionalProps)

export const trackError = (errorMessage: string, errorCode?: string, component?: string) =>
  analytics.trackError(errorMessage, errorCode, component)
