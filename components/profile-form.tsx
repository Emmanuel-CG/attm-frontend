"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { AlertCircle, CheckCircle, Lock, Eye, EyeOff } from 'lucide-react'

export function ProfileForm() {
  const { user, updateProfile } = useAuth()
  const [isEditing, setIsEditing] = useState(false)
  const [isVerifying, setIsVerifying] = useState(false)
  const [isChangingPassword, setIsChangingPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [passwordSuccess, setPasswordSuccess] = useState(false)
  const [passwordError, setPasswordError] = useState("")
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })
  const [formData, setFormData] = useState({
    name: user?.name || "",
    phone: user?.phone || "",
    location: user?.location || "",
    bio: user?.bio || "",
  })

  const [documents, setDocuments] = useState({
    curp: user?.curp || "",
    rfc: user?.rfc || "",
    domicile: user?.domicile || "",
  })

  useEffect(() => {
  if (user) {
    setFormData({
      name: user.name || "",
      phone: user.phone || "",
      location: user.location || "",
      bio: user.bio || "",
    })

    setDocuments({
      curp: user.curp || "",
      rfc: user.rfc || "",
      domicile: user.domicile || "",
    })
  }
}, [user])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleDocChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setDocuments((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      // Verificar si tiene todos los documentos para marcar como verificado
      const isVerified = !!(documents.curp && documents.rfc && documents.domicile)
      await updateProfile({ ...formData, ...documents, verified: isVerified })
      setSuccess(true)
      setIsEditing(false)
      setIsVerifying(false)
      setTimeout(() => setSuccess(false), 3000)
    } catch (error) {
      console.error("Error updating profile:", error)
    } finally {
      setLoading(false)
    }
  }

  const validatePassword = (password: string) => {
    const hasMinLength = password.length >= 8
    const hasUpperCase = /[A-Z]/.test(password)
    const hasNumber = /[0-9]/.test(password)
    return { hasMinLength, hasUpperCase, hasNumber, isValid: hasMinLength && hasUpperCase && hasNumber }
  }

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault()
    setPasswordError("")
    setPasswordSuccess(false)

    // Validar que la contraseña actual no esté vacía
    if (!passwordData.currentPassword) {
      setPasswordError("Debes ingresar tu contraseña actual")
      return
    }

    // Validar nueva contraseña
    const validation = validatePassword(passwordData.newPassword)
    if (!validation.isValid) {
      setPasswordError("La nueva contraseña debe tener al menos 8 caracteres, una mayúscula y un número")
      return
    }

    // Validar que las contraseñas coincidan
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordError("Las contraseñas no coinciden")
      return
    }

    setLoading(true)
    try {
      // Simular cambio de contraseña
      await new Promise((resolve) => setTimeout(resolve, 1000))
      setPasswordSuccess(true)
      setIsChangingPassword(false)
      setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" })
      setTimeout(() => setPasswordSuccess(false), 3000)
    } catch (error) {
      setPasswordError("Error al cambiar la contraseña")
    } finally {
      setLoading(false)
    }
  }

  if (!user) return null

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6">
      {success && (
        <div className="flex items-center gap-3 p-4 bg-green-50 border border-green-200 rounded-lg">
          <CheckCircle className="h-5 w-5 text-green-600" />
          <p className="text-green-700">Perfil actualizado correctamente</p>
        </div>
      )}

      <div className="bg-white rounded-lg border border-border p-6 space-y-4">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-lg font-semibold text-foreground">Información del Perfil</h3>
            <p className="text-sm text-muted-foreground">Actualiza tu información personal</p>
          </div>
          {!isEditing && (
            <Button onClick={() => setIsEditing(true)} variant="outline">
              Editar
            </Button>
          )}
        </div>

        {isEditing ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Nombre</label>
              <Input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Teléfono</label>
              <Input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Ubicación</label>
              <Input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                className="w-full"
                placeholder="Ciudad o Región"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Biografía</label>
              <textarea
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                rows={4}
                placeholder="Cuéntanos sobre ti..."
              />
            </div>

            <div className="flex gap-2 pt-2">
              <Button type="submit" disabled={loading}>
                {loading ? "Guardando..." : "Guardar Cambios"}
              </Button>
              <Button type="button" variant="outline" onClick={() => setIsEditing(false)}>
                Cancelar
              </Button>
            </div>
          </form>
        ) : (
          <div className="space-y-3">
            <div className="flex justify-between items-start py-3 border-b border-border/50">
              <span className="text-sm text-muted-foreground">Nombre</span>
              <span className="font-medium text-foreground">{user.name}</span>
            </div>
            <div className="flex justify-between items-start py-3 border-b border-border/50">
              <span className="text-sm text-muted-foreground">Email</span>
              <span className="font-medium text-foreground">{user.email}</span>
            </div>
            <div className="flex justify-between items-start py-3 border-b border-border/50">
              <span className="text-sm text-muted-foreground">Teléfono</span>
              <span className="font-medium text-foreground">{user.phone}</span>
            </div>
            <div className="flex justify-between items-start py-3 border-b border-border/50">
              <span className="text-sm text-muted-foreground">Ubicación</span>
              <span className="font-medium text-foreground">{user.location || "No especificado"}</span>
            </div>
            <div className="flex justify-between items-start py-3">
              <span className="text-sm text-muted-foreground">Biografía</span>
              <span className="font-medium text-foreground text-right">{user.bio || "No especificada"}</span>
            </div>
          </div>
        )}
      </div>

      {/* Información de Verificación */}
      <div className="bg-white rounded-lg border border-border p-6 space-y-4">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-lg font-semibold text-foreground">Verificación y Seguridad</h3>
            <p className="text-sm text-muted-foreground">Carga tus documentos de verificación</p>
          </div>
          {!isVerifying && (
            <Button onClick={() => setIsVerifying(true)} variant="outline">
              Cargar Documentos
            </Button>
          )}
        </div>
        
        <div className="space-y-3">
          {user.verified ? (
            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <span className="text-sm font-medium text-green-900">Cuenta verificada</span>
              </div>
              <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full font-medium">Verificado</span>
            </div>
          ) : (
            <div className="flex items-center justify-between p-3 bg-amber-50 rounded-lg border border-amber-200">
              <div className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-amber-600" />
                <span className="text-sm font-medium text-amber-900">Cuenta no verificada</span>
              </div>
              <span className="text-xs bg-amber-100 text-amber-700 px-2 py-1 rounded-full font-medium">Pendiente</span>
            </div>
          )}
          
          <div className="text-sm text-muted-foreground">
            <p className="font-medium text-foreground mb-3">Información de la Cuenta</p>
            <p className="mb-1">Miembro desde {new Date(user.createdAt).toLocaleDateString("es-MX", { year: "numeric", month: "long", day: "numeric" })}</p>
            <p className="mb-1">Autos publicados: {user.totalCars || 0}</p>
            <p className="mb-4">Tiempo de respuesta: {user.responseTime || "Sin historial"}</p>
          </div>
        </div>

        {isVerifying ? (
          <form onSubmit={(e) => { e.preventDefault(); handleSubmit(e) }} className="mt-6 pt-6 border-t border-border space-y-6">
            <p className="font-medium text-foreground">Ingresa tus Datos de Verificacion</p>
            
            <div className="bg-gray-50 p-4 rounded-lg space-y-3">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-8 w-8 rounded-full bg-primary/10">
                    <span className="text-sm font-semibold text-primary">1</span>
                  </div>
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-foreground">CURP</h4>
                  <p className="text-sm text-muted-foreground mt-1">Clave Unica de Registro de Poblacion</p>
                </div>
              </div>
              <div className="ml-11">
                <Input
                  type="text"
                  name="curp"
                  value={documents.curp}
                  onChange={handleDocChange}
                  placeholder="Ej: ABCD123456HDFRRN01"
                  maxLength={18}
                  className="w-full uppercase"
                />
                {documents.curp && documents.curp.length === 18 && (
                  <p className="text-xs text-green-600 mt-1 flex items-center gap-1">
                    <CheckCircle className="h-3 w-3" />
                    CURP registrado
                  </p>
                )}
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg space-y-3">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-8 w-8 rounded-full bg-primary/10">
                    <span className="text-sm font-semibold text-primary">2</span>
                  </div>
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-foreground">RFC</h4>
                  <p className="text-sm text-muted-foreground mt-1">Registro Federal de Contribuyentes</p>
                </div>
              </div>
              <div className="ml-11">
                <Input
                  type="text"
                  name="rfc"
                  value={documents.rfc}
                  onChange={handleDocChange}
                  placeholder="Ej: ABC123456XYZ"
                  maxLength={13}
                  className="w-full uppercase"
                />
                {documents.rfc && documents.rfc.length >= 12 && (
                  <p className="text-xs text-green-600 mt-1 flex items-center gap-1">
                    <CheckCircle className="h-3 w-3" />
                    RFC registrado
                  </p>
                )}
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg space-y-3">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-8 w-8 rounded-full bg-primary/10">
                    <span className="text-sm font-semibold text-primary">3</span>
                  </div>
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-foreground">Comprobante de Domicilio</h4>
                  <p className="text-sm text-muted-foreground mt-1">Ingresa tu direccion completa</p>
                </div>
              </div>
              <div className="ml-11 space-y-3">
                <Input
                  type="text"
                  name="domicile"
                  value={documents.domicile}
                  onChange={handleDocChange}
                  placeholder="Calle, numero exterior e interior"
                  className="w-full"
                />
                {documents.domicile && (
                  <p className="text-xs text-green-600 mt-1 flex items-center gap-1">
                    <CheckCircle className="h-3 w-3" />
                    Domicilio registrado
                  </p>
                )}
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <Button type="submit" disabled={loading}>
                {loading ? "Guardando..." : "Guardar Datos"}
              </Button>
              <Button type="button" variant="outline" onClick={() => setIsVerifying(false)}>
                Cancelar
              </Button>
            </div>
          </form>
        ) : (
          <div className="mt-6 pt-6 border-t border-border">
            <p className="font-medium text-foreground mb-4">Datos de Verificacion</p>
            <div className="space-y-2">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-sm text-foreground">CURP</span>
                {documents.curp ? (
                  <span className="text-sm font-mono font-medium text-foreground">{documents.curp.toUpperCase()}</span>
                ) : (
                  <span className="text-xs text-muted-foreground">Pendiente</span>
                )}
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-sm text-foreground">RFC</span>
                {documents.rfc ? (
                  <span className="text-sm font-mono font-medium text-foreground">{documents.rfc.toUpperCase()}</span>
                ) : (
                  <span className="text-xs text-muted-foreground">Pendiente</span>
                )}
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-sm text-foreground">Domicilio</span>
                {documents.domicile ? (
                  <span className="text-sm font-medium text-foreground">{documents.domicile}</span>
                ) : (
                  <span className="text-xs text-muted-foreground">Pendiente</span>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Cambio de Contraseña */}
      <div className="bg-white rounded-lg border border-border p-6 space-y-4">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-lg font-semibold text-foreground">Cambiar Contraseña</h3>
            <p className="text-sm text-muted-foreground">Actualiza tu contraseña de acceso</p>
          </div>
          {!isChangingPassword && (
            <Button onClick={() => setIsChangingPassword(true)} variant="outline">
              <Lock className="h-4 w-4 mr-2" />
              Cambiar
            </Button>
          )}
        </div>

        {passwordSuccess && (
          <div className="flex items-center gap-3 p-4 bg-green-50 border border-green-200 rounded-lg">
            <CheckCircle className="h-5 w-5 text-green-600" />
            <p className="text-green-700">Contraseña actualizada correctamente</p>
          </div>
        )}

        {isChangingPassword ? (
          <form onSubmit={handlePasswordChange} className="space-y-4 pt-4">
            {passwordError && (
              <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-lg">
                <AlertCircle className="h-5 w-5 text-red-600" />
                <p className="text-red-700">{passwordError}</p>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Contraseña Actual</label>
              <div className="relative">
                <Input
                  type={showCurrentPassword ? "text" : "password"}
                  value={passwordData.currentPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                  className="w-full pr-10"
                  placeholder="Ingresa tu contraseña actual"
                />
                <button
                  type="button"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showCurrentPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Nueva Contraseña</label>
              <div className="relative">
                <Input
                  type={showNewPassword ? "text" : "password"}
                  value={passwordData.newPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                  className="w-full pr-10"
                  placeholder="Ingresa tu nueva contraseña"
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {passwordData.newPassword && (
                <div className="mt-2 space-y-1">
                  <p className={`text-xs flex items-center gap-1 ${passwordData.newPassword.length >= 8 ? "text-green-600" : "text-muted-foreground"}`}>
                    {passwordData.newPassword.length >= 8 ? <CheckCircle className="h-3 w-3" /> : <AlertCircle className="h-3 w-3" />}
                    Minimo 8 caracteres
                  </p>
                  <p className={`text-xs flex items-center gap-1 ${/[A-Z]/.test(passwordData.newPassword) ? "text-green-600" : "text-muted-foreground"}`}>
                    {/[A-Z]/.test(passwordData.newPassword) ? <CheckCircle className="h-3 w-3" /> : <AlertCircle className="h-3 w-3" />}
                    Al menos una mayuscula
                  </p>
                  <p className={`text-xs flex items-center gap-1 ${/[0-9]/.test(passwordData.newPassword) ? "text-green-600" : "text-muted-foreground"}`}>
                    {/[0-9]/.test(passwordData.newPassword) ? <CheckCircle className="h-3 w-3" /> : <AlertCircle className="h-3 w-3" />}
                    Al menos un numero
                  </p>
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Confirmar Nueva Contraseña</label>
              <div className="relative">
                <Input
                  type={showConfirmPassword ? "text" : "password"}
                  value={passwordData.confirmPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                  className="w-full pr-10"
                  placeholder="Confirma tu nueva contraseña"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {passwordData.confirmPassword && passwordData.newPassword !== passwordData.confirmPassword && (
                <p className="text-xs text-red-600 mt-1 flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  Las contraseñas no coinciden
                </p>
              )}
              {passwordData.confirmPassword && passwordData.newPassword === passwordData.confirmPassword && (
                <p className="text-xs text-green-600 mt-1 flex items-center gap-1">
                  <CheckCircle className="h-3 w-3" />
                  Las contraseñas coinciden
                </p>
              )}
            </div>

            <div className="flex gap-2 pt-2">
              <Button type="submit" disabled={loading}>
                {loading ? "Guardando..." : "Cambiar Contraseña"}
              </Button>
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => {
                  setIsChangingPassword(false)
                  setPasswordError("")
                  setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" })
                }}
              >
                Cancelar
              </Button>
            </div>
          </form>
        ) : (
          <div className="text-sm text-muted-foreground">
            <p>Tu contraseña fue actualizada por ultima vez hace 30 dias.</p>
            <p className="mt-2">Recomendamos cambiar tu contraseña regularmente para mantener tu cuenta segura.</p>
          </div>
        )}
      </div>
    </div>
  )
}
