import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

export const dynamic = 'force-dynamic';
export const revalidate = 3600; // Cache for 1 hour

export async function GET() {
  try {
    const supabase = await createClient();

    // Get the public URL for the storage bucket
    const bucketName = 'public site photos';

    // List all files in the bucket
    const { data: files, error: listError } = await supabase
      .storage
      .from(bucketName)
      .list('', {
        limit: 100,
        offset: 0,
        sortBy: { column: 'name', order: 'asc' }
      });

    if (listError) {
      console.error('Error listing files:', listError);
      return NextResponse.json(
        { error: 'Failed to fetch carousel images' },
        { status: 500 }
      );
    }

    // Filter for carousel slides only (slide-1 through slide-10)
    const slideFiles = files?.filter(file =>
      file.name.match(/^slide-\d+\.(webp|jpg|jpeg|png|avif)$/i)
    ) || [];

    // Generate public URLs for each file
    const slides = slideFiles.map((file) => {
      const { data } = supabase
        .storage
        .from(bucketName)
        .getPublicUrl(file.name);

      // Extract slide number from filename
      const slideNumber = parseInt(file.name.match(/slide-(\d+)/)?.[1] || '0');

      return {
        id: slideNumber,
        image: data.publicUrl,
        title: getSlideTitle(slideNumber),
        description: getSlideDescription(slideNumber)
      };
    }).sort((a, b) => a.id - b.id);

    return NextResponse.json({ slides }, {
      headers: {
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=7200'
      }
    });
  } catch (error) {
    console.error('Error fetching carousel images:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Helper functions to get slide titles and descriptions
function getSlideTitle(slideNumber: number): string {
  const titles: Record<number, string> = {
    1: 'Afromerica Entertainment',
    2: 'December Showcase 2025',
    3: 'Experience Live Music',
    4: 'Discover New Talent',
    5: 'Cultural Excellence',
    6: 'Join the Community',
    7: 'Premium Events',
    8: 'Celebrate African Culture',
    9: 'Connect with Artists',
    10: 'Unforgettable Experiences'
  };

  return titles[slideNumber] || 'Afromerica Entertainment';
}

function getSlideDescription(slideNumber: number): string {
  const descriptions: Record<number, string> = {
    1: 'Bringing African culture to the world',
    2: 'Vote for your favorite artist and win amazing prizes',
    3: 'Book tickets to exclusive events',
    4: 'Support emerging African artists',
    5: 'Showcasing the best of African entertainment',
    6: 'Be part of something special',
    7: 'Exclusive access to top-tier performances',
    8: 'Experience the richness of African heritage',
    9: 'Meet and support talented performers',
    10: 'Creating memories that last forever'
  };

  return descriptions[slideNumber] || 'Bringing African culture to the world';
}
