import { createClient } from "@/utils/supabase/server";
import { notFound } from "next/navigation";
import { CheckoutForm } from "@/components/forms/CheckoutForm";

export default async function CheckoutPage({ params }: { params: { slug: string } }) {
  const supabase = await createClient();
  
  const { data: event, error } = await supabase
    .from('events')
    .select(`
      *,
      ticket_types (*)
    `)
    .eq('slug', params.slug)
    .single();

  if (error || !event) {
    notFound();
  }

  return (
    <div className="min-h-screen py-12">
      <div className="container-wide max-w-2xl">
        <h1 className="text-3xl font-bold mb-8">Checkout</h1>
        <CheckoutForm event={event} ticketTypes={event.ticket_types || []} />
      </div>
    </div>
  );
}