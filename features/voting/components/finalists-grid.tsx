'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { FinalistCard } from './finalist-card';
import { VoteModal } from './vote-modal';
import { getUserVoteStatus, getFinalists } from '../api/voting.api';
import type { Finalist, VotingStats } from '../types/voting.types';

interface FinalistsGridProps {
  initialFinalists: Finalist[];
  stats: VotingStats;
}

export function FinalistsGrid({ initialFinalists, stats }: FinalistsGridProps) {
  const [selectedFinalist, setSelectedFinalist] = useState<Finalist | null>(null);
  const [userVoteStatus, setUserVoteStatus] = useState<{ hasVoted: boolean; votedFor?: string } | null>(null);
  const queryClient = useQueryClient();

  // Fetch finalists with real-time updates
  const { data } = useQuery({
    queryKey: ['finalists'],
    queryFn: getFinalists,
    initialData: { data: initialFinalists, stats },
    refetchInterval: 30000, // Refetch every 30 seconds for live updates
    staleTime: 10000,
  });

  // Check user's vote status on mount
  useEffect(() => {
    const checkVoteStatus = async () => {
      const status = await getUserVoteStatus();
      setUserVoteStatus(status);
    };
    checkVoteStatus();
  }, []);

  const finalists = data?.data || initialFinalists;

  const handleVoteClick = (finalist: Finalist) => {
    setSelectedFinalist(finalist);
  };

  const handleCloseModal = () => {
    setSelectedFinalist(null);
  };

  const handleVoteSuccess = (finalistId: string) => {
    setUserVoteStatus({ hasVoted: true, votedFor: finalistId });
    queryClient.invalidateQueries({ queryKey: ['finalists'] });
  };

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
        {finalists.map((finalist) => (
          <FinalistCard
            key={finalist.id}
            finalist={finalist}
            onVoteClick={() => handleVoteClick(finalist)}
            hasVoted={userVoteStatus?.votedFor === finalist.id}
            isVotingActive={stats.isVotingActive}
          />
        ))}
      </div>

      {/* Vote Modal */}
      {selectedFinalist && (
        <VoteModal
          finalist={selectedFinalist}
          isOpen={!!selectedFinalist}
          onClose={handleCloseModal}
          onVoteSuccess={handleVoteSuccess}
          hasAlreadyVoted={!!userVoteStatus?.hasVoted}
          isVotingActive={stats.isVotingActive}
        />
      )}
    </>
  );
}