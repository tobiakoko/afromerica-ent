import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import { createAdminClient } from "@/utils/supabase/admin";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { AdminHeader } from "@/components/admin/AdminHeader";

// Admin pages require authentication and must be dynamic
export const dynamic = 'force-dynamic';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/signin?redirect=/admin');
  }

  // Check if user is admin using admin client to bypass RLS
  const adminClient = createAdminClient();
  const { data: admin } = await adminClient
    .from('admins')
    .select('id, role, is_active')
    .eq('id', user.id)
    .single();

  if (!admin || !admin.is_active) {
    redirect('/');
  }

  return (
    <div className="min-h-screen flex">
      <AdminSidebar />
      <div className="flex-1 flex flex-col">
        <AdminHeader user={user} />
        <main className="flex-1 p-8 bg-muted/50">
          {children}
        </main>
      </div>
    </div>
  );
}

