"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { Navbar } from "@/components/navbar"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { EditCarModal } from "@/components/edit-car-modal"
import { Plus, Edit, Trash2, Eye, MapPin, Calendar, Gauge, MessageSquare } from "lucide-react"
import type { Car } from "@/lib/types"

const API_BASE_URL = "http://localhost:8000/api"

export default function MisAutosPage() {
  const { isAuthenticated, token } = useAuth()
  const router = useRouter()

  const [editingCar, setEditingCar] = useState<Car | null>(null)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [userCars, setUserCars] = useState<Car[]>([])

  // 🔥 CARGAR AUTOS
  const fetchMyCars = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/cars/mine`, {
        headers: {
          ...(token ? { Authorization: token } : {}),
          Accept: "application/json"
        },
      })

      if (!res.ok) {
        console.log("Error backend:", await res.text())
        return
      }

      const data = await res.json()

      // 🔥 FORMATEAR PARA UI
      const formatted = data.map((car: any) => ({
        ...car,
        price: Number(car.price),
        mileage: Number(car.mileage),
        images: car.images ?? ["/placeholder.svg"]
      }))

      setUserCars(formatted)

    } catch (err) {
      console.error("Error cargando autos:", err)
    }
  }

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login")
      return
    }

    if (token) {
      fetchMyCars()
    }
  }, [isAuthenticated, token])

  if (!isAuthenticated) return null

  const handleEditClick = (car: Car) => {
    setEditingCar(car)
    setIsEditModalOpen(true)
  }

  const handleSaveCar = (updatedCar: any) => {
    if (editingCar) {
      const updated = { ...editingCar, ...updatedCar }

      setUserCars((prev) =>
        prev.map((car) => (car.id === editingCar.id ? updated : car))
      )

      setEditingCar(null)
    }
  }

  // 🔥 ELIMINAR AUTO
  const handleDeleteCar = async (carId: number) => {
    if (!confirm("¿Seguro de borrar este auto?")) return

    try {
      const res = await fetch(`${API_BASE_URL}/cars/${carId}`, {
        method: "DELETE",
        headers: {
          ...(token ? { Authorization: token } : {}),
          Accept: "application/json"
        },
      })

      if (res.ok) {
        setUserCars((prev) => prev.filter((car) => car.id !== carId))
      } else {
        console.log(await res.text())
      }

    } catch (err) {
      console.error("Error al eliminar:", err)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <Navbar />

      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Mis Autos</h1>
            <p className="text-muted-foreground">Administra tus anuncios publicados</p>
          </div>

          <div className="flex gap-2">
            <Link href="/mis-autos/contactos">
              <Button variant="outline">
                <MessageSquare className="h-4 w-4 mr-2" />
                Ver Contactos
              </Button>
            </Link>

            <Link href="/vender">
              <Button size="lg">
                <Plus className="h-4 w-4 mr-2" />
                Publicar Nuevo Auto
              </Button>
            </Link>
          </div>
        </div>

        {userCars.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {userCars.map((car) => (
              <Card key={car.id} className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
                <div className="relative h-48 bg-muted">
                  <Image
                    src={car.images?.[0] || "/placeholder.svg"}
                    alt={`${car.brand} ${car.model}`}
                    fill
                    className="object-cover"
                  />
                  <Badge className="absolute top-2 left-2 bg-green-600">Activo</Badge>
                </div>

                <CardContent className="p-4">
                  <h3 className="font-bold text-lg mb-1">
                    {car.brand} {car.model}
                  </h3>

                  <p className="text-2xl font-bold text-primary mb-3">
                    ${car.price.toLocaleString("es-MX")}
                  </p>

                  <div className="grid grid-cols-2 gap-2 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      <span>{car.year}</span>
                    </div>

                    <div className="flex items-center gap-1">
                      <Gauge className="h-4 w-4" />
                      <span>{car.mileage.toLocaleString()} km</span>
                    </div>

                    <div className="flex items-center gap-1 col-span-2">
                      <MapPin className="h-4 w-4" />
                      <span>{car.location}</span>
                    </div>
                  </div>
                </CardContent>

                <CardFooter className="p-4 pt-0 flex gap-2">
                  <Link href={`/comprar/${car.id}`} className="flex-1">
                    <Button variant="outline" className="w-full bg-transparent">
                      <Eye className="h-4 w-4 mr-2" />
                      Ver
                    </Button>
                  </Link>

                  <Button variant="outline" size="icon" onClick={() => handleEditClick(car)}>
                    <Edit className="h-4 w-4" />
                  </Button>

                  <Button
                    variant="outline"
                    size="icon"
                    className="text-destructive"
                    onClick={() => handleDeleteCar(car.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="text-center py-16">
            <CardContent>
              <h3 className="text-xl font-semibold mb-2">No tienes autos publicados</h3>
              <p className="text-muted-foreground mb-6">
                Comienza a vender publicando tu primer auto
              </p>

              <Link href="/vender">
                <Button size="lg">
                  <Plus className="h-4 w-4 mr-2" />
                  Publicar mi Primer Auto
                </Button>
              </Link>
            </CardContent>
          </Card>
        )}
      </div>

      {editingCar && (
        <EditCarModal
          open={isEditModalOpen}
          onOpenChange={setIsEditModalOpen}
          car={editingCar}
          onSave={handleSaveCar}
        />
      )}
    </div>
  )
}