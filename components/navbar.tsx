"use client"

import Link from "next/link"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { Car, LogOut, User, Menu, Shield } from 'lucide-react'
import { useState } from "react"

export function Navbar() {
  const { user, logout, isAuthenticated, isAdmin } = useAuth()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <nav className="bg-white border-b border-border/50 sticky top-0 z-50 backdrop-blur-sm bg-white/95">
      <div className="container mx-auto px-6 h-20 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="bg-primary rounded-xl p-2 group-hover:scale-105 transition-transform">
            <Car className="h-6 w-6 text-primary-foreground" />
          </div>
          <span className="text-2xl font-bold tracking-tight">AutoMarket</span>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-2">
          {isAdmin && (
            <Link href="/admin">
              <Button variant="ghost" size="lg" className="text-base font-medium text-blue-600">
                <Shield className="h-5 w-5 mr-2" />
                Admin
              </Button>
            </Link>
          )}

          {!isAdmin && (
            <>
              <Link href="/comprar">
                <Button variant="ghost" size="lg" className="text-base font-medium">
                  Comprar
                </Button>
              </Link>
              <Link href="/vender">
                <Button variant="ghost" size="lg" className="text-base font-medium">
                  Vender
                </Button>
              </Link>
            </>
          )}

          {isAuthenticated ? (
            <>
              {!isAdmin && (
                <Link href="/mis-autos">
                  <Button variant="ghost" size="lg" className="text-base font-medium">
                    <User className="h-5 w-5 mr-2" />
                    Mis Autos
                  </Button>
                </Link>
              )}
              <Link href="/perfil">
                <Button variant="ghost" size="lg" className="text-base font-medium">
                  Perfil
                </Button>
              </Link>
              <Button variant="outline" size="lg" onClick={logout} className="ml-2 bg-transparent">
                <LogOut className="h-5 w-5 mr-2" />
                Salir
              </Button>
            </>
          ) : (
            <>
              <Link href="/login">
                <Button variant="ghost" size="lg" className="text-base font-medium ml-2">
                  Iniciar Sesión
                </Button>
              </Link>
              <Link href="/registro">
                <Button size="lg" className="text-base font-medium">
                  Registrarse
                </Button>
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
          <Menu className="h-6 w-6" />
        </Button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t bg-white">
          <div className="container mx-auto px-6 py-4 flex flex-col gap-2">
            {isAdmin && (
              <Link href="/admin" onClick={() => setMobileMenuOpen(false)}>
                <Button variant="ghost" className="w-full justify-start text-blue-600">
                  <Shield className="h-5 w-5 mr-2" />
                  Panel Admin
                </Button>
              </Link>
            )}

            {!isAdmin && (
              <>
                <Link href="/comprar" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="ghost" className="w-full justify-start">
                    Comprar
                  </Button>
                </Link>
                <Link href="/vender" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="ghost" className="w-full justify-start">
                    Vender
                  </Button>
                </Link>
              </>
            )}

            {isAuthenticated ? (
              <>
                {!isAdmin && (
                  <Link href="/mis-autos" onClick={() => setMobileMenuOpen(false)}>
                    <Button variant="ghost" className="w-full justify-start">
                      Mis Autos
                    </Button>
                  </Link>
                )}
                <Link href="/perfil" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="ghost" className="w-full justify-start">
                    Perfil
                  </Button>
                </Link>
                <Button variant="outline" onClick={logout} className="w-full justify-start bg-transparent">
                  Salir
                </Button>
              </>
            ) : (
              <>
                <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="ghost" className="w-full justify-start">
                    Iniciar Sesión
                  </Button>
                </Link>
                <Link href="/registro" onClick={() => setMobileMenuOpen(false)}>
                  <Button className="w-full justify-start">Registrarse</Button>
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}
