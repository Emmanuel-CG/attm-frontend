import Image from "next/image"
import Link from "next/link"
import type { Car } from "@/lib/types"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MapPin, Gauge, Calendar, Fuel, ArrowRight } from "lucide-react"

interface CarCardProps {
  car: Car
}

export function CarCard({ car }: CarCardProps) {

  // si viene vacío, null o undefined → imagen por defecto
  const imageUrl =
    car.images && car.images.length > 0
      ? car.images[0]
      : "/placeholder.svg?height=224&width=400&query=modern%20car"

  return (
    <Link href={`/comprar/${car.id}`} className="group">
      <Card className="overflow-hidden hover:shadow-2xl transition-all duration-300 h-full border-border hover:border-primary/50 hover:-translate-y-1">
        
        {/* Imagen segura */}
        <div className="relative h-56 bg-muted overflow-hidden">
          <Image
            src={imageUrl}
            alt={`${car.brand} ${car.model}`}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />

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
