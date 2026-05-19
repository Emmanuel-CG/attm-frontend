"use client"

import Link from "next/link"
import { Navbar } from "@/components/navbar"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  MapPin,
  Gauge,
  Calendar,
  Fuel,
  Settings,
  Palette,
  Phone,
  Mail,
  User,
  ArrowLeft,
  CheckCircle,
  Flag,
  AlertTriangle,
  UserX,
  ImageOff,
  DollarSign,
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useToast } from "@/hooks/use-toast"
import { useState, useEffect } from "react"
import { ContactModal } from "@/components/contact-modal"
import { CallModal } from "@/components/call-modal"

interface CarData {
  id: string
  brand: string
  model: string
  year: number
  price: number
  mileage: number
  transmission: string
  fuelType: string
  color: string
  description: string
  images: string[]
  location: string
  sellerId: string
  sellerName: string
  sellerPhone: string
  createdAt: string
  featured?: boolean
  verified?: boolean
}

interface CarDetailContentProps {
  car: CarData
}

export function CarDetailContent({ car }: CarDetailContentProps) {
  const [showMessageModal, setShowMessageModal] = useState(false)
  const [showCallModal, setShowCallModal] = useState(false)
  const { toast } = useToast()
 const [currentImage, setCurrentImage] = useState(0)

const images: string[] =

  typeof car.images === "string"
    ? JSON.parse(car.images)
    : car.images || []

useEffect(() => {
  if (images.length <= 1) return

  const interval = setInterval(() => {
    setCurrentImage((prev) =>
      prev === images.length - 1 ? 0 : prev + 1
    )
  }, 3000)

  return () => clearInterval(interval)
}, [images.length])

useEffect(() => {
  setCurrentImage(0)
}, [car.id])
const handleReport = async (reason: string) => {

  try {

const response = await fetch(
  `https://attm-backend-main-gvzubr.laravel.cloud/api/cars/${car.id}/report`,
      {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          reason,
        }),
      }
    )

    const data = await response.json()

    toast({
      title: "Reporte enviado",
      description: data.message,
    })

  } catch (error) {

    toast({
      title: "Error",
      description: "No se pudo enviar el reporte",
      variant: "destructive",
    })
  }
}

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <Navbar />

      <div className="container mx-auto px-4 py-8">
        <Link href="/comprar" className="mb-4 flex items-center gap-2 text-primary hover:underline">
          <ArrowLeft className="h-4 w-4" />
          Volver
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Columna principal */}
          <div className="lg:col-span-2 space-y-6">
            {/* Imagen principal */}
<Card className="overflow-hidden">
  <div className="relative bg-muted">
    
    {/* Imagen principal */}
    <div className="relative h-96">
      <img
        src={images[currentImage] || "/placeholder.svg"}
        alt={`${car.brand} ${car.model}`}
        className="w-full h-full object-cover transition-all duration-700"
      />
      {images.length > 1 && (
  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
    {images.map((_, index) => (
      <div
        key={index}
        className={`w-3 h-3 rounded-full transition-all ${
          currentImage === index
            ? "bg-white scale-110"
            : "bg-white/50"
        }`}
      />
    ))}
  </div>
)}

      {car.featured && (
        <Badge className="absolute top-4 right-4 bg-primary">
          Destacado
        </Badge>
      )}
    </div>

    {/* Miniaturas */}

  </div>
