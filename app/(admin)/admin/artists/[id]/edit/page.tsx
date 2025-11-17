'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/utils/supabase/client'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { toast } from 'sonner'
import { ArrowLeft, Loader2, Trash2 } from 'lucide-react'
import Link from 'next/link'
import { use } from 'react'

export default function EditArtistPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(true)
  const [deleting, setDeleting] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    stage_name: '',
    slug: '',
    bio: '',
    genre: '',
    image_url: '',
    cover_image_url: '',
    featured: false,
    social_media: {
      instagram: '',
      twitter: '',
      facebook: '',
      youtube: '',
      spotify: '',
    },
  })

  useEffect(() => {
    fetchArtist()
  }, [id])

  const fetchArtist = async () => {
    try {
      const supabase = createClient()
      const { data, error } = await supabase
        .from('artists')
        .select('*')
        .eq('id', id)
        .single()

      if (error) throw error

      const genreString = Array.isArray(data.genre) ? data.genre.join(', ') : ''

      setFormData({
        name: data.name || '',
        stage_name: data.stage_name || '',
        slug: data.slug || '',
        bio: data.bio || '',
        genre: genreString,
        image_url: data.image_url || '',
        cover_image_url: data.cover_image_url || '',
        featured: data.featured || false,
        social_media: data.social_media || {
          instagram: '',
          twitter: '',
          facebook: '',
          youtube: '',
          spotify: '',
        },
      })
    } catch (error: any) {
      console.error('Error fetching artist:', error)
      toast.error('Failed to load artist')
      router.push('/admin/artists')
    } finally {
      setFetching(false)
    }
  }

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleSocialMediaChange = (platform: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      social_media: {
        ...prev.social_media,
        [platform]: value,
      },
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const supabase = createClient()

      // Prepare genre array
      const genreArray = formData.genre
        .split(',')
        .map(g => g.trim())
        .filter(g => g.length > 0)

      const { error } = await supabase
        .from('artists')
        .update({
          name: formData.name,
          stage_name: formData.stage_name || formData.name,
          slug: formData.slug,
          bio: formData.bio,
          genre: genreArray,
          image_url: formData.image_url,
          cover_image_url: formData.cover_image_url,
          social_media: formData.social_media,
          featured: formData.featured,
        })
        .eq('id', id)

      if (error) throw error

      toast.success('Artist updated successfully!')
      router.push('/admin/artists')
    } catch (error: any) {
      console.error('Error updating artist:', error)
      toast.error(error.message || 'Failed to update artist')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this artist? This action cannot be undone.')) {
      return
    }

    setDeleting(true)

    try {
      const supabase = createClient()
      const { error } = await supabase
        .from('artists')
        .delete()
        .eq('id', id)

      if (error) throw error

      toast.success('Artist deleted successfully!')
      router.push('/admin/artists')
    } catch (error: any) {
      console.error('Error deleting artist:', error)
      toast.error(error.message || 'Failed to delete artist')
      setDeleting(false)
    }
  }

  if (fetching) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-6 flex items-center justify-between">
        <Link href="/admin/artists">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Artists
          </Button>
        </Link>
        
        <Button
          variant="destructive"
          size="sm"
          onClick={handleDelete}
          disabled={deleting}
        >
          {deleting ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Trash2 className="mr-2 h-4 w-4" />
          )}
          Delete Artist
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Edit Artist</CardTitle>
          <CardDescription>Update artist information</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Basic Information</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    placeholder="John Doe"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="stage_name">Stage Name</Label>
                  <Input
                    id="stage_name"
                    value={formData.stage_name}
                    onChange={(e) => handleInputChange('stage_name', e.target.value)}
                    placeholder="DJ Johnny"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="slug">URL Slug *</Label>
                <Input
                  id="slug"
                  value={formData.slug}
                  onChange={(e) => handleInputChange('slug', e.target.value)}
                  placeholder="john-doe"
                  required
                />
                <p className="text-xs text-muted-foreground">
                  This will be used in the URL: /artists/{formData.slug || 'your-slug'}
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="genre">Genres</Label>
                <Input
                  id="genre"
                  value={formData.genre}
                  onChange={(e) => handleInputChange('genre', e.target.value)}
                  placeholder="Afrobeat, Hip Hop, R&B (comma-separated)"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="bio">Biography</Label>
                <Textarea
                  id="bio"
                  value={formData.bio}
                  onChange={(e) => handleInputChange('bio', e.target.value)}
                  placeholder="Tell us about the artist..."
                  rows={5}
                />
              </div>
            </div>

            {/* Images */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Images</h3>
              
              <div className="space-y-2">
                <Label htmlFor="image_url">Profile Image URL</Label>
                <Input
                  id="image_url"
                  value={formData.image_url}
                  onChange={(e) => handleInputChange('image_url', e.target.value)}
                  placeholder="https://example.com/image.jpg"
                  type="url"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="cover_image_url">Cover Image URL</Label>
                <Input
                  id="cover_image_url"
                  value={formData.cover_image_url}
                  onChange={(e) => handleInputChange('cover_image_url', e.target.value)}
                  placeholder="https://example.com/cover.jpg"
                  type="url"
                />
              </div>
            </div>

            {/* Social Media */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Social Media</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="instagram">Instagram</Label>
                  <Input
                    id="instagram"
                    value={formData.social_media.instagram}
                    onChange={(e) => handleSocialMediaChange('instagram', e.target.value)}
                    placeholder="@username"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="twitter">Twitter</Label>
                  <Input
                    id="twitter"
                    value={formData.social_media.twitter}
                    onChange={(e) => handleSocialMediaChange('twitter', e.target.value)}
                    placeholder="@username"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="facebook">Facebook</Label>
                  <Input
                    id="facebook"
                    value={formData.social_media.facebook}
                    onChange={(e) => handleSocialMediaChange('facebook', e.target.value)}
                    placeholder="facebook.com/username"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="youtube">YouTube</Label>
                  <Input
                    id="youtube"
                    value={formData.social_media.youtube}
                    onChange={(e) => handleSocialMediaChange('youtube', e.target.value)}
                    placeholder="youtube.com/@username"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="spotify">Spotify</Label>
                  <Input
                    id="spotify"
                    value={formData.social_media.spotify}
                    onChange={(e) => handleSocialMediaChange('spotify', e.target.value)}
                    placeholder="spotify artist URL"
                  />
                </div>
              </div>
            </div>

            {/* Options */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Options</h3>
              
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="featured"
                  checked={formData.featured}
                  onChange={(e) => handleInputChange('featured', e.target.checked)}
                  className="rounded border-gray-300"
                />
                <Label htmlFor="featured" className="cursor-pointer">
                  Feature this artist on homepage
                </Label>
              </div>
            </div>

            {/* Submit */}
            <div className="flex justify-end gap-4 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
                disabled={loading}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={loading}>
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Update Artist
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}