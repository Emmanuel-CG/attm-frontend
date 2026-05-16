import Image from "next/image"
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
  ArrowLeft,
  Flag,
  AlertTriangle,
  UserX,
  ImageOff,
  DollarSign,
} from "lucide-react"
import { ContactSection } from "@/components/contact-section"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
const API_BASE_URL = "http://localhost:8000/api"

async function getCar(id: string) {
  const res = await fetch(`${API_BASE_URL}/cars/${id}`, {
    cache: "no-store",
  })

  if (!res.ok) return null

  return res.json()
}

export default async function CarDetailPage({ params }: { params: { id: string } }) {
  const id = params.id // ← ya no se usa await
  const car = await getCar(id)

  if (!car) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
        <Navbar />
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold mb-4">Auto no encontrado</h1>
          <Link href="/comprar">
            <Button>Volver a la búsqueda</Button>
          </Link>
        </div>
      </div>
    )
  }

const placeholderImages = [
  "/chevrolet-aveo-plata-2019.jpg",
  "/honda-civic-gris-2019.jpg",
  "/mazda-cx5-rojo-suv-2022.jpg",
];

const imageUrl =
  car.images && car.images.length > 0
    ? `/${car.images[0]}` // si las imágenes del car también están en public
    : placeholderImages[Math.floor(Math.random() * placeholderImages.length)];


  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <Navbar />

      <div className="container mx-auto px-4 py-8">
        <Link href="/comprar" className="mb-4 flex items-center gap-2 text-primary hover:underline">
          <ArrowLeft className="h-4 w-4" />
          Volver
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">

            {/* Imagen */}
            <Card className="overflow-hidden">
              <div className="relative h-96 bg-muted">
                <Image
                  src={imageUrl}
                  alt={`${car.brand} ${car.model}`}
                  fill
                  className="object-cover"
                />
                {car.featured && (
                  <Badge className="absolute top-4 right-4 bg-primary">Destacado</Badge>
                )}
              </div>
            </Card>

            {/* Info */}
            <Card>
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h1 className="text-3xl font-bold mb-2">
                      {car.brand} {car.model}
                    </h1>
                    <p className="text-4xl font-bold text-primary">
                      ${car.price.toLocaleString("es-MX")}
                    </p>
                  </div>
<DropdownMenu>
  <DropdownMenuTrigger asChild>
    <Button variant="outline" size="icon">
      <Flag className="h-4 w-4 text-red-500" />
    </Button>
  </DropdownMenuTrigger>

  <DropdownMenuContent
    align="end"
    className="w-56"
  >
    <DropdownMenuItem>
      <AlertTriangle className="h-4 w-4 mr-2 text-red-500" />
      Anuncio Fraudulento
    </DropdownMenuItem>

    <DropdownMenuItem>
      <UserX className="h-4 w-4 mr-2 text-orange-500" />
      Usuario Sospechoso
    </DropdownMenuItem>

    <DropdownMenuItem>
      <ImageOff className="h-4 w-4 mr-2 text-purple-500" />
      Fotos Inapropiadas
    </DropdownMenuItem>

    <DropdownMenuItem>
      <DollarSign className="h-4 w-4 mr-2 text-yellow-600" />
      Precio Sospechoso
    </DropdownMenuItem>
  </DropdownMenuContent>
</DropdownMenu>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-primary" />
                    <div>
                      <p className="text-xs text-muted-foreground">Año</p>
                      <p className="font-semibold">{car.year}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Gauge className="h-5 w-5 text-primary" />
                    <div>
                      <p className="text-xs text-muted-foreground">Kilometraje</p>
                      <p className="font-semibold">{car.mileage?.toLocaleString()} km</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Settings className="h-5 w-5 text-primary" />
                    <div>
                      <p className="text-xs text-muted-foreground">Transmisión</p>
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
                      <p className="text-xs text-muted-foreground">Ubicación</p>
                      <p className="font-semibold">{car.location}</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h2 className="text-xl font-bold mb-3">Descripción</h2>
                  <p className="text-muted-foreground leading-relaxed">{car.description}</p>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-1">
            <ContactSection car={car} />
          </div>
        </div>
      </div>
    </div>
  )
}
