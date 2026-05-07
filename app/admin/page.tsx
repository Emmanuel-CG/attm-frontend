"use client"

import { useAuth } from "@/lib/auth-context"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { Users, Car, FileText, TrendingUp } from "lucide-react"

export default function AdminDashboard() {
  const { isAdmin } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isAdmin) {
      router.push("/login")
    }
  }, [isAdmin, router])

  if (!isAdmin) return null

  const stats = [
    { label: "Usuarios", value: "1,248", icon: Users, color: "bg-blue-600" },
    { label: "Autos Listados", value: "856", icon: Car, color: "bg-green-600" },
    { label: "Ingresos", value: "$125,400", icon: TrendingUp, color: "bg-purple-600" },
    { label: "Reportes", value: "12", icon: FileText, color: "bg-orange-600" },
  ]

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-2">Bienvenido al panel de administración de AutoMarket México</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <div key={stat.label} className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm mb-1">{stat.label}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                </div>
                <div className={`${stat.color} p-3 rounded-lg`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
          )
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Autos Recientes Pendientes</h2>
          <div className="space-y-4">
            {[
              { id: 1, brand: "Toyota", model: "Corolla", seller: "Juan Pérez", date: "Hace 2 horas" },
              { id: 2, brand: "Honda", model: "Civic", seller: "María González", date: "Hace 5 horas" },
            ].map((car) => (
              <div key={car.id} className="border-l-4 border-blue-600 pl-4 py-2">
                <p className="font-semibold text-gray-900">
                  {car.brand} {car.model}
                </p>
                <p className="text-sm text-gray-600">Por: {car.seller}</p>
                <p className="text-xs text-gray-500">{car.date}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Usuarios Nuevos</h2>
          <div className="space-y-4">
            {[
              { id: 1, name: "Carlos López", email: "carlos@example.com", date: "Hoy" },
              { id: 2, name: "Ana Rodríguez", email: "ana@example.com", date: "Ayer" },
            ].map((user) => (
              <div key={user.id} className="border-l-4 border-green-600 pl-4 py-2">
                <p className="font-semibold text-gray-900">{user.name}</p>
                <p className="text-sm text-gray-600">{user.email}</p>
                <p className="text-xs text-gray-500">{user.date}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
