'use client';

import { Search } from 'lucide-react';
import type { EventFilter, EventCategoryFilter } from '../types/event.types';


interface EventFiltersProps {
  activeFilter: EventFilter;
  onFilterChange: (filter: EventFilter) => void;
  categoryFilter: EventCategoryFilter;
  onCategoryChange: (category: EventCategoryFilter) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

const filters: { value: EventFilter; label: string }[] = [
  { value: 'all', label: 'All Events' },
  { value: 'upcoming', label: 'Upcoming' },
  { value: 'featured', label: 'Featured' },
  { value: 'past', label: 'Past' },
];

const categories: { value: EventCategoryFilter; label: string }[] = [
  { value: 'all', label: 'All Events' },
  { value: 'concert', label: 'Concerts' },
  { value: 'festival', label: 'Festivals' },
  { value: 'club', label: 'Club Events' },
  { value: 'private', label: 'Private Events' },
];

export function EventFilters({
  activeFilter,
  onFilterChange,
  categoryFilter,
  onCategoryChange,
  searchQuery,
  onSearchChange,
}: EventFiltersProps) {
  return (
    <div className="space-y-6">
      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40 w-5 h-5" />
        <input
          type="text"
          placeholder="Search events by name, artist, or location..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-white/40 focus:outline-none focus:border-lime-400 transition-colors"
        />
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        {/* Status Filters */}
        <div className="flex flex-wrap gap-2">
          {filters.map((filter) => (
            <button
              key={filter.value}
              onClick={() => onFilterChange(filter.value)}
              className={`px-6 py-2.5 rounded-lg font-medium transition-all duration-200 ${
                activeFilter === filter.value
                  ? 'bg-lime-400 text-black'
                  : 'bg-white/5 text-white hover:bg-white/10 border border-white/10'
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>

        {/* Category Dropdown */}
        <div className="sm:ml-auto">
          <select
            value={categoryFilter}
            onChange={(e) => onCategoryChange(e.target.value as EventCategoryFilter)}
            className="px-6 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-lime-400 transition-colors cursor-pointer"
          >
            {categories.map((category) => (
              <option key={category.value} value={category.value} className="bg-zinc-900">
                {category.label}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}