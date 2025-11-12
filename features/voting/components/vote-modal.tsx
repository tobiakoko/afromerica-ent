'use client';

import Image from 'next/image';
import { X, ThumbsUp, Music, Instagram, Twitter, Youtube, ExternalLink, Loader2 } from 'lucide-react';
import { submitVote } from '../api/voting.api';
import type { Finalist } from '../types/voting.types';

interface VoteModalProps {
  finalist: Finalist;
  isOpen: boolean;
  onClose: () => void;
  onVoteSuccess: (finalistId: string) => void;
  hasAlreadyVoted: boolean;
  isVotingActive: boolean;
}

export function VoteModal({
  finalist,
  isOpen,
  onClose,
  onVoteSuccess,
  hasAlreadyVoted,
  isVotingActive,
}: VoteModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleVote = async () => {
    if (!isVotingActive) {
      setError('Voting has ended');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const response = await submitVote(finalist.id);
      
      if (response.success) {
        setShowConfirmation(true);
        onVoteSuccess(finalist.id);
        
        // Close modal after 2 seconds
        setTimeout(() => {
          onClose();
        }, 2000);
      } else {
        setError(response.message || 'Failed to submit vote');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-zinc-900 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-white/10">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 bg-black/50 hover:bg-black/70 rounded-full transition-colors"
        >
          <X className="w-6 h-6 text-white" />
        </button>

        {/* Success Confirmation */}
        {showConfirmation && (
          <div className="absolute inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center z-20">
            <div className="text-center space-y-4 p-8">
              <div className="w-20 h-20 bg-lime-400 rounded-full flex items-center justify-center mx-auto">
                <ThumbsUp className="w-10 h-10 text-black" />
              </div>
              <h3 className="text-3xl font-bold text-white">Vote Submitted!</h3>
              <p className="text-white/70 text-lg">
                Thank you for voting for {finalist.stageName}
              </p>
            </div>
          </div>
        )}

        {/* Header Image */}
        <div className="relative h-64 overflow-hidden">
          {finalist.coverImage || finalist.image ? (
            <Image
              src={finalist.coverImage || finalist.image}
              alt={finalist.name}
              fill
              className="object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-lime-400/20 to-purple-600/20" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 to-transparent" />
        </div>

        {/* Content */}
        <div className="p-8 space-y-6">
          {/* Name & Rank */}
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h2 className="text-3xl font-bold text-white">{finalist.stageName}</h2>
              <span className="px-3 py-1 bg-lime-400/20 text-lime-400 text-sm font-bold rounded-full">
                Rank #{finalist.rank}
              </span>
            </div>
            <p className="text-white/60 text-lg">{finalist.name}</p>
          </div>

          {/* Genre Tags */}
          <div className="flex flex-wrap gap-2">
            {finalist.genre.map((genre, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-white/10 text-white rounded-full text-sm"
              >
                {genre}
              </span>
            ))}
          </div>

          {/* Bio */}
          <div>
            <h3 className="text-white font-semibold mb-2">About</h3>
            <p className="text-white/70 leading-relaxed">{finalist.bio}</p>
          </div>

          {/* Current Votes */}
          <div className="p-4 bg-white/5 rounded-lg">
            <div className="flex items-center justify-between">
              <span className="text-white/70">Current Votes</span>
              <span className="text-2xl font-bold text-lime-400">
                {finalist.voteCount.toLocaleString()}
              </span>
            </div>
          </div>

          {/* Social Media */}
          {(finalist.socialMedia.instagram || finalist.socialMedia.twitter || finalist.socialMedia.youtube || finalist.socialMedia.spotify) && (
            <div>
              <h3 className="text-white font-semibold mb-3">Follow {finalist.stageName}</h3>
              <div className="flex gap-3">
                {finalist.socialMedia.instagram && (
                  <a
                    href={finalist.socialMedia.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
                  >
                    <Instagram className="w-5 h-5 text-white" />
                  </a>
                )}
                {finalist.socialMedia.twitter && (
                  <a
                    href={finalist.socialMedia.twitter}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
                  >
                    <Twitter className="w-5 h-5 text-white" />
                  </a>
                )}
                {finalist.socialMedia.youtube && (
                  <a
                    href={finalist.socialMedia.youtube}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
                  >
                    <Youtube className="w-5 h-5 text-white" />
                  </a>
                )}
                {finalist.socialMedia.spotify && (
                  <a
                    href={finalist.socialMedia.spotify}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
                  >
                    <Music className="w-5 h-5 text-white" />
                  </a>
                )}
              </div>
            </div>
          )}

          {/* Performance Video */}
          {finalist.videoUrl && (
            <div>
              <h3 className="text-white font-semibold mb-3">Performance</h3>
              <a
                href={finalist.videoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 p-4 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
              >
                <Youtube className="w-5 h-5 text-white" />
                <span className="text-white">Watch Performance</span>
                <ExternalLink className="w-4 h-4 text-white/60 ml-auto" />
              </a>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="p-4 bg-red-500/20 border border-red-500/30 rounded-lg">
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}

          {/* Vote Button */}
          <button
            onClick={handleVote}
            disabled={isSubmitting || hasAlreadyVoted || !isVotingActive}
            className={`w-full py-4 rounded-lg font-bold text-lg transition-all duration-200 flex items-center justify-center gap-2 ${
              hasAlreadyVoted
                ? 'bg-lime-400/20 text-lime-400 cursor-not-allowed'
                : !isVotingActive
                ? 'bg-white/5 text-white/40 cursor-not-allowed'
                : isSubmitting
                ? 'bg-lime-400/50 text-black cursor-wait'
                : 'bg-lime-400 text-black hover:bg-lime-300 hover:scale-105'
            }`}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Submitting Vote...
              </>
            ) : hasAlreadyVoted ? (
              <>
                Vote Already Cast
              </>
            ) : !isVotingActive ? (
              'Voting Has Ended'
            ) : (
              <>
                <ThumbsUp className="w-5 h-5" />
                Vote for {finalist.stageName}
              </>
            )}
          </button>

          {hasAlreadyVoted && (
            <p className="text-white/60 text-sm text-center">
              You've already voted. You can only vote once per device.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}