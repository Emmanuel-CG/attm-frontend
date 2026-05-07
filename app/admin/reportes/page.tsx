"use client"

import { useAuth } from "@/lib/auth-context"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { TrendingUp, AlertCircle, Users } from "lucide-react"

interface Report {
  id: string
  type: string
  description: string
  date: string
  severity: "low" | "medium" | "high"
  resolved: boolean
}

export default function ReportesAdmin() {
  const { isAdmin } = useAuth()
  const router = useRouter()
  const [reports, setReports] = useState<Report[]>([])

  useEffect(() => {
    if (!isAdmin) {
      router.push("/login")
      return
    }

    // Datos simulados de reportes
    setReports([
      {
        id: "1",
        type: "Anuncio Fraudulento",
        description: "Posible estafa detectada en anuncio de Toyota Corolla",
        date: "2024-11-12",
        severity: "high",
        resolved: false,
      },
      {
        id: "2",
        type: "Usuario Sospechoso",
        description: "Múltiples reportes contra usuario user123",
        date: "2024-11-11",
        severity: "high",
        resolved: false,
      },
      {
        id: "3",
        type: "Fotos Inapropiadas",
        description: "Imágenes no relacionadas con el vehículo",
        date: "2024-11-10",
        severity: "medium",
        resolved: true,
      },
      {
        id: "4",
        type: "Precio Sospechoso",
        description: "Precio significativamente bajo comparado con el mercado",
        date: "2024-11-09",
        severity: "low",
        resolved: true,
      },
    ])
  }, [isAdmin, router])

  const getSeverityColor = (severity: Report["severity"]) => {
    switch (severity) {
      case "high":
        return "bg-red-100 text-red-800 border-red-300"
      case "medium":
        return "bg-orange-100 text-orange-800 border-orange-300"
      case "low":
        return "bg-yellow-100 text-yellow-800 border-yellow-300"
    }
  }

  const getSeverityLabel = (severity: Report["severity"]) => {
    switch (severity) {
      case "high":
        return "Alta"
      case "medium":
        return "Media"
      case "low":
        return "Baja"
    }
  }

  if (!isAdmin) return null

  const activeReports = reports.filter((r) => !r.resolved).length
  const resolvedReports = reports.filter((r) => r.resolved).length

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Reportes y Alertas</h1>
        <p className="text-gray-600 mt-2">Monitorea problemas, fraudes y violaciones de políticas</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm mb-1">Reportes Activos</p>
              <p className="text-3xl font-bold text-red-600">{activeReports}</p>
            </div>
            <AlertCircle className="w-12 h-12 text-red-600 opacity-20" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm mb-1">Resueltos</p>
              <p className="text-3xl font-bold text-green-600">{resolvedReports}</p>
            </div>
            <TrendingUp className="w-12 h-12 text-green-600 opacity-20" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm mb-1">Total</p>
              <p className="text-3xl font-bold text-blue-600">{reports.length}</p>
            </div>
            <Users className="w-12 h-12 text-blue-600 opacity-20" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">Lista de Reportes</h2>
        </div>
        <div className="space-y-4 p-6">
          {reports.map((report) => (
            <div
              key={report.id}
              className={`border-l-4 p-4 rounded-r-lg ${
                report.resolved ? "bg-gray-50 border-gray-300" : getSeverityColor(report.severity)
              }`}
            >
              <div className="flex items-start justify-between mb-2">
                <div>
                  <p className="font-semibold text-gray-900">{report.type}</p>
                  <p className="text-sm text-gray-600 mt-1">{report.description}</p>
                </div>
                <div className="flex gap-2">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      report.resolved ? "bg-green-100 text-green-800" : "bg-blue-100 text-blue-800"
                    }`}
                  >
                    {report.resolved ? "Resuelto" : "Pendiente"}
                  </span>
                  <span className="px-3 py-1 text-xs font-medium bg-gray-200 text-gray-800 rounded-full">
                    {getSeverityLabel(report.severity)}
                  </span>
                </div>
              </div>
              <p className="text-xs text-gray-500">Reportado: {report.date}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
