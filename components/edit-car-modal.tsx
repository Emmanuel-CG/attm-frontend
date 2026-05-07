"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { Car } from "@/lib/types"

const API_BASE_URL = "http://localhost:8000/api"

interface EditCarModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  car: Car
  onSave: (updatedCar: Partial<Car>) => void
}

export function EditCarModal({ open, onOpenChange, car, onSave }: EditCarModalProps) {
  const [formData, setFormData] = useState({
    brand: car.brand,
    model: car.model,
    year: car.year,
    price: car.price,
    mileage: car.mileage,
    transmission: car.transmission,
    fuelType: car.fuelType,
    color: car.color,
    description: car.description,
    location: car.location,
  })

  const [isSaving, setIsSaving] = useState(false)

  const handleSave = async () => {
    try {
      setIsSaving(true)

      // Recuperar el token guardado
      const token = localStorage.getItem("authToken")


      if (!token) {
        alert("No se encontró el token")
        return
      }

      const res = await fetch(`${API_BASE_URL}/cars/${car.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: token, // tu backend NO usa Bearer
        },
        body: JSON.stringify(formData),
      })

      if (!res.ok) {
        alert("Error al guardar los cambios")
        return
      }

      const updatedCar = await res.json()

      onSave(updatedCar) // mandar el auto actualizado al padre
      onOpenChange(false)
    } catch (err) {
      console.error(err)
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Editar Auto</DialogTitle>
          <DialogDescription>Actualiza la información de tu auto publicado</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Marca</Label>
              <Input
                value={formData.brand}
                onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                placeholder="Toyota"
              />
            </div>
            <div>
              <Label>Modelo</Label>
              <Input
                value={formData.model}
                onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                placeholder="Corolla"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label>Año</Label>
              <Input
                type="number"
                value={formData.year}
                onChange={(e) => setFormData({ ...formData, year: Number(e.target.value) })}
              />
            </div>
            <div>
              <Label>Precio</Label>
              <div className="flex items-center">
                <span className="text-muted-foreground mr-2">$</span>
                <Input
                  type="number"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                  placeholder="0"
                />
              </div>
            </div>
            <div>
              <Label>Kilometraje</Label>
              <div className="flex items-center">
                <Input
                  type="number"
                  value={formData.mileage}
                  onChange={(e) => setFormData({ ...formData, mileage: Number(e.target.value) })}
                  placeholder="0"
                />
                <span className="text-muted-foreground ml-2">km</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div> 
              <Label>Transmisión</Label>
<Select
  value={formData.transmission}
  onValueChange={(value) =>
    setFormData({ ...formData, transmission: value as Car["transmission"] })
  }
>
  <SelectTrigger>
    <SelectValue placeholder="Selecciona una opción" />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="Manual">Manual</SelectItem>
    <SelectItem value="Automática">Automática</SelectItem>
  </SelectContent>
</Select>

            </div>
            <div>
              <Label>Combustible</Label>
<Select
  value={formData.fuelType}
  onValueChange={(value) =>
    setFormData({ ...formData, fuelType: value as Car["fuelType"] })
  }
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
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Color</Label>
              <Input
                value={formData.color}
                onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                placeholder="Blanco"
              />
            </div>
            <div>
              <Label>Ubicación</Label>
              <Input
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                placeholder="Ciudad de México"
              />
            </div>
          </div>

          <div>
            <Label>Descripción</Label>
            <Textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Describe las características y condiciones del auto..."
              className="h-24"
            />
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-4 border-t">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button onClick={handleSave} disabled={isSaving} className="bg-blue-600 hover:bg-blue-700">
            {isSaving ? "Guardando..." : "Guardar Cambios"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
