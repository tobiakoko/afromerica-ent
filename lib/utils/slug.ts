/**
 * Comprehensive slug generation utilities
 * Used for Artists, Events, and other content
 */

/**
 * Generate URL-safe slug from text
 * Handles special characters, spaces, and ensures uniqueness
 */
export function generateSlug(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    // Remove accents/diacritics
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    // Replace spaces and special chars with hyphens
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/**
 * Generate unique slug by appending number if slug exists
 */
export async function generateUniqueSlug(
  baseText: string,
  table: 'artists' | 'events' | 'pilot_artists',
  supabase: any,
  excludeId?: string
): Promise<string> {
  let slug = generateSlug(baseText);
  let counter = 1;
  let isUnique = false;

  while (!isUnique) {
    const query = supabase
      .from(table)
      .select('id')
      .eq('slug', slug)
      .limit(1);

    // Exclude current record if updating
    if (excludeId) {
      query.neq('id', excludeId);
    }

    const { data, error } = await query.single();

    if (error && error.code === 'PGRST116') {
      // No rows found - slug is unique
      isUnique = true;
    } else if (data) {
      // Slug exists, try with counter
      const baseSlug = generateSlug(baseText);
      slug = `${baseSlug}-${counter}`;
      counter++;
    } else {
      // Unexpected error
      console.error('Error checking slug uniqueness:', error);
      throw new Error('Failed to generate unique slug');
    }
  }

  return slug;
}

/**
 * Extract slug-safe string from email (for user profiles)
 */
export function slugFromEmail(email: string): string {
  const username = email.split('@')[0];
  return generateSlug(username);
}

/**
 * Generate event slug from title and date
 * Format: event-title-jan-2025
 */
export function generateEventSlug(title: string, date: Date): string {
  const baseSlug = generateSlug(title);
  const month = date.toLocaleDateString('en-US', { month: 'short' }).toLowerCase();
  const year = date.getFullYear();
  
  return `${baseSlug}-${month}-${year}`;
}

/**
 * Generate artist slug with optional genre
 * Format: artist-name or artist-name-genre
 */
export function generateArtistSlug(name: string, genre?: string): string {
  const baseSlug = generateSlug(name);
  
  if (genre) {
    const genreSlug = generateSlug(genre);
    return `${baseSlug}-${genreSlug}`;
  }
  
  return baseSlug;
}

/**
 * Validate slug format
 */
export function isValidSlug(slug: string): boolean {
  const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
  return slugRegex.test(slug);
}

/**
 * Sanitize slug input (for user-provided slugs)
 */
export function sanitizeSlug(slug: string): string {
  return generateSlug(slug);
}

/**
 * Extract readable title from slug
 */
export function titleFromSlug(slug: string): string {
  return slug
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

/**
 * Generate slug with timestamp (for guaranteed uniqueness)
 */
export function generateTimestampedSlug(text: string): string {
  const baseSlug = generateSlug(text);
  const timestamp = Date.now().toString(36); // Base36 for shorter string
  return `${baseSlug}-${timestamp}`;
}