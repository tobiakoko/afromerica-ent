"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { Loader2 } from "lucide-react"
import { signOut } from "@/features/auth/actions/auth.actions"
import { toast } from "sonner"

export default function SignOutPage() {
  const router = useRouter()

  useEffect(() => {
    const handleSignOut = async () => {
      try {
        await signOut()
        toast.success("Signed out successfully")
        router.push("/")
      } catch (error) {
        toast.error("Failed to sign out")
        router.push("/")
      }
    }

    handleSignOut()
  }, [router])

  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="text-center">
        <Loader2 className="w-12 h-12 text-orange-500 animate-spin mx-auto mb-4" />
        <p className="text-white text-lg">Signing you out...</p>
      </div>
    </div>
  )
}
