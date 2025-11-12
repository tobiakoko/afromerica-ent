import { createClient } from "@/utils/supabase/server";
import type {
  PilotArtist,
  VotePackage,
  VotePurchase,
  PilotVotingStats,
  LeaderboardEntry,
  VoteHistoryItem,
} from "../types/voting.types";
 
// Get all pilot artists with optional sorting
export async function getPilotArtists(
  sortBy: "rank" | "votes" | "name" = "rank",
  order: "asc" | "desc" = "asc"
): Promise<PilotArtist[]> {
  const supabase = await createClient();
 
  let query = supabase
    .from("pilot_artists")
    .select("*");
 
  // Apply sorting
  if (sortBy === "rank") {
    query = query.order("rank", { ascending: order === "asc" });
  } else if (sortBy === "votes") {
    query = query.order("total_votes", { ascending: order === "asc" });
  } else if (sortBy === "name") {
    query = query.order("name", { ascending: order === "asc" });
  }
 
  const { data, error } = await query;
 
  if (error) {
    console.error("Error fetching pilot artists:", error);
    return [];
  }
 
  return (data || []).map(artist => ({
    id: artist.id,
    name: artist.name,
    slug: artist.slug,
    stageName: artist.stage_name,
    bio: artist.bio || "",
    genre: artist.genre || [],
    image: artist.image,
    coverImage: artist.cover_image,
    performanceVideo: artist.performance_video,
    socialMedia: artist.social_media || {},
    totalVotes: artist.total_votes || 0,
    rank: artist.rank || 0,
    createdAt: artist.created_at,
    updatedAt: artist.updated_at,
  }));
}
 
// Get single pilot artist by slug
export async function getPilotArtistBySlug(slug: string): Promise<PilotArtist | null> {
  const supabase = await createClient();
 
  const { data, error } = await supabase
    .from("pilot_artists")
    .select("*")
    .eq("slug", slug)
    .single();
 
  if (error) {
    console.error("Error fetching pilot artist:", error);
    return null;
  }
 
  if (!data) return null;
 
  return {
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
  };
}
 
// Get leaderboard
export async function getLeaderboard(limit: number = 10): Promise<LeaderboardEntry[]> {
  const artists = await getPilotArtists("rank", "asc");
  const topArtists = artists.slice(0, limit);
 
  const totalVotes = artists.reduce((sum, artist) => sum + artist.totalVotes, 0);
 
  return topArtists.map((artist, index) => ({
    artist,
    votes: artist.totalVotes,
    rank: artist.rank,
    percentageOfTotal: totalVotes > 0 ? (artist.totalVotes / totalVotes) * 100 : 0,
    isLeading: index === 0,
  }));
}
 
// Get vote packages
export async function getVotePackages(): Promise<VotePackage[]> {
  const supabase = await createClient();
 
  const { data, error } = await supabase
    .from("vote_packages")
    .select("*")
    .eq("active", true)
    .order("votes", { ascending: true });
 
  if (error) {
    console.error("Error fetching vote packages:", error);
    return [];
  }
 
  return (data || []).map(pkg => ({
    id: pkg.id,
    name: pkg.name,
    votes: pkg.votes,
    price: parseFloat(pkg.price),
    currency: pkg.currency,
    discount: pkg.discount ? parseFloat(pkg.discount) : undefined,
    popular: pkg.popular || false,
    savings: pkg.savings ? parseFloat(pkg.savings) : undefined,
  }));
}
 
