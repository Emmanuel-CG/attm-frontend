"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
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
import {
  Car,
  Lock,
  CheckCircle,
  Eye,
  EyeOff,
  AlertCircle,
  Mail,
} from "lucide-react"

export default function RestablecerContrasenaPage() {
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState("")
  const [tokenValid, setTokenValid] = useState(true)

  const router = useRouter()
  const searchParams = useSearchParams()

  const token = searchParams.get("token") || ""
  const email = searchParams.get("email") || ""

  useEffect(() => {
    if (!token) setTokenValid(false)
  }, [token])

  const validatePassword = (password: string): string | null => {
    if (password.length < 8) return "Al menos 8 caracteres"
    if (!/[A-Z]/.test(password)) return "Debe tener una mayúscula"
    if (!/[0-9]/.test(password)) return "Debe tener un número"
    return null
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    const passwordError = validatePassword(password)
    if (passwordError) return setError(passwordError)

    if (password !== confirmPassword)
      return setError("Las contraseñas no coinciden")

    setLoading(true)

    try {
      const res = await fetch("https://attm-backend-main-gvzubr.laravel.cloud/api/reset-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({ token, password }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || "Error al actualizar")
      } else {
        setSuccess(true)
        setTimeout(() => router.push("/login"), 3000)
      }
    } catch {
      setError("Error de conexión")
    }

    setLoading(false)
  }

  // 🔴 TOKEN INVÁLIDO
  if (!tokenValid) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-white p-4">
        <Card className="w-full max-w-md text-center">
          <CardHeader>
            <div className="flex justify-center mb-4">
              <div className="bg-red-100 p-3 rounded-full">
                <AlertCircle className="h-8 w-8 text-red-600" />
              </div>
            </div>
            <CardTitle>Enlace inválido</CardTitle>
            <CardDescription>
              Solicita un nuevo enlace de recuperación
            </CardDescription>
          </CardHeader>
          <CardFooter className="flex flex-col gap-3">
            <Link href="/recuperar-contrasena">
              <Button className="w-full">Recuperar contraseña</Button>
            </Link>
            <Link href="/login">
              <Button variant="outline" className="w-full">
                Volver al login
              </Button>
            </Link>
          </CardFooter>
        </Card>
      </div>
    )
  }

  // 🟢 ÉXITO (YA CON DISEÑO BONITO)
  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-white p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <div className="bg-green-100 p-3 rounded-full">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
            </div>

            <CardTitle className="text-2xl font-bold">
              Contraseña Actualizada
            </CardTitle>

            <CardDescription>
              Tu contraseña ha sido restablecida correctamente
            </CardDescription>
          </CardHeader>

          <CardContent>
            <p className="text-sm text-center text-muted-foreground">
              Serás redirigido al inicio de sesión...
            </p>
          </CardContent>

          <CardFooter>
            <Link href="/login" className="w-full">
              <Button className="w-full">
                Ir a Iniciar Sesión
              </Button>
            </Link>
          </CardFooter>
        </Card>
      </div>
    )
  }

  // 🟢 FORMULARIO PRINCIPAL (TU DISEÑO)
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-white p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="bg-primary/10 p-3 rounded-full">
              <Car className="h-8 w-8 text-primary" />
            </div>
          </div>

          <CardTitle className="text-2xl font-bold">
            Nueva Contraseña
          </CardTitle>

          <CardDescription>
            Ingresa tu nueva contraseña para tu cuenta
          </CardDescription>
        </CardHeader>

        {email && (
          <div className="px-6 pb-2">
            <div className="flex items-center gap-2 bg-blue-50 border border-blue-200 rounded-lg p-3">
              <Mail className="h-4 w-4 text-blue-600" />
              <span className="text-sm text-blue-700">
                Restableciendo contraseña para: <strong>{email}</strong>
              </span>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div>
              <Label>Nueva contraseña</Label>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2"
                >
                  {showPassword ? <EyeOff /> : <Eye />}
                </button>
              </div>
            </div>

            <div>
              <Label>Confirmar contraseña</Label>
              <div className="relative">
                <Input
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
                <button
                  type="button"
                  onClick={() =>
                    setShowConfirmPassword(!showConfirmPassword)
                  }
                  className="absolute right-3 top-2"
                >
                  {showConfirmPassword ? <EyeOff /> : <Eye />}
                </button>
              </div>
            </div>

            {error && (
              <p className="text-red-500 text-sm text-center">
                {error}
              </p>
            )}
          </CardContent>

          <CardFooter>
            <Button className="w-full" disabled={loading}>
              {loading ? "Actualizando..." : "Restablecer Contraseña"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}