"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  ArrowLeft,
  Trophy,
  TrendingUp,
  Instagram,
  Twitter,
  Music,
  Youtube,
  Play,
} from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import { useCart } from "@/features/pilot-voting/context/cart-context";
import { useVotePackages } from "@/features/pilot-voting/hooks/use-vote-packages";
import { VotePackageCard } from "@/features/pilot-voting/components/vote-package-card";
import type { PilotArtist, VotePackage, CartItem } from "@/features/pilot-voting/types/voting.types";

export default function PilotArtistDetailPage() {
  const params = useParams();
  const slug = params.slug as string;

  const [artist, setArtist] = useState<PilotArtist | null>(null);
  const [loading, setLoading] = useState(true);
  const [showPackageDialog, setShowPackageDialog] = useState(false);

  const { packages } = useVotePackages();
  const { addItem } = useCart();

  useEffect(() => {
    async function fetchArtist() {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("pilot_artists")
        .select("*")
        .eq("slug", slug)
        .single();

      if (error) {
        console.error("Error fetching artist:", error);
        setLoading(false);
        return;
      }

      if (data) {
        setArtist({
          id: data.id,
          name: data.name,
          slug: data.slug,
          stageName: data.stage_name,
          bio: data.bio || "",
          genre: data.genre || [],
          image: data.image,
          coverImage: data.cover_image,
          performanceVideo: data.performance_video,
          socialMedia: data.social_media || {},
          totalVotes: data.total_votes || 0,
          rank: data.rank || 0,
          createdAt: data.created_at,
          updatedAt: data.updated_at,
        });
      }

      setLoading(false);
    }

    fetchArtist();
  }, [slug]);

  const handleSelectPackage = (pkg: VotePackage) => {
    if (!artist) return;

    const cartItem: CartItem = {
      id: `${artist.id}-${pkg.id}-${Date.now()}`,
      artistId: artist.id,
      artistName: artist.stageName,
      artistImage: artist.image,
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
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="text-center">Loading...</div>
      </div>
    );
  }

  if (!artist) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="text-center space-y-4">
          <h1 className="text-2xl font-bold">Artist Not Found</h1>
          <Link href="/pilot-voting">
            <Button>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Voting
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const socialLinks = [
    {
      name: "Instagram",
      url: artist.socialMedia.instagram,
      icon: Instagram,
    },
    {
      name: "Twitter",
      url: artist.socialMedia.twitter,
      icon: Twitter,
    },
    {
      name: "Spotify",
      url: artist.socialMedia.spotify,
      icon: Music,
    },
    {
      name: "YouTube",
      url: artist.socialMedia.youtube,
      icon: Youtube,
    },
  ].filter((link) => link.url);

  return (
    <div className="container mx-auto px-4 py-12 space-y-8">
      {/* Back Button */}
      <Link href="/pilot-voting">
        <Button variant="ghost">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to All Artists
        </Button>
      </Link>

      {/* Cover Image */}
      {artist.coverImage && (
        <div className="relative h-64 md:h-80 rounded-lg overflow-hidden">
          <Image
            src={artist.coverImage}
            alt={artist.stageName}
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent" />
        </div>
      )}

      {/* Artist Profile */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-start gap-6">
            <div className="relative h-32 w-32 rounded-full overflow-hidden shrink-0">
              <Image
                src={artist.image}
                alt={artist.stageName}
                fill
                className="object-cover"
              />
            </div>

            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                {artist.rank <= 3 && (
                  <Badge className="bg-yellow-500 text-black">
                    <Trophy className="h-3 w-3 mr-1" />
                    Rank #{artist.rank}
                  </Badge>
                )}
                {artist.rank > 3 && (
                  <Badge variant="secondary">Rank #{artist.rank}</Badge>
                )}
              </div>

              <h1 className="text-4xl font-bold mb-2">{artist.stageName}</h1>
              <p className="text-xl text-muted-foreground mb-4">{artist.name}</p>

              <div className="flex flex-wrap gap-2 mb-4">
                {artist.genre.map((genre) => (
                  <Badge key={genre} variant="outline">
                    {genre}
                  </Badge>
                ))}
              </div>

              <div className="flex items-center gap-2 text-primary">
                <TrendingUp className="h-5 w-5" />
                <span className="text-lg font-semibold">
                  {artist.totalVotes.toLocaleString()} votes
                </span>
              </div>
            </div>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>About {artist.stageName}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed">{artist.bio}</p>
            </CardContent>
          </Card>

          {artist.performanceVideo && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Play className="h-5 w-5" />
                  Performance Video
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
                  <p className="text-muted-foreground">Video player would go here</p>
                  <a
                    href={artist.performanceVideo}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="ml-2 text-primary hover:underline"
                  >
                    Watch on YouTube
                  </a>
                </div>
              </CardContent>
            </Card>
          )}

          {socialLinks.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Connect with {artist.stageName}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {socialLinks.map((link) => {
                    const Icon = link.icon;
                    return (
                      <Button
                        key={link.name}
                        variant="outline"
                        asChild
                      >
                        <a
                          href={link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <Icon className="h-4 w-4 mr-2" />
                          {link.name}
                        </a>
                      </Button>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Voting Sidebar */}
        <div className="space-y-4">
          <Card className="sticky top-4">
            <CardHeader>
              <CardTitle>Support {artist.stageName}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center p-4 bg-accent rounded-lg">
                <div className="text-sm text-muted-foreground mb-1">Current Rank</div>
                <div className="text-4xl font-bold">#{artist.rank}</div>
              </div>

              <div className="text-center p-4 bg-accent rounded-lg">
                <div className="text-sm text-muted-foreground mb-1">Total Votes</div>
                <div className="text-2xl font-bold">
                  {artist.totalVotes.toLocaleString()}
                </div>
              </div>

              <Button
                className="w-full"
                size="lg"
                onClick={() => setShowPackageDialog(true)}
              >
                Vote for {artist.stageName}
              </Button>

              <p className="text-xs text-muted-foreground text-center">
                Help {artist.stageName} secure a spot in the pilot event by purchasing votes
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Package Selection Dialog */}
      <Dialog open={showPackageDialog} onOpenChange={setShowPackageDialog}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Select Vote Package for {artist.stageName}</DialogTitle>
            <DialogDescription>
              Choose how many votes you want to purchase
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