// Get voting statistics
export async function getVotingStats(): Promise<PilotVotingStats | null> {
  const supabase = await createClient();
 
  // Get voting config
  const { data: config } = await supabase
    .from("voting_config")
    .select("*")
    .single();
 
  if (!config) return null;
 
  // Get artists for stats
  const artists = await getPilotArtists("rank", "asc");
 
  // Get total revenue from completed purchases
  const { data: purchases } = await supabase
    .from("vote_purchases")
    .select("total_amount, email")
    .eq("payment_status", "completed");
 
  const totalVotes = artists.reduce((sum, artist) => sum + artist.totalVotes, 0);
  const totalRevenue = (purchases || []).reduce((sum, p) => sum + parseFloat(p.total_amount), 0);
  const uniqueVoters = new Set((purchases || []).map(p => p.email)).size;
 
  const topArtist = artists[0] || { id: "", name: "", totalVotes: 0 };
 
  // Calculate time remaining
  const votingEndsAt = new Date(config.voting_ends_at);
  const now = new Date();
  const diffMs = votingEndsAt.getTime() - now.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const diffHours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
 
  let timeRemaining = "";
  if (diffDays > 0) {
    timeRemaining = `${diffDays} day${diffDays > 1 ? 's' : ''} ${diffHours} hour${diffHours > 1 ? 's' : ''}`;
  } else if (diffHours > 0) {
    timeRemaining = `${diffHours} hour${diffHours > 1 ? 's' : ''}`;
  } else {
    timeRemaining = "Ending soon";
  }
 
  return {
    totalVotes,
    totalRevenue,
    uniqueVoters,
    votingEndsAt: config.voting_ends_at,
    isVotingActive: config.is_voting_active && diffMs > 0,
    timeRemaining,
    topArtist: {
      id: topArtist.id,
      name: topArtist.stageName || topArtist.name,
      votes: topArtist.totalVotes,
    },
  };
}
 
// Create vote purchase
export async function createVotePurchase(
  purchase: Omit<VotePurchase, "id" | "purchasedAt" | "createdAt" | "updatedAt">
): Promise<{ success: boolean; purchaseId?: string; error?: string }> {
  const supabase = await createClient();
 
  const { data, error } = await supabase
    .from("vote_purchases")
    .insert({
      user_id: purchase.userId,
      email: purchase.email,
      items: purchase.items,
      total_votes: purchase.totalVotes,
      total_amount: purchase.totalAmount,
      currency: purchase.currency,
      payment_status: purchase.paymentStatus,
      payment_reference: purchase.paymentReference,
      payment_method: purchase.paymentMethod,
    })
    .select()
    .single();
 
  if (error) {
    console.error("Error creating vote purchase:", error);
    return { success: false, error: error.message };
  }
 
  return { success: true, purchaseId: data.id };
}
 
// Update purchase status
export async function updatePurchaseStatus(
  purchaseId: string,
  status: "completed" | "failed"
): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient();
 
  const { error } = await supabase
    .from("vote_purchases")
    .update({ payment_status: status })
    .eq("id", purchaseId);
 
  if (error) {
    console.error("Error updating purchase status:", error);
    return { success: false, error: error.message };
  }
 
  // If purchase completed, apply votes to artists
  if (status === "completed") {
    const { data: purchase } = await supabase
      .from("vote_purchases")
      .select("items")
      .eq("id", purchaseId)
      .single();
 
    if (purchase && purchase.items) {
      const items = purchase.items as any[];
      for (const item of items) {
        await supabase.rpc("apply_votes_to_artist", {
          artist_id: item.artistId,
          vote_count: item.totalVotes,
        });
      }
    }
  }
 
  return { success: true };
}
 
// Get user's vote history
export async function getUserVoteHistory(userId?: string, email?: string): Promise<VoteHistoryItem[]> {
  if (!userId && !email) return [];
 
  const supabase = await createClient();
 
  let query = supabase
    .from("vote_purchases")
    .select("*")
    .order("created_at", { ascending: false });
 
  if (userId) {
    query = query.eq("user_id", userId);
  } else if (email) {
    query = query.eq("email", email);
  }
 
  const { data, error } = await query;
 
  if (error) {
    console.error("Error fetching vote history:", error);
    return [];
  }
 
  return (data || []).map(purchase => {
    const items = purchase.items as any[];
    const artistNames = items.map(item => item.artistName).join(", ");
 
    return {
      id: purchase.id,
      artistName: artistNames,
      votes: purchase.total_votes,
      amount: parseFloat(purchase.total_amount),
      purchasedAt: purchase.purchased_at || purchase.created_at,
      status: purchase.payment_status as "completed" | "pending" | "failed",
    };
  });
}