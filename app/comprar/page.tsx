"use client"

import { useState, useMemo, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { Navbar } from "@/components/navbar"
import { CarCard } from "@/components/car-card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, SlidersHorizontal } from "lucide-react"
import type { Car } from "@/lib/types"

export default function ComprarPage() {
  const searchParams = useSearchParams()
  const [cars, setCars] = useState<Car[]>([])
  const [searchTerm, setSearchTerm] = useState(searchParams.get("q") || "")
  const [brand, setBrand] = useState(searchParams.get("brand") || "all")
  const [priceRange, setPriceRange] = useState(searchParams.get("price") || "all")
  const [sortBy, setSortBy] = useState("recent")
// Prueba de vinculación con Jira AM-23

  // 🔥 Cargar autos reales desde backend
  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/cars")
      .then(res => res.json())
      .then(data => {
        setCars(data)
      })
      .catch(err => console.error("Error cargando autos:", err))
  }, [])

  const filteredCars = useMemo(() => {
    let filtered = [...cars]

    if (searchTerm) {
      filtered = filtered.filter(
        (car) =>
          car.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
          car.model.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    if (brand !== "all") {
      filtered = filtered.filter((car) => car.brand.toLowerCase() === brand.toLowerCase())
    }

    if (priceRange !== "all") { 
      if (priceRange === "0-200000") filtered = filtered.filter((car) => car.price <= 200000)
      if (priceRange === "200000-300000") filtered = filtered.filter((car) => car.price > 200000 && car.price <= 300000)
      if (priceRange === "300000-400000") filtered = filtered.filter((car) => car.price > 300000 && car.price <= 400000)
      if (priceRange === "400000+") filtered = filtered.filter((car) => car.price > 400000)
    }

    if (sortBy === "price-low") filtered.sort((a, b) => a.price - b.price)
    if (sortBy === "price-high") filtered.sort((a, b) => b.price - a.price)
    if (sortBy === "year") filtered.sort((a, b) => b.year - a.year)
    if (sortBy === "mileage") filtered.sort((a, b) => a.mileage - b.mileage)
    if (sortBy === "recent") filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

    return filtered
  }, [cars, searchTerm, brand, priceRange, sortBy])

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <Navbar />

      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Comprar Auto</h1>

        {/* Filtros */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex items-center gap-2 mb-4">
            <SlidersHorizontal className="h-5 w-5 text-primary" />
            <h2 className="text-lg font-semibold">Filtros de Búsqueda</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Input
              placeholder="Buscar marca, modelo..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="md:col-span-1"
            />
            <Select value={brand} onValueChange={setBrand}>
              <SelectTrigger>
                <SelectValue placeholder="Marca" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas las marcas</SelectItem>
                <SelectItem value="toyota">Toyota</SelectItem>
                <SelectItem value="honda">Honda</SelectItem>
                <SelectItem value="nissan">Nissan</SelectItem>
                <SelectItem value="volkswagen">Volkswagen</SelectItem>
                <SelectItem value="mazda">Mazda</SelectItem>
                <SelectItem value="chevrolet">Chevrolet</SelectItem>
              </SelectContent>
            </Select>
            <Select value={priceRange} onValueChange={setPriceRange}>
              <SelectTrigger>
                <SelectValue placeholder="Rango de precio" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los precios</SelectItem>
                <SelectItem value="0-200000">Hasta $200,000</SelectItem>
                <SelectItem value="200000-300000">$200,000 - $300,000</SelectItem>
                <SelectItem value="300000-400000">$300,000 - $400,000</SelectItem>
                <SelectItem value="400000+">Más de $400,000</SelectItem>
              </SelectContent>
            </Select>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger>
                <SelectValue placeholder="Ordenar por" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="recent">Más recientes</SelectItem>
                <SelectItem value="price-low">Precio: Menor a Mayor</SelectItem>
                <SelectItem value="price-high">Precio: Mayor a Menor</SelectItem>
                <SelectItem value="year">Año más reciente</SelectItem>
                <SelectItem value="mileage">Menor kilometraje</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Resultados */}
        <div className="mb-4">
          <p className="text-muted-foreground">
            {filteredCars.length} {filteredCars.length === 1 ? "auto encontrado" : "autos encontrados"}
          </p>
        </div>

        {filteredCars.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCars.map((car) => (
              <CarCard key={car.id} car={car} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <Search className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold mb-2">No se encontraron autos</h3>
            <p className="text-muted-foreground mb-4">Intenta ajustar tus filtros de búsqueda</p>
            <Button
              onClick={() => {
                setSearchTerm("")
                setBrand("all")
                setPriceRange("all")
              }}
            >
              Limpiar Filtros
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
