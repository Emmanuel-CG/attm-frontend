"use client"

import { useAuth } from "@/lib/auth-context"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { Users, Car, FileText, TrendingUp } from "lucide-react"

const API_URL = "http://localhost:8000/api"

export default function AdminDashboard() {
  const { user, isAdmin, token } = useAuth()
  const router = useRouter()

  const [stats, setStats] = useState({
    users: 0,
    cars: 0,
    reports: 0,
    revenue: 0,
  })

  const [recentCars, setRecentCars] = useState<any[]>([])
  const [recentUsers, setRecentUsers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user && !isAdmin) {
      router.push("/login")
    }
  }, [user, isAdmin, router])

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await fetch(`${API_URL}/admin/dashboard`, {
          headers: {
            Accept: "application/json",
            Authorization: token || "",
          },
        })

        const data = await res.json()

        console.log(data)

        setStats(data.stats)
        setRecentCars(data.recentCars)
        setRecentUsers(data.recentUsers)
      } catch (error) {
        console.error(error)
      } finally {
        setLoading(false)
      }
    }

    if (token) {
      fetchDashboard()
    }
  }, [token])

  if (loading) {
    return (
      <div className="p-8">
        <p>Cargando dashboard...</p>
      </div>
    )
  }

  const dashboardStats = [
    {
      label: "Usuarios",
      value: stats.users,
      icon: Users,
      color: "bg-blue-600",
    },
    {
      label: "Autos Listados",
      value: stats.cars,
      icon: Car,
      color: "bg-green-600",
    },
    {
      label: "Reportes",
      value: stats.reports,
      icon: FileText,
      color: "bg-orange-600",
    },
  ]

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          Dashboard
        </h1>

        <p className="text-gray-600 mt-2">
          Bienvenido al panel de administración
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {dashboardStats.map((stat) => {
          const Icon = stat.icon

          return (
            <div
              key={stat.label}
              className="bg-white rounded-lg shadow p-6"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm mb-1">
                    {stat.label}
                  </p>

                  <p className="text-2xl font-bold text-gray-900">
                    {stat.value}
                  </p>
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
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            Autos Recientes
          </h2>

          <div className="space-y-4">
            {recentCars.map((car) => (
              <div
                key={car.id}
                className="border-l-4 border-blue-600 pl-4 py-2"
              >
                <p className="font-semibold text-gray-900">
                  {car.brand} {car.model}
                </p>

                <p className="text-sm text-gray-600">
                  Por: {car.seller}
                </p>

                <p className="text-xs text-gray-500">
                  {car.created_at}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            Usuarios Nuevos
          </h2>

          <div className="space-y-4">
            {recentUsers.map((user) => (
              <div
                key={user.id}
                className="border-l-4 border-green-600 pl-4 py-2"
              >
                <p className="font-semibold text-gray-900">
                  {user.name}
                </p>

                <p className="text-sm text-gray-600">
                  {user.email}
                </p>

                <p className="text-xs text-gray-500">
                  {user.created_at}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}