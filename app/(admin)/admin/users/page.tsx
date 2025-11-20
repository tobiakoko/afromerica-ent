// Suspense is used below
import { Suspense } from 'react'
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
// TODO: Add back when components are created
// import { PageLoader } from '@/components/shared/suspense-wrapper'
// import { ErrorBoundary } from '@/components/shared/error-boundary'
import { Users, Search, Mail, Phone, Calendar } from 'lucide-react'

export default async function AdminUsersPage() {
  const supabase = await createClient()

  // Check authentication and admin role
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    redirect('/auth/signin?redirect=/admin/users')
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (profile?.role !== 'admin') {
    redirect('/dashboard')
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">User Management</h1>
        <p className="text-muted-foreground">
          View and manage all registered users
        </p>
      </div>

      <Suspense fallback={<div>Loading...</div>}>
        <UsersTable />
      </Suspense>
    </div>
  )
}

async function UsersTable() {
  const supabase = await createClient()

  // Fetch all users with stats
  const { data: users } = await supabase
    .from('profiles')
    .select(`
      *
    `)
    .order('created_at', { ascending: false })

  // Get ticket counts for each user
  const { data: bookingCounts } = await supabase
    .from('tickets')
    .select('user_email')
    .eq('payment_status', 'completed')

  // Count bookings per user email
  const bookingsPerUser = bookingCounts?.reduce((acc, b) => {
    if (b.user_email) {
      acc[b.user_email] = (acc[b.user_email] || 0) + 1
    }
    return acc
  }, {} as Record<string, number>) || {}

  const totalUsers = users?.length || 0
  const adminCount = users?.filter(u => u.role === 'admin').length || 0
  const editorCount = users?.filter(u => u.role === 'editor').length || 0

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalUsers}</div>
            <p className="text-xs text-muted-foreground">
              Registered accounts
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Admins</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{adminCount}</div>
            <p className="text-xs text-muted-foreground">
              Admin users
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Editors</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{editorCount}</div>
            <p className="text-xs text-muted-foreground">
              Editor users
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Users List */}
      <Card>
        <CardHeader>
          <CardTitle>All Users</CardTitle>
          <CardDescription>
            A list of all users registered on the platform
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Search (client-side implementation would be better) */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search users..."
                className="pl-10"
              />
            </div>

            {/* Users Table */}
            <div className="rounded-md border">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b bg-muted/50">
                      <th className="p-4 text-left text-sm font-medium">User</th>
                      <th className="p-4 text-left text-sm font-medium">Contact</th>
                      <th className="p-4 text-left text-sm font-medium">Role</th>
                      <th className="p-4 text-left text-sm font-medium">Bookings</th>
                      <th className="p-4 text-left text-sm font-medium">Joined</th>
                      <th className="p-4 text-left text-sm font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users?.map((user) => (
                      <tr key={user.id} className="border-b last:border-0">
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <Avatar>
                              <AvatarImage src={user.avatar_url || ''} />
                              <AvatarFallback>
                                {user.full_name?.charAt(0) || user.email.charAt(0).toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium">{user.full_name || 'No name'}</p>
                              <p className="text-sm text-muted-foreground">{user.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="space-y-1 text-sm">
                            {user.email && (
                              <div className="flex items-center gap-2 text-muted-foreground">
                                <Mail className="h-3 w-3" />
                                <span className="truncate max-w-[200px]">{user.email}</span>
                              </div>
                            )}
                            {user.phone && (
                              <div className="flex items-center gap-2 text-muted-foreground">
                                <Phone className="h-3 w-3" />
                                <span>{user.phone}</span>
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="p-4">
                          <Badge
                            variant={
                              user.role === 'admin'
                                ? 'default'
                                : user.role === 'editor'
                                ? 'secondary'
                                : 'outline'
                            }
                          >
                            {user.role}
                          </Badge>
                        </td>
                        <td className="p-4">
                          <div className="font-medium">
                            {bookingsPerUser[user.id] || 0}
                          </div>
                          <p className="text-xs text-muted-foreground">completed</p>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Calendar className="h-3 w-3" />
                            {new Date(user.created_at).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric',
                            })}
                          </div>
                        </td>
                        <td className="p-4">
                          <Button variant="ghost" size="sm">
                            View Details
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}