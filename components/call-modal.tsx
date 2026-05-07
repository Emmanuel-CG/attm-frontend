"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { X, Phone, Copy, Check } from "lucide-react"

interface CallModalProps {
  sellerName: string
  sellerPhone: string
  onClose: () => void
}

export function CallModal({ sellerName, sellerPhone, onClose }: CallModalProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText(sellerPhone)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <div>
            <CardTitle>Contactar Vendedor</CardTitle>
            <CardDescription>{sellerName}</CardDescription>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose} className="h-8 w-8">
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-blue-50 rounded-lg p-6 text-center">
            <p className="text-sm text-muted-foreground mb-2">Número de Teléfono</p>
            <p className="text-3xl font-bold text-primary mb-4">{sellerPhone}</p>
            <Button onClick={handleCopy} variant="outline" className="w-full gap-2 bg-transparent">
              {copied ? (
                <>
                  <Check className="h-4 w-4" />
                  Copiado
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4" />
                  Copiar Número
                </>
              )}
            </Button>
          </div>

          <div className="space-y-3">
            <p className="text-sm text-muted-foreground text-center">
              Puedes llamar o enviar un mensaje por WhatsApp a este número
            </p>
            <div className="flex gap-2">
              <Button className="flex-1 bg-transparent" variant="outline">
                <Phone className="h-4 w-4 mr-2" />
                Llamar
              </Button>
              <Button className="flex-1 bg-green-600 hover:bg-green-700">WhatsApp</Button>
            </div>
          </div>

          <Button onClick={onClose} variant="outline" className="w-full bg-transparent">
            Cerrar
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
