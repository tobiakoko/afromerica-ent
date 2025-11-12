'use client';

import { useQuery } from '@tanstack/react-query';
import { EventCard } from './event-card';
import { EventCardSkeleton } from './event-card-skeleton';
import { EventFilters } from './event-filters';
import { eventsApi } from '../api/events-api';
import type { Event, EventFilter, EventCategoryFilter } from '../types/event.types';

interface EventGridProps {
  initialEvents: Event[];
}

export function EventGrid({ initialEvents }: EventGridProps) {
  const [activeFilter, setActiveFilter] = useState<EventFilter>('all');
  const [categoryFilter, setCategoryFilter] = useState<EventCategoryFilter>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Fetch events with filters
  const { data, isLoading } = useQuery({
    queryKey: ['events', activeFilter, categoryFilter, searchQuery],
    queryFn: () =>
      eventsApi.getEvents({
        filter: activeFilter,
        category: categoryFilter !== 'all' ? categoryFilter : undefined,
        search: searchQuery || undefined,
      }),
    initialData: { data: initialEvents, pagination: { page: 1, limit: 12, total: initialEvents.length, totalPages: 1 } },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  const events = data?.data || initialEvents;

  return (
    <>
      {/* Filters */}
      <EventFilters
        activeFilter={activeFilter}
        onFilterChange={setActiveFilter}
        categoryFilter={categoryFilter}
        onCategoryChange={setCategoryFilter}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      {/* Loading State */}
      {isLoading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
          {[...Array(6)].map((_, i) => (
            <EventCardSkeleton key={i} />
          ))}
        </div>
      )}

      {/* Events Grid */}
      {!isLoading && events.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
          {events.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      )}

      {/* Empty State */}
      {!isLoading && events.length === 0 && (
        <div className="text-center py-20">
          <div className="text-white/40 text-6xl mb-4">🎫</div>
          <h3 className="text-2xl font-bold text-white mb-2">No events found</h3>
          <p className="text-white/60">
            Try adjusting your filters or check back later for new events
          </p>
        </div>
      )}

      {/* Load More Button */}
      {!isLoading && events.length > 0 && data?.pagination && data.pagination.page < data.pagination.totalPages && (
        <div className="mt-12 text-center">
          <button className="px-8 py-4 bg-white/5 text-white font-semibold rounded-lg hover:bg-white/10 transition-colors duration-200 border border-white/10">
            Load More Events
          </button>
        </div>
      )}
    </>
  );
}