"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ShoppingCart, Trophy, Vote, Info } from "lucide-react";
import { usePilotArtists } from "@/features/pilot-voting/hooks/use-pilot-artists";
import { useVotePackages } from "@/features/pilot-voting/hooks/use-vote-packages";
import { useVotingStats } from "@/features/pilot-voting/hooks/use-voting-stats";
import { useCart } from "@/features/pilot-voting/context/cart-context";
import { PilotArtistCard } from "@/features/pilot-voting/components/pilot-artist-card";
import { VotePackageCard } from "@/features/pilot-voting/components/vote-package-card";
import { Leaderboard } from "@/features/pilot-voting/components/leaderboard";
import { VotingStats } from "@/features/pilot-voting/components/voting-stats";
import type { PilotArtist, VotePackage, CartItem } from "@/features/pilot-voting/types/voting.types";

export default function PilotVotingPage() {
  const { artists, loading: artistsLoading } = usePilotArtists({ sortBy: "rank", order: "asc" });
  const { packages, loading: packagesLoading } = useVotePackages();
  const { stats, loading: statsLoading } = useVotingStats();
  const { cart, addItem } = useCart();

  const [selectedArtist, setSelectedArtist] = useState<PilotArtist | null>(null);
  const [showPackageDialog, setShowPackageDialog] = useState(false);

  const handleVote = (artist: PilotArtist) => {
    setSelectedArtist(artist);
    setShowPackageDialog(true);
  };

  const handleSelectPackage = (pkg: VotePackage) => {
    if (!selectedArtist) return;

    const cartItem: CartItem = {
      id: `${selectedArtist.id}-${pkg.id}-${Date.now()}`,
      artistId: selectedArtist.id,
      artistName: selectedArtist.stageName,
      artistImage: selectedArtist.image,
      packageId: pkg.id,
      packageName: pkg.name,
      votes: pkg.votes,
      pricePerPackage: pkg.price,
      quantity: 1,
      totalVotes: pkg.votes,
      totalPrice: pkg.price,
    };

    addItem(cartItem);
    setShowPackageDialog(false);
    setSelectedArtist(null);
  };

  if (artistsLoading || packagesLoading || statsLoading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="text-center">Loading...</div>
      </div>
    );
  }

  if (!stats?.isVotingActive) {
    return (
      <div className="container mx-auto px-4 py-12">
        <Alert>
          <Info className="h-4 w-4" />
          <AlertDescription>
            Voting is currently closed. Check back later for the next voting period!
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12 space-y-12">
      {/* Header */}
      <div className="text-center space-y-4">
        <Badge className="mb-2" variant="secondary">
          <Vote className="h-3 w-3 mr-1" />
          Pilot Event Voting
        </Badge>
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
          Vote for Your Favorite Artist
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Support your favorite artists by purchasing votes. The top artists will be featured in our upcoming pilot event!
        </p>

        <div className="flex items-center justify-center gap-4">
          <Link href="/pilot-voting/cart">
            <Button size="lg" variant="outline" className="gap-2">
              <ShoppingCart className="h-4 w-4" />
              Cart ({cart.items.length})
              {cart.totalPrice > 0 && (
                <Badge variant="secondary">${cart.totalPrice.toFixed(2)}</Badge>
              )}
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats */}
      {stats && <VotingStats stats={stats} />}

      {/* Tabs */}
      <Tabs defaultValue="all" className="space-y-8">
        <TabsList className="grid w-full max-w-md mx-auto grid-cols-2">
          <TabsTrigger value="all">All Artists</TabsTrigger>
          <TabsTrigger value="leaderboard">
            <Trophy className="h-4 w-4 mr-2" />
            Leaderboard
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {artists.map((artist) => (
              <PilotArtistCard
                key={artist.id}
                artist={artist}
                onVote={handleVote}
              />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="leaderboard">
          <div className="max-w-3xl mx-auto">
            <Leaderboard artists={artists} limit={10} />
          </div>
        </TabsContent>
      </Tabs>

      {/* Package Selection Dialog */}
      <Dialog open={showPackageDialog} onOpenChange={setShowPackageDialog}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>
              Select Vote Package for {selectedArtist?.stageName}
            </DialogTitle>
            <DialogDescription>
              Choose how many votes you want to purchase for this artist
            </DialogDescription>
          </DialogHeader>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
            {packages.map((pkg) => (
              <VotePackageCard
                key={pkg.id}
                package={pkg}
                onSelect={handleSelectPackage}
              />
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
