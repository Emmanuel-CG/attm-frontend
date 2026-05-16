"use client"

import { useAuth } from "@/lib/auth-context"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import {
  Search,
  CheckCircle,
  XCircle,
  Clock,
} from "lucide-react"

const API_URL = "http://localhost:8000/api"

interface AdminCar {
  id: number
  brand: string
  model: string
  year: number
  price: number
  seller: string
  status: "pending" | "approved" | "rejected"
  createdAt: string
}

export default function AutosAdmin() {
  const { isAdmin, token, user } = useAuth()
  const router = useRouter()

  const [cars, setCars] = useState<AdminCar[]>([])
  const [loading, setLoading] = useState(true)

  const [searchTerm, setSearchTerm] = useState("")

  const [filterStatus, setFilterStatus] = useState<
    "all" | "pending" | "approved" | "rejected"
  >("all")

  useEffect(() => {
    if (user && !isAdmin) {
      router.push("/login")
    }
  }, [user, isAdmin, router])

  useEffect(() => {
    const fetchCars = async () => {
      try {
        const res = await fetch(`${API_URL}/admin/cars`, {
          headers: {
            Accept: "application/json",
            Authorization: token || "",
          },
        })

        const data = await res.json()

        console.log(data)

        setCars(data)
      } catch (error) {
        console.error(error)
      } finally {
        setLoading(false)
      }
    }

    if (token) {
      fetchCars()
    }
  }, [token])

  const filteredCars = cars.filter((car) => {
    const matchesSearch =
      car.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
      car.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
      car.seller.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus =
      filterStatus === "all" || car.status === filterStatus

    return matchesSearch && matchesStatus
  })

  const getStatusIcon = (status: AdminCar["status"]) => {
    switch (status) {
      case "approved":
        return <CheckCircle className="w-5 h-5 text-green-600" />

      case "rejected":
        return <XCircle className="w-5 h-5 text-red-600" />

      case "pending":
        return <Clock className="w-5 h-5 text-orange-600" />
    }
  }

  const getStatusLabel = (status: AdminCar["status"]) => {
    switch (status) {
      case "approved":
        return "Aprobado"

      case "rejected":
        return "Rechazado"

      case "pending":
        return "Pendiente"
    }
  }

  const updateStatus = async (
    id: number,
    status: "approved" | "rejected"
  ) => {
    try {
      const res = await fetch(
        `${API_URL}/admin/cars/${id}/status`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: token || "",
          },
          body: JSON.stringify({ status }),
        }
      )

      if (!res.ok) return

      setCars((prev) =>
        prev.map((car) =>
          car.id === id ? { ...car, status } : car
        )
      )
    } catch (error) {
      console.error(error)
    }
  }

  if (loading) {
    return (
      <div className="p-8">
        <p>Cargando autos...</p>
      </div>
    )
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          Gestión de Autos
        </h1>

        <p className="text-gray-600 mt-2">
          Administra los autos publicados
        </p>
      </div>

      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />

            <input
              type="text"
              placeholder="Buscar auto..."
              value={searchTerm}
              onChange={(e) =>
                setSearchTerm(e.target.value)
              }
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg"
            />
          </div>

          <select
            value={filterStatus}
            onChange={(e) =>
              setFilterStatus(e.target.value as any)
            }
            className="px-4 py-2 border border-gray-300 rounded-lg"
          >
            <option value="all">
              Todos los estados
            </option>

            <option value="pending">
              Pendiente
            </option>

            <option value="approved">
              Aprobado
            </option>

            <option value="rejected">
              Rechazado
            </option>
          </select>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-6 py-3 text-left">
                Auto
              </th>

              <th className="px-6 py-3 text-left">
                Año
              </th>

              <th className="px-6 py-3 text-left">
                Precio
              </th>

              <th className="px-6 py-3 text-left">
                Vendedor
              </th>

              <th className="px-6 py-3 text-left">
                Estado
              </th>

              <th className="px-6 py-3 text-left">
                Fecha
              </th>

              <th className="px-6 py-3 text-center">
                Acciones
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-200">
            {filteredCars.map((car) => (
              <tr
                key={car.id}
                className="hover:bg-gray-50"
              >
                <td className="px-6 py-4">
                  {car.brand} {car.model}
                </td>

                <td className="px-6 py-4">
                  {car.year}
                </td>

                <td className="px-6 py-4">
                  ${car.price.toLocaleString()}
                </td>

                <td className="px-6 py-4">
                  {car.seller}
                </td>

                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    {getStatusIcon(car.status)}

                    {getStatusLabel(car.status)}
                  </div>
                </td>

                <td className="px-6 py-4">
                  {car.createdAt}
                </td>

                <td className="px-6 py-4 text-center">
                  {car.status === "pending" && (
                    <div className="flex gap-2 justify-center">
                      <button
                        onClick={() =>
                          updateStatus(
                            car.id,
                            "approved"
                          )
                        }
                        className="px-3 py-1 bg-green-600 text-white text-xs rounded"
                      >
                        Aprobar
                      </button>

                      <button
                        onClick={() =>
                          updateStatus(
                            car.id,
                            "rejected"
                          )
                        }
                        className="px-3 py-1 bg-red-600 text-white text-xs rounded"
                      >
                        Rechazar
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}