"use client"

import type React from "react"
import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Car, Mail, ArrowLeft, CheckCircle } from "lucide-react"

export default function RecuperarContrasenaPage() {
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    if (!email.includes("@")) {
      setError("Por favor ingresa un correo válido")
      setLoading(false)
      return
    }

    try {
      const res = await fetch("https://attm-backend-main-gvzubr.laravel.cloud/api/forgot-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify({ email }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || "Error al enviar el correo")
      } else {
        setSent(true)
      }

    } catch (err) {
      setError("No se pudo conectar con el servidor")
    }

    setLoading(false)
  }

  if (sent) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-white p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <div className="bg-green-100 p-3 rounded-full">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
            </div>
            <CardTitle>Correo Enviado</CardTitle>
            <CardDescription>
              Hemos enviado un enlace a <strong>{email}</strong>
            </CardDescription>
          </CardHeader>

          <CardContent>
            <p className="text-sm text-center text-muted-foreground">
              Revisa tu bandeja de entrada o spam.
            </p>
          </CardContent>

          <CardFooter className="flex flex-col gap-3">
            <Button
              variant="outline"
              onClick={() => {
                setSent(false)
                setEmail("")
              }}
            >
              Enviar otro correo
            </Button>

            <Link href="/login">
              <Button className="w-full">Volver al login</Button>
            </Link>
          </CardFooter>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-white p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="bg-primary/10 p-3 rounded-full">
              <Car className="h-8 w-8 text-primary" />
            </div>
          </div>
          <CardTitle>Recuperar Contraseña</CardTitle>
          <CardDescription>
            Ingresa tu correo y te enviaremos un enlace
          </CardDescription>
        </CardHeader>

        <form onSubmit={handleSubmit}>
          <CardContent>
            <Label>Correo Electrónico</Label>
            <Input
              type="email"
              placeholder="correo@ejemplo.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            {error && (
              <p className="text-sm text-red-500 mt-2">{error}</p>
            )}
          </CardContent>

          <CardFooter className="flex flex-col gap-3">
            <Button type="submit" disabled={loading}>
              {loading ? "Enviando..." : "Enviar enlace"}
            </Button>

            <Link href="/login">
              <span className="text-sm flex items-center gap-2 justify-center cursor-pointer">
                <ArrowLeft className="h-4 w-4" />
                Volver
              </span>
            </Link>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}