</Card>
            {/* Informacion del auto */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div>
                    <h1 className="text-3xl font-bold mb-2">
                      {car.brand} {car.model}
                    </h1>
                    <p className="text-4xl font-bold text-primary">${car.price.toLocaleString("es-MX")}</p>
                  </div>
<div className="flex-shrink-0">
  <DropdownMenu>
  <DropdownMenuTrigger asChild>
    <Button variant="outline" size="icon">
      <Flag className="h-4 w-4" />
    </Button>
  </DropdownMenuTrigger>

  <DropdownMenuContent
    align="end"
    className="w-56"
  >
    <DropdownMenuItem
      className="cursor-pointer"
      onClick={() =>
        handleReport(
          "Anuncio Fraudulento"
        )
      }
    >
      <AlertTriangle className="h-4 w-4 mr-2 text-red-500" />
      Anuncio Fraudulento
    </DropdownMenuItem>

    <DropdownMenuItem
      className="cursor-pointer"
      onClick={() =>
        handleReport(
          "Usuario Sospechoso"
        )
      }
    >
      <UserX className="h-4 w-4 mr-2 text-orange-500" />
      Usuario Sospechoso
    </DropdownMenuItem>

    <DropdownMenuItem
      className="cursor-pointer"
      onClick={() =>
        handleReport(
          "Fotos Inapropiadas"
        )
      }
    >
      <ImageOff className="h-4 w-4 mr-2 text-purple-500" />
      Fotos Inapropiadas
    </DropdownMenuItem>

    <DropdownMenuItem
      className="cursor-pointer"
      onClick={() =>
        handleReport(
          "Precio Sospechoso"
        )
      }
    >
      <DollarSign className="h-4 w-4 mr-2 text-yellow-600" />
      Precio Sospechoso
    </DropdownMenuItem>
  </DropdownMenuContent>
  </DropdownMenu>
</div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-primary" />
                    <div>
                      <p className="text-xs text-muted-foreground">Ano</p>
                      <p className="font-semibold">{car.year}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Gauge className="h-5 w-5 text-primary" />
                    <div>
                      <p className="text-xs text-muted-foreground">Kilometraje</p>
                      <p className="font-semibold">{car.mileage.toLocaleString()} km</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Settings className="h-5 w-5 text-primary" />
                    <div>
                      <p className="text-xs text-muted-foreground">Transmision</p>
                      <p className="font-semibold">{car.transmission}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Fuel className="h-5 w-5 text-primary" />
                    <div>
                      <p className="text-xs text-muted-foreground">Combustible</p>
                      <p className="font-semibold">{car.fuelType}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Palette className="h-5 w-5 text-primary" />
                    <div>
                      <p className="text-xs text-muted-foreground">Color</p>
                      <p className="font-semibold">{car.color}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-5 w-5 text-primary" />
                    <div>
                      <p className="text-xs text-muted-foreground">Ubicacion</p>
                      <p className="font-semibold">{car.location}</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h2 className="text-xl font-bold mb-3">Descripcion</h2>
                  <p className="text-muted-foreground leading-relaxed">{car.description}</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar - Informacion del vendedor */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24">
              <CardContent className="p-6">
                <h2 className="text-xl font-bold mb-4">Informacion del Vendedor</h2>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="bg-primary/10 p-3 rounded-full">
                      <User className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-muted-foreground">Vendedor</p>
                      <div className="flex items-center gap-2 mt-1">
                        <p className="font-semibold">{car.sellerName}</p>
                        {car.verified && (
                          <div className="flex items-center gap-1 bg-green-50 px-2 py-1 rounded-full">
                            <CheckCircle className="h-4 w-4 text-green-600" />
                            <span className="text-xs font-semibold text-green-600">Verificado</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="bg-primary/10 p-3 rounded-full">
                      <Phone className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Telefono</p>
                      <p className="font-semibold">{car.sellerPhone}</p>
                    </div>
                  </div>
                  <Button className="w-full" size="lg" onClick={() => setShowCallModal(true)}>
                    <Phone className="h-4 w-4 mr-2" />
                    Contactar Vendedor
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full bg-transparent"
                    size="lg"
                    onClick={() => setShowMessageModal(true)}
                  >
                    <Mail className="h-4 w-4 mr-2" />
                    Enviar Mensaje
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {showMessageModal && (
        <ContactModal
          carId={car.id}
          carName={`${car.brand} ${car.model}`}
          sellerName={car.sellerName}
          onClose={() => setShowMessageModal(false)}
        />
      )}

      {showCallModal && (
        <CallModal sellerName={car.sellerName} sellerPhone={car.sellerPhone} onClose={() => setShowCallModal(false)} />
      )}
    </div>
  )
}
