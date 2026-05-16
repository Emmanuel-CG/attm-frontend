"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Navbar } from "@/components/navbar"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Car, Upload, CheckCircle2 } from "lucide-react"

export default function VenderPage() {
  const { isAuthenticated, user, token } = useAuth()
  const router = useRouter()
  const [submitted, setSubmitted] = useState(false)
  const [images, setImages] = useState<File[]>([])

  const [formData, setFormData] = useState({
    brand: "",
    model: "",
    year: "",
    price: "",
    mileage: "",
    transmission: "",
    fuelType: "",
    color: "",
    location: "",
    description: "",
    phone: "",
  })

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!isAuthenticated) {
      router.push("/login")
      return
    }

    try {
      const form = new FormData()

Object.entries(formData).forEach(([key, value]) => {
  form.append(key, value)
})

images.forEach((image) => {
  form.append("images[]", image)
})

const res = await fetch(
  "https://attm-backend-main-gvzubr.laravel.cloud/api/cars",
  {
    method: "POST",
    headers: {
      Accept: "application/json",
      ...(token ? { Authorization: token } : {}),
    },
    body: form,
  }
)

      if (!res.ok) {
        const error = await res.json()
        alert(JSON.stringify(error))
        return
      }

      setSubmitted(true)

      setTimeout(() => {
        router.push("/mis-autos")
      }, 2000)
    } catch (err) {
      console.log("Error al enviar:", err)
    }
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
        <Navbar />
        <div className="container mx-auto px-4 py-16">
          <Card className="max-w-md mx-auto text-center">
            <CardContent className="pt-6">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="h-8 w-8 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold mb-2">Anuncio Publicado</h2>
              <p className="text-muted-foreground mb-4">Tu auto ha sido publicado exitosamente</p>
              <p className="text-sm text-muted-foreground">Redirigiendo a Mis Autos...</p>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <Navbar />

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-8">
            <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Car className="h-8 w-8 text-primary" />
            </div>
            <h1 className="text-3xl font-bold mb-2">Vende tu Auto</h1>
            <p className="text-muted-foreground">Completa el formulario para publicar tu anuncio gratis</p>
          </div>

<Card>
            <CardHeader>
              <CardTitle>Información del Vehículo</CardTitle>
              <CardDescription>Proporciona los detalles de tu auto para atraer compradores</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Información básica */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="brand">Marca *</Label>
                    <Select value={formData.brand} onValueChange={(value) => handleChange("brand", value)} required>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona la marca" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Toyota">Toyota</SelectItem>
                        <SelectItem value="Honda">Honda</SelectItem>
                        <SelectItem value="Nissan">Nissan</SelectItem>
                        <SelectItem value="Volkswagen">Volkswagen</SelectItem>
                        <SelectItem value="Mazda">Mazda</SelectItem>
                        <SelectItem value="Chevrolet">Chevrolet</SelectItem>
                        <SelectItem value="Ford">Ford</SelectItem>
                        <SelectItem value="Hyundai">Hyundai</SelectItem>
                        <SelectItem value="Kia">Kia</SelectItem>
                        <SelectItem value="Otro">Otro</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="model">Modelo *</Label>
                    <Input
                      id="model"
                      placeholder="Ej: Corolla, Civic, Versa"
                      value={formData.model}
                      onChange={(e) => handleChange("model", e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="year">Año *</Label>
                    <Input
                      id="year"
                      type="number"
                      placeholder="2020"
                      min="1990"
                      max={new Date().getFullYear() + 1}
                      value={formData.year}
                      onChange={(e) => handleChange("year", e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="price">Precio (MXN) *</Label>
                    <Input
                      id="price"
                      type="number"
                      placeholder="250000"
                      min="0"
                      value={formData.price}
                      onChange={(e) => handleChange("price", e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="mileage">Kilometraje *</Label>
                    <Input
                      id="mileage"
                      type="number"
                      placeholder="50000"
                      min="0"
                      value={formData.mileage}
                      onChange={(e) => handleChange("mileage", e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="transmission">Transmisión *</Label>
                    <Select
                      value={formData.transmission}
                      onValueChange={(value) => handleChange("transmission", value)}
                      required
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona transmisión" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Manual">Manual</SelectItem>
                        <SelectItem value="Automática">Automática</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="fuelType">Tipo de Combustible *</Label>
                    <Select
                      value={formData.fuelType}
                      onValueChange={(value) => handleChange("fuelType", value)}
                      required
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona combustible" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Gasolina">Gasolina</SelectItem>
                        <SelectItem value="Diésel">Diésel</SelectItem>
                        <SelectItem value="Eléctrico">Eléctrico</SelectItem>
                        <SelectItem value="Híbrido">Híbrido</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="color">Color *</Label>
                    <Input
                      id="color"
                      placeholder="Ej: Blanco, Negro, Gris"
                      value={formData.color}
                      onChange={(e) => handleChange("color", e.target.value)}
                      required
                    />
                  </div>
                </div>

                {/* Ubicación y contacto */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="location">Ubicación *</Label>
                    <Input
                      id="location"
                      placeholder="Ciudad de México"
                      value={formData.location}
                      onChange={(e) => handleChange("location", e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">Teléfono de Contacto *</Label>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="55-1234-5678"
                      value={formData.phone}
                      onChange={(e) => handleChange("phone", e.target.value)}
                      required
                    />
                  </div>
                </div>

                {/* Descripción */}
                <div className="space-y-2">
                  <Label htmlFor="description">Descripción *</Label>
                  <Textarea
                    id="description"
                    placeholder="Describe tu auto: estado general, características especiales, historial de mantenimiento, etc."
                    rows={5}
                    value={formData.description}
                    onChange={(e) => handleChange("description", e.target.value)}
                    required
                  />
                  <p className="text-xs text-muted-foreground">
                    Una buena descripción ayuda a vender más rápido. Incluye detalles importantes.
                  </p>
                </div>

                {/* Imágenes */}
                <div className="space-y-2">
                  <Label>Fotos del Auto</Label>
<div className="space-y-3">
  <input
    type="file"
    multiple
    accept="image/*"
    onChange={(e) => {
      if (e.target.files) {
        setImages(Array.from(e.target.files))
      }
    }}
  />

  {images.length > 0 && (
    <div className="text-sm text-green-600">
      {images.length} imagen(es) seleccionada(s)
    </div>
  )}
</div>
                </div>

                {/* Botones */}
                <div className="flex gap-4">
                  <Button
                    type="button"
                    variant="outline"
                    className="flex-1 bg-transparent"
                    onClick={() => router.back()}
                  >
                    Cancelar
                  </Button>
                  <Button type="submit" className="flex-1">
                    Publicar Anuncio
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
