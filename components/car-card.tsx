import Link from "next/link"
import type { Car } from "@/lib/types"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MapPin, Gauge, Calendar, Fuel, ArrowRight } from "lucide-react"
import { useState, useEffect } from "react"
interface CarCardProps {
  car: Car
}

export function CarCard({ car }: CarCardProps) {
  // si viene vacío, null o undefined → imagen por defecto
const images: string[] =
  typeof car.images === "string"
    ? JSON.parse(car.images)
    : car.images || []

const [currentImage, setCurrentImage] = useState(0)

useEffect(() => {
  if (images.length <= 1) return

  const interval = setInterval(() => {
    setCurrentImage((prev) =>
      prev === images.length - 1 ? 0 : prev + 1
    )
  }, 3000)

  return () => clearInterval(interval)
}, [images.length])

  return (
    <Link href={`/comprar/${car.id}`} className="group">
      <Card className="overflow-hidden hover:shadow-2xl transition-all duration-300 h-full border-border hover:border-primary/50 hover:-translate-y-1">
        
        {/* Imagen segura */}
        <div className="relative h-56 bg-muted overflow-hidden">
<img
  src={images[currentImage] || "/placeholder.svg"}
  alt={`${car.brand} ${car.model}`}
  loading="lazy"
  className="w-full h-full object-cover group-hover:scale-105 transition-all duration-500"
/>

{images.length > 1 && (
  <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2">
    {images.map((_, index) => (
      <div
        key={index}
        className={`w-2.5 h-2.5 rounded-full transition-all ${
          currentImage === index
            ? "bg-white scale-110"
            : "bg-white/50"
        }`}
      />
    ))}
  </div>
)}

          {car.featured && (
            <Badge className="absolute top-4 right-4 bg-accent text-accent-foreground font-semibold px-3 py-1 shadow-lg">
              Destacado
            </Badge>
          )}

          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>

        <CardContent className="p-6">
          <h3 className="font-bold text-xl mb-2 group-hover:text-primary transition-colors">
            {car.brand} {car.model}
          </h3>

          <div className="flex items-baseline gap-2 mb-4">
            <p className="text-3xl font-bold text-accent">
              ${car.price?.toLocaleString("es-MX") ?? "0"}
            </p>
            <span className="text-sm text-muted-foreground">MXN</span>
          </div>

          <div className="grid grid-cols-2 gap-3 mb-4">
            <div className="flex items-center gap-2 text-sm">
              <div className="bg-secondary rounded-lg p-2">
                <Calendar className="h-4 w-4 text-primary" />
              </div>
              <span className="font-medium">{car.year}</span>
            </div>

            <div className="flex items-center gap-2 text-sm">
              <div className="bg-secondary rounded-lg p-2">
                <Gauge className="h-4 w-4 text-primary" />
              </div>
              <span className="font-medium">
                {car.mileage?.toLocaleString() ?? 0} km
              </span>
            </div>

            <div className="flex items-center gap-2 text-sm">
              <div className="bg-secondary rounded-lg p-2">
                <Fuel className="h-4 w-4 text-primary" />
              </div>
              <span className="font-medium">{car.fuelType}</span>
            </div>

            <div className="flex items-center gap-2 text-sm">
              <div className="bg-secondary rounded-lg p-2">
                <MapPin className="h-4 w-4 text-primary" />
              </div>
              <span className="font-medium">{car.location}</span>
            </div>
          </div>

          <p className="text-sm text-muted-foreground line-clamp-2 mb-4 leading-relaxed">
            {car.description}
          </p>

          <div className="flex items-center gap-2 text-primary font-semibold text-sm group-hover:gap-3 transition-all">
            <span>Ver detalles</span>
            <ArrowRight className="h-4 w-4" />
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
