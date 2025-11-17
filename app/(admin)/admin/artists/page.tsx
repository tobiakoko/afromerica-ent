import { createClient } from "@/utils/supabase/server";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";
import { ArtistTable } from "@/components/admin/ArtistTable";

export default async function AdminArtistsPage() {
  const supabase = await createClient();
  
  const { data: artists } = await supabase
    .from('artists')
    .select('*')
    .order('created_at', { ascending: false });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Artists</h1>
          <p className="text-muted-foreground">Manage your artist roster</p>
        </div>
        <Button asChild>
          <Link href="/admin/artists/new">
            <Plus className="w-4 h-4" />
            Add Artist
          </Link>
        </Button>
      </div>

      <ArtistTable artists={artists || []} />
    </div>
  );
}