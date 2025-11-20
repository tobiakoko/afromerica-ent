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
import { format } from "date-fns";
import { EVENT_STATUS, EVENT_STATUS_LABELS, DATE_FORMATS } from '@/lib/constants';

interface EventTableProps {
  events: any[];
}

export function EventTable({ events }: EventTableProps) {
  const router = useRouter();
  const [loading, setLoading] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this event?')) return;
    
    setLoading(id);
    try {
      const response = await fetch(`/api/admin/events/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        toast.success('Event deleted successfully');
        router.refresh();
      } else {
        throw new Error('Failed to delete event');
      }
    } catch (error) {
      toast.error('Failed to delete event');
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="border rounded-lg">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Event</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Tickets Sold</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {events.map((event) => (
            <TableRow key={event.id}>
              <TableCell>
                <div className="flex items-center gap-3">
                  <div className="relative w-12 h-12 rounded overflow-hidden">
                    <Image
                      src={event.image_url || '/images/default-event.svg'}
                      alt={event.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <p className="font-medium">{event.title}</p>
                    <p className="text-sm text-muted-foreground">{event.category}</p>
                  </div>
                </div>
              </TableCell>
              <TableCell>
                {format(new Date(event.date), DATE_FORMATS.SHORT)}
              </TableCell>
              <TableCell>
                <span className={`px-2 py-1 rounded text-xs font-semibold ${
                  event.status === EVENT_STATUS.UPCOMING ? 'bg-blue-100 text-blue-800' :
                  event.status === EVENT_STATUS.ONGOING ? 'bg-green-100 text-green-800' :
                  event.status === EVENT_STATUS.COMPLETED ? 'bg-gray-100 text-gray-800' :
                  event.status === EVENT_STATUS.SOLDOUT ? 'bg-red-100 text-red-800' :
                  'bg-yellow-100 text-yellow-800'
                }`}>
                  {EVENT_STATUS_LABELS[event.status as keyof typeof EVENT_STATUS_LABELS] || event.status}
                </span>
              </TableCell>
              <TableCell>
                {event.tickets_sold || 0} / {event.capacity || '∞'}
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
                      <Link href={`/admin/events/${event.id}/edit`}>
                        <Pencil className="w-4 h-4 mr-2" />
                        Edit
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => handleDelete(event.id)}
                      disabled={loading === event.id}
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

      {events.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No events found</p>
        </div>
      )}
    </div>
  );
}
