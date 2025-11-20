"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Pencil, Trash } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface ArtistTableProps {
  artists: any[];
}

export function ArtistTable({ artists }: ArtistTableProps) {
  const router = useRouter();
  const [loading, setLoading] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this artist?')) return;
    
    setLoading(id);
    try {
      const response = await fetch(`/api/admin/artists/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        toast.success('Artist deleted successfully');
        router.refresh();
      } else {
        throw new Error('Failed to delete artist');
      }
    } catch (error) {
      toast.error('Failed to delete artist');
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="border rounded-lg">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Artist</TableHead>
            <TableHead>Stage Name</TableHead>
            <TableHead>Genre</TableHead>
            <TableHead>Featured</TableHead>
            <TableHead>Created</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {artists.map((artist) => (
            <TableRow key={artist.id}>
              <TableCell>
                <div className="flex items-center gap-3">
                  <div className="relative w-10 h-10 rounded-full overflow-hidden">
                    <Image
                      src={artist.image_url || '/images/default-artist.svg'}
                      alt={artist.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <span className="font-medium">{artist.name}</span>
                </div>
              </TableCell>
              <TableCell>{artist.stage_name || '-'}</TableCell>
              <TableCell>
                {Array.isArray(artist.genre) ? artist.genre.join(', ') : '-'}
              </TableCell>
              <TableCell>
                {artist.featured ? (
                  <span className="px-2 py-1 bg-primary/10 text-primary rounded text-xs">
                    Featured
                  </span>
                ) : (
                  '-'
                )}
              </TableCell>
              <TableCell>
                {new Date(artist.created_at).toLocaleDateString()}
              </TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <MoreHorizontal className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem asChild>
                      <Link href={`/admin/artists/${artist.id}/edit`}>
                        <Pencil className="w-4 h-4 mr-2" />
                        Edit
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => handleDelete(artist.id)}
                      disabled={loading === artist.id}
                      className="text-destructive"
                    >
                      <Trash className="w-4 h-4 mr-2" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {artists.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No artists found</p>
        </div>
      )}
    </div>
  );
}
