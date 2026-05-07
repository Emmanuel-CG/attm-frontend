"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Phone, Mail, User, CheckCircle } from "lucide-react"
import { ContactModal } from "@/components/contact-modal"
import { CallModal } from "@/components/call-modal"

export function ContactSection({ car }: { car: any }) {
  const [showMessageModal, setShowMessageModal] = useState(false)
  const [showCallModal, setShowCallModal] = useState(false)

  return (
    <>
      <Card className="sticky top-24">
        <CardContent className="p-6">
          <h2 className="text-xl font-bold mb-4">Información del Vendedor</h2>
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
                <p className="text-sm text-muted-foreground">Teléfono</p>
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
    </>
  )
}
