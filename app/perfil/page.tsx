"use client"

import { useAuth } from "@/lib/auth-context"
import { ProfileForm } from "@/components/profile-form"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from 'lucide-react'
import { redirect } from 'next/navigation'

export default function ProfilePage() {
  const { user, isAuthenticated } = useAuth()

  if (!isAuthenticated) {
    redirect("/login")
  }

  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto px-6 py-12">
        <div className="mb-8">
          <Link href="/mis-autos">
            <Button variant="ghost" className="mb-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver
            </Button>
          </Link>
          <div>
            <h1 className="text-4xl font-bold text-foreground">Mi Perfil</h1>
            <p className="text-muted-foreground mt-2">Gestiona tu información personal y de seguridad</p>
          </div>
        </div>

        <ProfileForm />
      </div>
    </main>
  )
}
