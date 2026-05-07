"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search } from "lucide-react"

export function SearchBar() {
  const [searchTerm, setSearchTerm] = useState("")
  const [brand, setBrand] = useState("")
  const [priceRange, setPriceRange] = useState("")
  const router = useRouter()

  const handleSearch = () => {
    const params = new URLSearchParams()
    if (searchTerm) params.set("q", searchTerm)
    if (brand) params.set("brand", brand)
    if (priceRange) params.set("price", priceRange)

    router.push(`/comprar?${params.toString()}`)
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 -mt-8 relative z-10">
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
        <Button onClick={handleSearch} className="w-full">
          <Search className="h-4 w-4 mr-2" />
          Buscar
        </Button>
      </div>
    </div>
  )
}
