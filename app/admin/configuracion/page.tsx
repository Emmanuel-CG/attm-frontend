"use client"

import { useAuth } from "@/lib/auth-context"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { Save, AlertCircle } from "lucide-react"

interface Settings {
  platformName: string
  commissionPercentage: number
  maxListingsPerUser: number
  verificationRequired: boolean
  autoApproveListings: boolean
  minUserReputation: number
  maxImageSize: number
  allowedFormats: string[]
}

export default function ConfiguracionAdmin() {
  const { isAdmin } = useAuth()
  const router = useRouter()
  const [settings, setSettings] = useState<Settings>({
    platformName: "AutoMarket México",
    commissionPercentage: 5,
    maxListingsPerUser: 10,
    verificationRequired: true,
    autoApproveListings: false,
    minUserReputation: 0,
    maxImageSize: 5,
    allowedFormats: ["jpg", "png", "webp"],
  })
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    if (!isAdmin) {
      router.push("/login")
    }
  }, [isAdmin, router])

  const handleChange = (field: keyof Settings, value: any) => {
    setSettings((prev) => ({
      ...prev,
      [field]: value,
    }))
    setSaved(false)
  }

  const handleSave = () => {
    localStorage.setItem("automarket_settings", JSON.stringify(settings))
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  if (!isAdmin) return null

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Configuración del Sistema</h1>
        <p className="text-gray-600 mt-2">Personaliza los parámetros principales de AutoMarket México</p>
      </div>

      <div className="max-w-3xl">
        {saved && (
          <div className="mb-6 p-4 bg-green-100 border border-green-300 rounded-lg flex items-center gap-3">
            <div className="w-5 h-5 bg-green-600 rounded-full flex items-center justify-center text-white text-sm">
              ✓
            </div>
            <p className="text-green-800 font-medium">Configuración guardada correctamente</p>
          </div>
        )}

        <div className="space-y-6">
          {/* Información General */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Información General</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">Nombre de la Plataforma</label>
                <input
                  type="text"
                  value={settings.platformName}
                  onChange={(e) => handleChange("platformName", e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Políticas de Comisiones */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Políticas de Comisiones</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">Porcentaje de Comisión (%)</label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={settings.commissionPercentage}
                  onChange={(e) => handleChange("commissionPercentage", Number.parseFloat(e.target.value))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">Máximo de Anuncios por Usuario</label>
                <input
                  type="number"
                  min="1"
                  value={settings.maxListingsPerUser}
                  onChange={(e) => handleChange("maxListingsPerUser", Number.parseInt(e.target.value))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Políticas de Verificación */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Políticas de Verificación</h2>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="verificationRequired"
                  checked={settings.verificationRequired}
                  onChange={(e) => handleChange("verificationRequired", e.target.checked)}
                  className="w-4 h-4 rounded border-gray-300"
                />
                <label htmlFor="verificationRequired" className="text-sm font-medium text-gray-900">
                  Verificación de Usuario Requerida
                </label>
              </div>
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="autoApproveListings"
                  checked={settings.autoApproveListings}
                  onChange={(e) => handleChange("autoApproveListings", e.target.checked)}
                  className="w-4 h-4 rounded border-gray-300"
                />
                <label htmlFor="autoApproveListings" className="text-sm font-medium text-gray-900">
                  Aprobar Anuncios Automáticamente
                </label>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">Reputación Mínima de Usuario</label>
                <input
                  type="number"
                  min="0"
                  value={settings.minUserReputation}
                  onChange={(e) => handleChange("minUserReputation", Number.parseInt(e.target.value))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Políticas de Archivos */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Políticas de Archivos</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">Tamaño Máximo de Imagen (MB)</label>
                <input
                  type="number"
                  min="1"
                  value={settings.maxImageSize}
                  onChange={(e) => handleChange("maxImageSize", Number.parseInt(e.target.value))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">Formatos Permitidos</label>
                <p className="text-sm text-gray-600 mb-2">{settings.allowedFormats.join(", ")}</p>
              </div>
            </div>
          </div>

          {/* Botón Guardar */}
          <div className="flex gap-4">
            <button
              onClick={handleSave}
              className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              <Save className="w-5 h-5" />
              Guardar Cambios
            </button>
          </div>

          {/* Nota de Seguridad */}
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg flex gap-3">
            <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-blue-800">
              <span className="font-semibold">Nota:</span> Los cambios en la configuración afectan toda la plataforma.
              Asegúrate de revisar cuidadosamente antes de guardar.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
