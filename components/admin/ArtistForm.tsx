"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";

interface ArtistFormProps {
  artist?: any;
}

export function ArtistForm({ artist }: ArtistFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: artist?.name || '',
    stage_name: artist?.stage_name || '',
    slug: artist?.slug || '',
    bio: artist?.bio || '',
    genre: Array.isArray(artist?.genre) ? artist.genre.join(', ') : '',
    image_url: artist?.image_url || '',
    cover_image_url: artist?.cover_image_url || '',
    featured: artist?.featured || false,
    social_media: {
      instagram: artist?.social_media?.instagram || '',
      twitter: artist?.social_media?.twitter || '',
      facebook: artist?.social_media?.facebook || '',
      youtube: artist?.social_media?.youtube || '',
      spotify: artist?.social_media?.spotify || '',
      appleMusic: artist?.social_media?.appleMusic || '',
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const url = artist 
        ? `/api/admin/artists/${artist.id}` 
        : '/api/admin/artists';
      
      const method = artist ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          genre: formData.genre.split(',').map((g: string) => g.trim()).filter(Boolean),
        }),
      });

      if (response.ok) {
        toast.success(artist ? 'Artist updated' : 'Artist created');
        router.push('/admin/artists');
        router.refresh();
      } else {
        throw new Error('Failed to save artist');
      }
    } catch (error) {
      toast.error('Failed to save artist');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">Basic Information</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="name">Full Name *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>

          <div>
            <Label htmlFor="stage_name">Stage Name *</Label>
            <Input
              id="stage_name"
              value={formData.stage_name}
              onChange={(e) => setFormData({ ...formData, stage_name: e.target.value })}
              required
            />
          </div>

          <div>
            <Label htmlFor="slug">Slug (URL) *</Label>
            <Input
              id="slug"
              value={formData.slug}
              onChange={(e) => setFormData({ ...formData, slug: e.target.value.toLowerCase().replace(/\s+/g, '-') })}
              placeholder="artist-name"
              required
            />
          </div>

          <div>
            <Label htmlFor="genre">Genres (comma-separated)</Label>
            <Input
              id="genre"
              value={formData.genre}
              onChange={(e) => setFormData({ ...formData, genre: e.target.value })}
              placeholder="Afrobeat, Hip-hop, R&B"
            />
          </div>

          <div className="md:col-span-2">
            <Label htmlFor="bio">Biography</Label>
            <Textarea
              id="bio"
              value={formData.bio}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              rows={4}
            />
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">Images</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="image_url">Profile Image URL</Label>
            <Input
              id="image_url"
              value={formData.image_url}
              onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
              placeholder="https://..."
            />
          </div>

          <div>
            <Label htmlFor="cover_image_url">Cover Image URL</Label>
            <Input
              id="cover_image_url"
              value={formData.cover_image_url}
              onChange={(e) => setFormData({ ...formData, cover_image_url: e.target.value })}
              placeholder="https://..."
            />
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">Social Media</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="instagram">Instagram</Label>
            <Input
              id="instagram"
              value={formData.social_media.instagram}
              onChange={(e) => setFormData({ 
                ...formData, 
                social_media: { ...formData.social_media, instagram: e.target.value }
              })}
              placeholder="https://instagram.com/..."
            />
          </div>

          <div>
            <Label htmlFor="twitter">Twitter</Label>
            <Input
              id="twitter"
              value={formData.social_media.twitter}
              onChange={(e) => setFormData({ 
                ...formData, 
                social_media: { ...formData.social_media, twitter: e.target.value }
              })}
              placeholder="https://twitter.com/..."
            />
          </div>

          <div>
            <Label htmlFor="spotify">Spotify</Label>
            <Input
              id="spotify"
              value={formData.social_media.spotify}
              onChange={(e) => setFormData({ 
                ...formData, 
                social_media: { ...formData.social_media, spotify: e.target.value }
              })}
              placeholder="https://open.spotify.com/..."
            />
          </div>

          <div>
            <Label htmlFor="appleMusic">Apple Music</Label>
            <Input
              id="appleMusic"
              value={formData.social_media.appleMusic}
              onChange={(e) => setFormData({ 
                ...formData, 
                social_media: { ...formData.social_media, appleMusic: e.target.value }
              })}
              placeholder="https://music.apple.com/..."
            />
          </div>

          <div>
            <Label htmlFor="youtube">YouTube</Label>
            <Input
              id="youtube"
              value={formData.social_media.youtube}
              onChange={(e) => setFormData({ 
                ...formData, 
                social_media: { ...formData.social_media, youtube: e.target.value }
              })}
              placeholder="https://youtube.com/..."
            />
          </div>

          <div>
            <Label htmlFor="facebook">Facebook</Label>
            <Input
              id="facebook"
              value={formData.social_media.facebook}
              onChange={(e) => setFormData({ 
                ...formData, 
                social_media: { ...formData.social_media, facebook: e.target.value }
              })}
              placeholder="https://facebook.com/..."
            />
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <Label htmlFor="featured">Featured Artist</Label>
            <p className="text-sm text-muted-foreground">
              Featured artists appear prominently on the homepage
            </p>
          </div>
          <Switch
            id="featured"
            checked={formData.featured}
            onCheckedChange={(checked) => setFormData({ ...formData, featured: checked })}
          />
        </div>
      </Card>

      <div className="flex gap-4">
        <Button type="submit" disabled={loading}>
          {loading ? 'Saving...' : artist ? 'Update Artist' : 'Create Artist'}
        </Button>
        <Button type="button" variant="outline" onClick={() => router.back()}>
          Cancel
        </Button>
      </div>
    </form>
  );
}