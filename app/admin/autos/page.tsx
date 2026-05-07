"use client"

import { useAuth } from "@/lib/auth-context"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { Search, CheckCircle, XCircle, Clock } from "lucide-react"

interface AdminCar {
  id: string
  brand: string
  model: string
  year: number
  price: number
  seller: string
  status: "pending" | "approved" | "rejected"
  createdAt: string
}

export default function AutosAdmin() {
  const { isAdmin } = useAuth()
  const router = useRouter()
  const [cars, setCars] = useState<AdminCar[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState<"all" | "pending" | "approved" | "rejected">("all")

  useEffect(() => {
    if (!isAdmin) {
      router.push("/login")
      return
    }

    // Datos simulados
    setCars([
      {
        id: "1",
        brand: "Toyota",
        model: "Corolla",
        year: 2020,
        price: 285000,
        seller: "Juan Pérez",
        status: "pending",
        createdAt: "2024-11-10",
      },
      {
        id: "2",
        brand: "Honda",
        model: "Civic",
        year: 2019,
        price: 295000,
        seller: "María González",
        status: "approved",
        createdAt: "2024-11-08",
      },
      {
        id: "3",
        brand: "Nissan",
        model: "Versa",
        year: 2021,
        price: 235000,
        seller: "Carlos Ramírez",
        status: "pending",
        createdAt: "2024-11-12",
      },
    ])
  }, [isAdmin, router])

  const filteredCars = cars.filter((car) => {
    const matchesSearch =
      car.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
      car.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
      car.seller.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = filterStatus === "all" || car.status === filterStatus
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

  if (!isAdmin) return null

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Gestión de Autos</h1>
        <p className="text-gray-600 mt-2">Revisa, aprueba o rechaza los anuncios de autos publicados</p>
      </div>

      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar por marca, modelo o vendedor..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
            />
          </div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as any)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
          >
            <option value="all">Todos los estados</option>
            <option value="pending">Pendiente</option>
            <option value="approved">Aprobado</option>
            <option value="rejected">Rechazado</option>
          </select>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Auto</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Año</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Precio</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Vendedor</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Estado</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Fecha</th>
              <th className="px-6 py-3 text-center text-sm font-semibold text-gray-900">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredCars.map((car) => (
              <tr key={car.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 text-sm font-medium text-gray-900">
                  {car.brand} {car.model}
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">{car.year}</td>
                <td className="px-6 py-4 text-sm font-medium text-gray-900">${car.price.toLocaleString()}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{car.seller}</td>
                <td className="px-6 py-4 text-sm">
                  <div className="flex items-center gap-2">
                    {getStatusIcon(car.status)}
                    <span className="capitalize">{getStatusLabel(car.status)}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">{car.createdAt}</td>
                <td className="px-6 py-4 text-center">
                  {car.status === "pending" && (
                    <div className="flex gap-2 justify-center">
                      <button className="px-3 py-1 bg-green-600 text-white text-xs rounded hover:bg-green-700 transition-colors">
                        Aprobar
                      </button>
                      <button className="px-3 py-1 bg-red-600 text-white text-xs rounded hover:bg-red-700 transition-colors">
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
