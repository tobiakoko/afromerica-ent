import { Calendar, MapPin } from 'lucide-react';
import type { Event } from '../types/event.types';

interface EventRowProps {
  event: Pick<Event, 'id' | 'title' | 'date' | 'location' | 'city'>;
  onClick?: () => void;
}

export function EventRow({ event, onClick }: EventRowProps) {
  return (
    <div
      className="group flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-lime-400/50 transition-all duration-300 cursor-pointer"
      onClick={onClick}
    >
      {/* Event Info */}
      <div className="flex-1">
        <h4 className="text-xl font-semibold text-white mb-2 group-hover:text-lime-400 transition-colors">
          {event.title}
        </h4>
        <div className="flex flex-wrap gap-4 text-white/60 text-sm">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            <span>{event.date}</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4" />
            <span>
              {event.location}
              {event.city && `, ${event.city}`}
            </span>
          </div>
        </div>
      </div>

      {/* Ticket Button */}
      <button
        className="px-6 py-3 bg-lime-400 text-black font-semibold rounded-lg hover:bg-lime-300 transition-all duration-200 whitespace-nowrap hover:scale-105"
      >
        Get Tickets
      </button>
    </div>
  );
}