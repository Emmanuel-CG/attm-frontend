"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Navbar } from "@/components/navbar"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ContactCard } from "@/components/contact-card"
import { mockCars, mockContacts } from "@/lib/mock-data"
import type { Contact } from "@/lib/types"
import { Filter, MessageSquare } from "lucide-react"

export default function ContactosPage() {
  const { isAuthenticated, user } = useAuth()
  const router = useRouter()
  const [contacts, setContacts] = useState<Contact[]>([])
  const [filter, setFilter] = useState<"all" | "new" | "read" | "replied">("all")
  const [replyingTo, setReplyingTo] = useState<string | null>(null)
  const [replyMessage, setReplyMessage] = useState("")

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login")
    }
  }, [isAuthenticated, router])

  useEffect(() => {
    // Obtener los IDs de los autos del usuario
    const userCarIds = mockCars.filter((car) => car.sellerId === user?.id).map((car) => car.id)

    // Filtrar contactos para estos autos
    const userContacts = mockContacts.filter((contact) => userCarIds.includes(contact.carId))
    setContacts(userContacts)
  }, [user?.id])

  if (!isAuthenticated) {
    return null
  }

  const filteredContacts = filter === "all" ? contacts : contacts.filter((contact) => contact.status === filter)

  const newContactsCount = contacts.filter((c) => c.status === "new").length
  const totalUnread = newContactsCount

  const handleReply = (contactId: string) => {
    setReplyingTo(contactId)
  }

  const sendReply = (contactId: string) => {
    // Actualizar estado del contacto a "replied"
    setContacts(contacts.map((c) => (c.id === contactId ? { ...c, status: "replied" as const } : c)))
    setReplyingTo(null)
    setReplyMessage("")
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <Navbar />

      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <MessageSquare className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold">Contactos Recibidos</h1>
          </div>
          <p className="text-muted-foreground">Gestiona los mensajes y ofertas de potenciales compradores</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="p-4">
              <p className="text-sm text-muted-foreground mb-1">Total de Contactos</p>
              <p className="text-3xl font-bold">{contacts.length}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <p className="text-sm text-muted-foreground mb-1">Nuevos</p>
              <div className="flex items-center justify-between">
                <p className="text-3xl font-bold text-blue-600">{newContactsCount}</p>
                {newContactsCount > 0 && <Badge className="bg-blue-600">!</Badge>}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <p className="text-sm text-muted-foreground mb-1">Leídos</p>
              <p className="text-3xl font-bold text-yellow-600">{contacts.filter((c) => c.status === "read").length}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <p className="text-sm text-muted-foreground mb-1">Respondidos</p>
              <p className="text-3xl font-bold text-green-600">
                {contacts.filter((c) => c.status === "replied").length}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Filter Buttons */}
        <div className="flex gap-2 mb-6 flex-wrap">
          <Button variant={filter === "all" ? "default" : "outline"} onClick={() => setFilter("all")} className="gap-2">
            <Filter className="h-4 w-4" />
            Todos ({contacts.length})
          </Button>
          <Button variant={filter === "new" ? "default" : "outline"} onClick={() => setFilter("new")}>
            Nuevos ({newContactsCount})
          </Button>
          <Button variant={filter === "read" ? "default" : "outline"} onClick={() => setFilter("read")}>
            Leídos ({contacts.filter((c) => c.status === "read").length})
          </Button>
          <Button variant={filter === "replied" ? "default" : "outline"} onClick={() => setFilter("replied")}>
            Respondidos ({contacts.filter((c) => c.status === "replied").length})
          </Button>
        </div>

        {/* Contacts List */}
        {filteredContacts.length > 0 ? (
          <div className="space-y-4">
            {filteredContacts.map((contact) => (
              <div key={contact.id}>
                <ContactCard contact={contact} onReply={() => handleReply(contact.id)} />

                {/* Reply Form */}
                {replyingTo === contact.id && (
                  <Card className="mt-4 border-primary bg-blue-50">
                    <CardContent className="p-4">
                      <h4 className="font-semibold mb-3">Tu Respuesta</h4>
                      <textarea
                        value={replyMessage}
                        onChange={(e) => setReplyMessage(e.target.value)}
                        placeholder="Escribe tu respuesta aquí..."
                        className="w-full p-3 border border-blue-200 rounded-lg mb-3 focus:outline-none focus:ring-2 focus:ring-primary bg-white"
                        rows={4}
                      />
                      <div className="flex gap-2">
                        <Button onClick={() => sendReply(contact.id)} disabled={!replyMessage.trim()}>
                          Enviar Respuesta
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => {
                            setReplyingTo(null)
                            setReplyMessage("")
                          }}
                        >
                          Cancelar
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            ))}
          </div>
        ) : (
          <Card className="text-center py-16">
            <CardContent>
              <div className="bg-muted w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <MessageSquare className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-xl font-semibold mb-2">No hay contactos</h3>
              <p className="text-muted-foreground">Los mensajes de potenciales compradores aparecerán aquí</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
