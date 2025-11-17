import { createClient } from "@/utils/supabase/server";
import { ArtistCard } from "@/components/artists/ArtistCard";
import { PageHero } from "@/components/layout/page-hero";

export default async function ArtistsPage() {
  const supabase = await createClient();
  
  const { data: artists, error } = await supabase
    .from('artists')
    .select('*')
    .order('featured', { ascending: false })
    .order('name');

  if (error) {
    console.error('Error fetching artists:', error);
  }

  return (
    <div className="min-h-screen">
      <PageHero
        title="Our Artists"
        description="Meet the talented artists bringing African music to life"
        badge="Artists"
      />

      <section className="container-wide py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {artists?.map((artist) => (
            <ArtistCard key={artist.id} artist={artist} />
          ))}
        </div>

        {!artists?.length && (
          <div className="text-center py-16">
            <p className="text-muted-foreground">No artists found</p>
          </div>
        )}
      </section>
    </div>
  );
}