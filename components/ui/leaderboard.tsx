import { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { Button } from './button';

interface LeaderboardItem {
  id: string;
  rank: number;
  name: string;
  subtitle?: string;
  image: string;
  value: number;
  valueLabel?: string;
  change?: number; // Position change (+/-)
  trend?: 'up' | 'down' | 'same';
}

interface LeaderboardProps {
  /** Leaderboard items */
  items: LeaderboardItem[];
  /** Show rank badges */
  showRankBadges?: boolean;
  /** Show trend indicators */
  showTrends?: boolean;
  /** Compact variant */
  compact?: boolean;
  /** On item click */
  onItemClick?: (item: LeaderboardItem) => void;
  /** Custom className */
  className?: string;
  /** Title */
  title?: string;
  /** Action button */
  action?: ReactNode;
  /** Loading state */
  loading?: boolean;
  /** Empty state message */
  emptyMessage?: string;
}

/**
 * Leaderboard Component
 *
 * Displays ranked list with visual emphasis on top positions
 *
 * @example
 * ```tsx
 * <Leaderboard
 *   title="Top Artists"
 *   items={artists.map((artist, i) => ({
 *     id: artist.id,
 *     rank: i + 1,
 *     name: artist.name,
 *     subtitle: artist.genre,
 *     image: artist.image,
 *     value: artist.votes,
 *     valueLabel: 'votes',
 *   }))}
 *   showTrends
 * />
 * ```
 */
export function Leaderboard({
  items,
  showRankBadges = true,
  showTrends = false,
  compact = false,
  onItemClick,
  className,
  title,
  action,
  loading = false,
  emptyMessage = 'No items to display',
}: LeaderboardProps) {
  const getRankColor = (rank: number) => {
    switch (rank) {
      case 1:
        return 'text-brand-primary';
      case 2:
        return 'text-brand-secondary';
      case 3:
        return 'text-brand-tertiary';
      default:
        return 'text-text-secondary';
    }
  };

  const getRankGlow = (rank: number) => {
    switch (rank) {
      case 1:
        return 'shadow-glow-pink';
      case 2:
        return 'shadow-glow-purple';
      case 3:
        return 'shadow-glow-cyan';
      default:
        return '';
    }
  };

  if (loading) {
    return (
      <div className={cn('space-y-4', className)}>
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className="card-glass rounded-xl p-6 animate-pulse"
          >
            <div className="flex items-center gap-6">
              <div className="w-12 h-12 bg-white/10 rounded-full" />
              <div className="w-16 h-16 bg-white/10 rounded-full" />
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-white/10 rounded w-1/3" />
                <div className="h-3 bg-white/10 rounded w-1/4" />
              </div>
              <div className="w-24 h-8 bg-white/10 rounded" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className={cn('card-glass rounded-xl p-12 text-center', className)}>
        <p className="text-text-secondary text-lg">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className={cn('space-y-6', className)}>
      {/* Header */}
      {(title || action) && (
        <div className="flex items-center justify-between">
          {title && (
            <h2 className="text-3xl md:text-4xl font-bold text-gradient">
              {title}
            </h2>
          )}
          {action}
        </div>
      )}

      {/* List */}
      <div className="space-y-3">
        {items.map((item, index) => (
          <LeaderboardRow
            key={item.id}
            item={item}
            compact={compact}
            showRankBadges={showRankBadges}
            showTrends={showTrends}
            rankColor={getRankColor(item.rank)}
            rankGlow={getRankGlow(item.rank)}
            onClick={() => onItemClick?.(item)}
            delay={index * 50}
          />
        ))}
      </div>
    </div>
  );
}

interface LeaderboardRowProps {
  item: LeaderboardItem;
  compact: boolean;
  showRankBadges: boolean;
  showTrends: boolean;
  rankColor: string;
  rankGlow: string;
  onClick?: () => void;
  delay?: number;
}

function LeaderboardRow({
  item,
  compact,
  showRankBadges,
  showTrends,
  rankColor,
  rankGlow,
  onClick,
  delay = 0,
}: LeaderboardRowProps) {
  const getTrendIcon = () => {
    if (!item.trend) return null;

    switch (item.trend) {
      case 'up':
        return <span className="text-success">▲</span>;
      case 'down':
        return <span className="text-error">▼</span>;
      case 'same':
        return <span className="text-text-tertiary">●</span>;
    }
  };

  if (compact) {
    return (
      <div
        className={cn(
          'card-glass rounded-lg p-4 flex items-center gap-4',
          'transition-all duration-normal hover:bg-white/10 hover:border-white/20',
          onClick && 'cursor-pointer',
          item.rank <= 3 && rankGlow,
          'animate-fade-in-up'
        )}
        onClick={onClick}
        style={{ animationDelay: `${delay}ms` }}
      >
        {/* Rank */}
        <div className={cn('text-2xl font-black shrink-0 w-12', rankColor)}>
          #{item.rank}
        </div>

        {/* Image */}
        <div className="w-12 h-12 rounded-full overflow-hidden shrink-0">
          <img
            src={item.image}
            alt={item.name}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <h4 className="font-bold truncate">{item.name}</h4>
          {item.subtitle && (
            <p className="text-sm text-text-secondary truncate">
              {item.subtitle}
            </p>
          )}
        </div>

        {/* Trend */}
        {showTrends && item.change !== undefined && (
          <div className="shrink-0 text-sm">
            {getTrendIcon()} {Math.abs(item.change)}
          </div>
        )}

        {/* Value */}
        <div className="text-right shrink-0">
          <p className={cn('text-xl font-black', rankColor)}>
            {item.value.toLocaleString()}
          </p>
          {item.valueLabel && (
            <p className="text-xs text-text-tertiary uppercase tracking-wider">
              {item.valueLabel}
            </p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        'card-glass rounded-xl p-6 flex items-center gap-6',
        'transition-all duration-normal hover:bg-white/10 hover:border-white/20',
        onClick && 'cursor-pointer',
        item.rank <= 3 && rankGlow,
        'animate-fade-in-up'
      )}
      onClick={onClick}
      style={{ animationDelay: `${delay}ms` }}
    >
      {/* Rank */}
      {showRankBadges && item.rank <= 3 ? (
        <div
          className={cn(
            'shrink-0 w-16 h-16 rounded-full flex items-center justify-center',
            'font-black text-2xl',
            item.rank === 1 && 'bg-gradient-primary text-white',
            item.rank === 2 && 'bg-brand-secondary text-white',
            item.rank === 3 && 'bg-brand-tertiary text-black'
          )}
        >
          #{item.rank}
        </div>
      ) : (
        <div className={cn('text-4xl font-black shrink-0 w-16 text-center', rankColor)}>
          #{item.rank}
        </div>
      )}

      {/* Image */}
      <div
        className={cn(
          'shrink-0 rounded-full overflow-hidden',
          compact ? 'w-12 h-12' : 'w-20 h-20',
          item.rank <= 3 && 'ring-4',
          item.rank === 1 && 'ring-brand-primary/50',
          item.rank === 2 && 'ring-brand-secondary/50',
          item.rank === 3 && 'ring-brand-tertiary/50'
        )}
      >
        <img
          src={item.image}
          alt={item.name}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <h4 className="text-xl font-bold mb-1 truncate">{item.name}</h4>
        {item.subtitle && (
          <p className="text-text-secondary truncate">{item.subtitle}</p>
        )}
      </div>

      {/* Trend */}
      {showTrends && item.change !== undefined && (
        <div className="shrink-0 text-center">
          <div className="text-2xl">{getTrendIcon()}</div>
          <p className="text-sm text-text-tertiary">
            {Math.abs(item.change)}
          </p>
        </div>
      )}

      {/* Value */}
      <div className="text-right shrink-0">
        <p
          className={cn(
            'text-4xl font-black',
            item.rank === 1 && 'text-brand-primary',
            item.rank === 2 && 'text-brand-secondary',
            item.rank === 3 && 'text-brand-tertiary',
            item.rank > 3 && 'text-text-primary'
          )}
        >
          {item.value.toLocaleString()}
        </p>
        {item.valueLabel && (
          <p className="text-sm text-text-tertiary uppercase tracking-wider mt-1">
            {item.valueLabel}
          </p>
        )}
      </div>
    </div>
  );
}

/**
 * Podium Component
 *
 * Displays top 3 in a podium layout
 */
export function Podium({ items }: { items: LeaderboardItem[] }) {
  const top3 = items.slice(0, 3);
  const [second, first, third] = [
    top3.find((i) => i.rank === 2),
    top3.find((i) => i.rank === 1),
    top3.find((i) => i.rank === 3),
  ];

  return (
    <div className="flex items-end justify-center gap-4 mb-12">
      {/* Second Place */}
      {second && (
        <div className="flex-1 max-w-xs animate-fade-in-up" style={{ animationDelay: '100ms' }}>
          <div className="text-center mb-4">
            <div className="inline-block mb-4">
              <img
                src={second.image}
                alt={second.name}
                className="w-24 h-24 rounded-full object-cover ring-4 ring-brand-secondary/50"
              />
            </div>
            <h3 className="text-xl font-bold">{second.name}</h3>
            <p className="text-text-secondary mb-2">{second.subtitle}</p>
            <p className="text-3xl font-black text-brand-secondary">
              {second.value.toLocaleString()}
            </p>
          </div>
          <div className="bg-brand-secondary/20 border-2 border-brand-secondary rounded-t-xl h-32 flex items-center justify-center">
            <div className="text-6xl font-black text-brand-secondary">#2</div>
          </div>
        </div>
      )}

      {/* First Place */}
      {first && (
        <div className="flex-1 max-w-xs animate-fade-in-up">
          <div className="text-center mb-4">
            <div className="inline-block mb-4 relative">
              <img
                src={first.image}
                alt={first.name}
                className="w-32 h-32 rounded-full object-cover ring-4 ring-brand-primary/50 shadow-glow-pink"
              />
              <div className="absolute -top-2 -right-2 text-4xl">👑</div>
            </div>
            <h3 className="text-2xl font-bold">{first.name}</h3>
            <p className="text-text-secondary mb-2">{first.subtitle}</p>
            <p className="text-4xl font-black text-gradient">
              {first.value.toLocaleString()}
            </p>
          </div>
          <div className="bg-gradient-primary rounded-t-xl h-48 flex items-center justify-center shadow-glow-pink">
            <div className="text-7xl font-black text-white">#1</div>
          </div>
        </div>
      )}

      {/* Third Place */}
      {third && (
        <div className="flex-1 max-w-xs animate-fade-in-up" style={{ animationDelay: '200ms' }}>
          <div className="text-center mb-4">
            <div className="inline-block mb-4">
              <img
                src={third.image}
                alt={third.name}
                className="w-20 h-20 rounded-full object-cover ring-4 ring-brand-tertiary/50"
              />
            </div>
            <h3 className="text-lg font-bold">{third.name}</h3>
            <p className="text-sm text-text-secondary mb-2">{third.subtitle}</p>
            <p className="text-2xl font-black text-brand-tertiary">
              {third.value.toLocaleString()}
            </p>
          </div>
          <div className="bg-brand-tertiary/20 border-2 border-brand-tertiary rounded-t-xl h-24 flex items-center justify-center">
            <div className="text-5xl font-black text-brand-tertiary">#3</div>
          </div>
        </div>
      )}
    </div>
  );
}
