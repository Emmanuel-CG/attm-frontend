"use client"

import { useEffect, useState } from "react"
import type { Car } from "@/lib/types"
import { Navbar } from "@/components/navbar"
import { SearchBar } from "@/components/search-bar"
import { CarCard } from "@/components/car-card"
import { Button } from "@/components/ui/button"
import { Car as CarIcon, Shield, TrendingUp, Users, ArrowRight, Sparkles } from "lucide-react"
import Link from "next/link"

export default function HomePage() {
  const [featuredCars, setFeaturedCars] = useState<Car[]>([])

useEffect(() => {
  fetch("https://attm-backend-main-gvzubr.laravel.cloud/api/cars")
    .then((res) => res.json())
    .then((data) => {
      const destacados = data.slice(0, 6)

      setFeaturedCars(destacados)
    })
    .catch((err) => console.error("Error cargando autos:", err))
}, [])
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <section className="relative overflow-hidden bg-gradient-to-br from-primary via-primary to-primary/90 text-primary-foreground">
        {/* Decorative elements */}
        <div className="absolute inset-0 bg-grid-white/[0.05] bg-[size:32px_32px]" />
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-accent/20 to-transparent" />

        <div className="container relative mx-auto px-6 py-24 md:py-32">
          <div className="max-w-4xl">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 mb-8">
              <Sparkles className="h-4 w-4" />
              <span className="text-sm font-medium">La plataforma #1 en México</span>
            </div>

            <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tight text-balance leading-[1.1]">
              Encuentra el auto perfecto para ti
            </h1>
            <p className="text-xl md:text-2xl mb-10 text-primary-foreground/90 max-w-2xl text-pretty leading-relaxed">
              Miles de autos verificados, precios transparentes y la mejor experiencia de compra-venta en México
            </p>

            <div className="flex flex-wrap gap-4">
              <Link href="/comprar">
                <Button
                  size="lg"
                  variant="secondary"
                  className="text-lg h-14 px-8 font-semibold shadow-lg hover:shadow-xl transition-all"
                >
                  Explorar Autos
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/vender">
                <Button
                  size="lg"
                  variant="outline"
                  className="text-lg h-14 px-8 font-semibold bg-white/10 hover:bg-white/20 text-white border-white/30 backdrop-blur-sm"
                >
                  Vender mi Auto
                </Button>
              </Link>
            </div>

            <div className="grid grid-cols-3 gap-8 mt-16 pt-16 border-t border-white/20">
              <div>
                <div className="text-4xl font-bold mb-1">5,000+</div>
                <div className="text-sm text-primary-foreground/80">Autos disponibles</div>
              </div>
              <div>
                <div className="text-4xl font-bold mb-1">98%</div>
                <div className="text-sm text-primary-foreground/80">Clientes satisfechos</div>
              </div>
              <div>
                <div className="text-4xl font-bold mb-1">24/7</div>
                <div className="text-sm text-primary-foreground/80">Soporte disponible</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-6 -mt-8 relative z-10">
        <SearchBar />
      </div>

      <section className="py-24">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight">¿Por qué AutoMarket?</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              La forma más segura y confiable de comprar y vender autos en México
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="group p-8 rounded-2xl bg-card border border-border hover:border-primary/50 hover:shadow-xl transition-all duration-300">
              <div className="bg-primary/10 w-16 h-16 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Shield className="h-8 w-8 text-primary" />
              </div>
              <h3 className="font-bold text-2xl mb-3">100% Seguro</h3>
              <p className="text-muted-foreground leading-relaxed">
                Verificamos cada anuncio y vendedor para garantizar transacciones seguras y confiables
              </p>
            </div>

            <div className="group p-8 rounded-2xl bg-card border border-border hover:border-primary/50 hover:shadow-xl transition-all duration-300">
              <div className="bg-primary/10 w-16 h-16 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <CarIcon className="h-8 w-8 text-primary" />
              </div>
              <h3 className="font-bold text-2xl mb-3">Gran Variedad</h3>
              <p className="text-muted-foreground leading-relaxed">
                Miles de autos de todas las marcas, modelos y precios para que encuentres el ideal
              </p>
            </div>

            <div className="group p-8 rounded-2xl bg-card border border-border hover:border-primary/50 hover:shadow-xl transition-all duration-300">
              <div className="bg-primary/10 w-16 h-16 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <TrendingUp className="h-8 w-8 text-primary" />
              </div>
              <h3 className="font-bold text-2xl mb-3">Mejor Precio</h3>
              <p className="text-muted-foreground leading-relaxed">
                Precios justos y transparentes sin comisiones ocultas ni sorpresas
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-24 bg-secondary/30">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-12">
            <div>
              <h2 className="text-4xl md:text-5xl font-bold mb-3 tracking-tight">Autos Destacados</h2>
              <p className="text-xl text-muted-foreground">Las mejores ofertas seleccionadas para ti</p>
            </div>
            <Link href="/comprar">
              <Button size="lg" variant="outline" className="text-base font-medium bg-transparent">
                Ver Todos
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredCars.map((car) => (
              <CarCard key={car.id} car={car} />
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 bg-gradient-to-br from-foreground via-foreground to-foreground/90 text-background relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-white/[0.05] bg-[size:32px_32px]" />
        <div className="container relative mx-auto px-6">
          <div className="max-w-3xl mx-auto text-center">
            <div className="bg-accent/20 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-8">
              <Users className="h-10 w-10 text-accent" />
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight">¿Tienes un auto para vender?</h2>
            <p className="text-xl mb-10 text-background/80 leading-relaxed">
              Publica tu anuncio gratis en minutos y conecta con miles de compradores interesados en toda la república
            </p>
            <Link href="/vender">
              <Button
                size="lg"
                className="text-lg h-14 px-8 font-semibold bg-accent hover:bg-accent/90 text-accent-foreground shadow-xl"
              >
                Publicar Anuncio Gratis
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <footer className="bg-card border-t py-12">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-3">
              <div className="bg-primary rounded-xl p-2">
                <CarIcon className="h-6 w-6 text-primary-foreground" />
              </div>
              <span className="text-2xl font-bold">AutoMarket</span>
            </div>
            <p className="text-muted-foreground">© 2025 AutoMarket México. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
