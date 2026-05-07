"use client"

import type { Contact } from "@/lib/types"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Mail, Phone, MessageSquare, DollarSign } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { es } from "date-fns/locale"
import { useState } from "react"

interface ContactCardProps {
  contact: Contact
  onReply?: () => void
}

export function ContactCard({ contact, onReply }: ContactCardProps) {
  const [status, setStatus] = useState(contact.status)

  const getStatusColor = (status: string) => {
    switch (status) {
      case "new":
        return "bg-blue-100 text-blue-800"
      case "read":
        return "bg-yellow-100 text-yellow-800"
      case "replied":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "new":
        return "Nuevo"
      case "read":
        return "Leído"
      case "replied":
        return "Respondido"
      default:
        return status
    }
  }

  const handleReplyClick = async () => {
    if (status === "new") {
      // Cambiar estado localmente
      setStatus("read")

      // Actualizar en backend
      try {
        const token = localStorage.getItem("authToken") || ""
        const res = await fetch(`http://localhost:8000/api/contacts/${contact.id}/read`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            "Authorization": token, // token directo sin Bearer
          },
        })

        if (!res.ok) {
          throw new Error("No se pudo actualizar el estado en el servidor")
        }
      } catch (err) {
        console.error("Error al actualizar el estado del contacto", err)
        // Opcional: revertir cambio local si falla
        setStatus("new")
      }
    }

    onReply?.()
  }

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-3">
          <div>
            <h3 className="font-semibold text-lg">{contact.buyerName}</h3>
            <p className="text-xs text-muted-foreground">
              {formatDistanceToNow(new Date(contact.createdAt), { addSuffix: true, locale: es })}
            </p>
          </div>
          <Badge className={getStatusColor(status)}>{getStatusLabel(status)}</Badge>
        </div>

        <p className="text-sm mb-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
          "{contact.message}"
        </p>

        <div className="grid grid-cols-2 gap-2 mb-4 text-sm">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Mail className="h-4 w-4" />
            <span className="truncate">{contact.buyerEmail}</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Phone className="h-4 w-4" />
            <span>{contact.buyerPhone}</span>
          </div>
        </div>

        {contact.offeredPrice && (
          <div className="mb-4 p-3 bg-green-50 rounded-lg border border-green-200 flex items-center gap-2">
            <DollarSign className="h-4 w-4 text-green-600" />
            <span className="font-semibold text-green-800">
              Oferta: ${contact.offeredPrice.toLocaleString("es-MX")}
            </span>
          </div>
        )}

        <div className="flex gap-2">
          <Button variant="default" className="flex-1" onClick={handleReplyClick}>
            <MessageSquare className="h-4 w-4 mr-2" />
            Responder
          </Button>
          <Button variant="outline" className="flex-1 bg-transparent">
            <Phone className="h-4 w-4 mr-2" />
            Llamar
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
