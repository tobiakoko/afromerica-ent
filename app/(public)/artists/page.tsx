import { createClient } from "@/utils/supabase/server";
import { ArtistCard } from "@/components/artists/ArtistCard";
import { PageHero } from "@/components/layout/page-hero";

export default async function ArtistsPage() {
  console.log('\n=== ARTISTS PAGE DEBUG ===\n\n');
  console.log('Supabase URL:', process.env.NEXT_PUBLIC_SUPABASE_URL);
  console.log('Has Anon Key:', !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
  console.log('\n');

  try {
    const supabase = await createClient();
    console.log('Supabase client created successfully');
    
    const { data: artists, error } = await supabase
    .from('artists')
    .select(`
      id,
      name,
      slug,
      stage_name,
      bio,
      genre,
      photo_url,
      rank,
      total_votes,
      featured,
      is_active
    `)
    .eq('is_active', true)
    .is('deleted_at', null)
    .order('rank', { ascending: true })
    .order('total_votes', { ascending: false });

    if (error) {
      console.error('Error fetching artists:', {
        message: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code,
      });
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
  } catch (error) {
    console.error('Unexpected error in ArtistsPage:', error);
    
    return (
      <div className="p-4">
        <h1 className="text-2xl font-bold text-red-600 mb-4">
          Unexpected Error
        </h1>
        <div className="bg-red-50 border border-red-200 rounded p-4">
          <pre className="text-sm">{error instanceof Error ? error.message : 'Unknown error'}</pre>
        </div>
      </div>
    );

  }
}