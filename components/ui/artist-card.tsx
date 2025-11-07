import { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { Button } from './button';

interface ArtistCardProps {
  /** Artist name */
  name: string;
  /** Artist genre(s) */
  genre: string | string[];
  /** Artist location */
  location: string;
  /** Number of votes */
  votes: number;
  /** Artist image URL */
  image: string;
  /** Artist ranking position */
  rank?: number;
  /** Cover/background image */
  coverImage?: string;
  /** Show rank badge */
  showRank?: boolean;
  /** Card variant */
  variant?: 'default' | 'compact' | 'featured';
  /** On vote click handler */
  onVoteClick?: () => void;
  /** On card click handler */
  onClick?: () => void;
  /** Custom className */
  className?: string;
  /** Additional content */
  children?: ReactNode;
}

/**
 * Artist Card Component
 *
 * Immersive card design for showcasing artists with hover effects,
 * ranking badges, and vote counts
 *
 * @example
 * ```tsx
 * <ArtistCard
 *   name="Burna Boy"
 *   genre={["Afrobeats", "Afro-fusion"]}
 *   location="Lagos, Nigeria"
 *   votes={5432}
 *   rank={1}
 *   image="/artists/burna-boy.jpg"
 *   onVoteClick={() => handleVote('burna-boy')}
 * />
 * ```
 */
export function ArtistCard({
  name,
  genre,
  location,
  votes,
  image,
  rank,
  coverImage,
  showRank = true,
  variant = 'default',
  onVoteClick,
  onClick,
  className,
  children,
}: ArtistCardProps) {
  const genreText = Array.isArray(genre) ? genre.join(', ') : genre;

  if (variant === 'compact') {
    return (
      <div
        className={cn(
          'card-glass rounded-xl p-4 flex items-center gap-4 cursor-pointer transition-all duration-normal',
          'hover:bg-white/10 hover:border-white/20',
          className
        )}
        onClick={onClick}
      >
        {/* Rank */}
        {showRank && rank && (
          <div className="text-3xl font-black text-gradient shrink-0">
            #{rank}
          </div>
        )}

        {/* Image */}
        <div className="w-16 h-16 rounded-full overflow-hidden shrink-0">
          <img
            src={image}
            alt={name}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <h4 className="text-lg font-bold truncate">{name}</h4>
          <p className="text-sm text-text-secondary truncate">
            {genreText} · {location}
          </p>
        </div>

        {/* Votes */}
        <div className="text-right shrink-0">
          <p className="text-2xl font-black text-brand-primary">
            {votes.toLocaleString()}
          </p>
          <p className="text-xs text-text-tertiary uppercase tracking-wider">
            Votes
          </p>
        </div>
      </div>
    );
  }

  if (variant === 'featured') {
    return (
      <div
        className={cn(
          'card-lift card-glow rounded-3xl overflow-hidden group relative',
          className
        )}
        onClick={onClick}
      >
        {/* Cover Image */}
        <div className="aspect-video relative overflow-hidden">
          <img
            src={coverImage || image}
            alt={name}
            className="w-full h-full object-cover transition-transform duration-slow group-hover:scale-110"
          />
          <div className="hero-overlay absolute inset-0" />

          {/* Rank Badge */}
          {showRank && rank && (
            <div className="absolute top-6 left-6">
              <div className="bg-gradient-primary text-white px-6 py-3 rounded-full font-black text-xl shadow-glow-pink">
                #{rank}
              </div>
            </div>
          )}

          {/* Votes Badge */}
          <div className="absolute bottom-6 right-6">
            <div className="card-glass px-6 py-3 rounded-full">
              <p className="text-3xl font-black text-gradient">
                {votes.toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-8 bg-background-elevated">
          <div className="flex items-start gap-6 mb-6">
            {/* Artist Image */}
            <div className="w-24 h-24 rounded-full overflow-hidden shrink-0 ring-4 ring-brand-primary/30">
              <img
                src={image}
                alt={name}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Info */}
            <div className="flex-1">
              <h3 className="text-3xl font-black mb-2">{name}</h3>
              <p className="text-lg text-text-secondary mb-2">{genreText}</p>
              <p className="text-text-tertiary">{location}</p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-4">
            <Button
              variant="brandPrimary"
              size="lg"
              onClick={(e) => {
                e.stopPropagation();
                onVoteClick?.();
              }}
              className="flex-1"
            >
              Vote Now
            </Button>
            <Button variant="brandGhost" size="lg">
              View Profile
            </Button>
          </div>

          {children && <div className="mt-6">{children}</div>}
        </div>
      </div>
    );
  }

  // Default variant
  return (
    <div
      className={cn(
        'card-lift card-glass rounded-2xl overflow-hidden group cursor-pointer',
        className
      )}
      onClick={onClick}
    >
      {/* Image */}
      <div className="aspect-card relative overflow-hidden">
        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover transition-transform duration-slow group-hover:scale-110"
        />
        <div className="hero-overlay absolute inset-0" />

        {/* Rank Badge */}
        {showRank && rank && (
          <div className="absolute top-4 left-4">
            <div className="bg-brand-primary text-white px-4 py-2 rounded-full font-bold shadow-glow-pink">
              #{rank}
            </div>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-6">
        <h3 className="text-2xl font-bold mb-2">{name}</h3>
        <p className="text-text-secondary mb-4">
          {genreText} · {location}
        </p>

        {/* Stats & Actions */}
        <div className="flex items-center justify-between">
          <div>
            <p className="text-3xl font-black text-gradient">
              {votes.toLocaleString()}
            </p>
            <p className="text-sm text-text-tertiary uppercase tracking-wider">
              Votes
            </p>
          </div>
          <Button
            variant="brandPrimary"
            onClick={(e) => {
              e.stopPropagation();
              onVoteClick?.();
            }}
          >
            Vote Now
          </Button>
        </div>

        {children && <div className="mt-4 pt-4 border-t border-border">{children}</div>}
      </div>
    </div>
  );
}

/**
 * Event Card Component
 *
 * Card design for showcasing events with date, location, and CTA
 */
export function EventCard({
  title,
  date,
  location,
  image,
  price,
  category,
  availableTickets,
  onBookClick,
  onClick,
  className,
}: {
  title: string;
  date: string;
  location: string;
  image: string;
  price?: number;
  category?: string;
  availableTickets?: number;
  onBookClick?: () => void;
  onClick?: () => void;
  className?: string;
}) {
  return (
    <div
      className={cn(
        'card-lift card-glass rounded-2xl overflow-hidden group cursor-pointer',
        className
      )}
      onClick={onClick}
    >
      {/* Image */}
      <div className="aspect-video relative overflow-hidden">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-slow group-hover:scale-110"
        />
        <div className="hero-overlay absolute inset-0" />

        {/* Category Badge */}
        {category && (
          <div className="absolute top-4 right-4">
            <div className="card-glass px-4 py-2 rounded-full text-sm font-semibold uppercase tracking-wider">
              {category}
            </div>
          </div>
        )}

        {/* Date Badge */}
        <div className="absolute bottom-4 left-4">
          <div className="bg-brand-tertiary text-black px-4 py-2 rounded-lg font-bold">
            {new Date(date).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
            })}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <h3 className="text-2xl font-bold mb-3">{title}</h3>

        <div className="space-y-2 mb-4 text-text-secondary">
          <p className="flex items-center gap-2">
            <span className="text-brand-tertiary">📍</span>
            {location}
          </p>
          <p className="flex items-center gap-2">
            <span className="text-brand-tertiary">📅</span>
            {new Date(date).toLocaleDateString('en-US', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </p>
        </div>

        {/* Price & Availability */}
        <div className="flex items-center justify-between mb-4">
          {price ? (
            <div>
              <p className="text-2xl font-black text-brand-primary">
                ${price}
              </p>
              <p className="text-xs text-text-tertiary">per ticket</p>
            </div>
          ) : (
            <div>
              <p className="text-2xl font-black text-brand-primary">FREE</p>
            </div>
          )}

          {availableTickets !== undefined && (
            <div className="text-right">
              <p className="text-sm text-text-secondary">
                {availableTickets > 0 ? (
                  <span className="text-brand-tertiary font-semibold">
                    {availableTickets} left
                  </span>
                ) : (
                  <span className="text-error">Sold Out</span>
                )}
              </p>
            </div>
          )}
        </div>

        {/* CTA */}
        <Button
          variant="brandPrimary"
          size="lg"
          className="w-full"
          onClick={(e) => {
            e.stopPropagation();
            onBookClick?.();
          }}
          disabled={availableTickets === 0}
        >
          {availableTickets === 0 ? 'Sold Out' : 'Book Tickets'}
        </Button>
      </div>
    </div>
  );
}
