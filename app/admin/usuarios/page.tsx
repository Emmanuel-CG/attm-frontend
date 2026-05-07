"use client"

import { useAuth } from "@/lib/auth-context"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { Search, MoreVertical, CheckCircle, XCircle } from "lucide-react"

interface AdminUser {
  id: string
  name: string
  email: string
  phone: string
  createdAt: string
  verified: boolean
  totalCars: number
  status: "activo" | "suspendido"
}

export default function UsuariosAdmin() {
  const { isAdmin } = useAuth()
  const router = useRouter()
  const [users, setUsers] = useState<AdminUser[]>([])
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    if (!isAdmin) {
      router.push("/login")
      return
    }

    // Datos simulados
    setUsers([
      {
        id: "1",
        name: "Juan Pérez",
        email: "juan@example.com",
        phone: "55-1234-5678",
        createdAt: "2024-01-15",
        verified: true,
        totalCars: 3,
        status: "activo",
      },
      {
        id: "2",
        name: "María González",
        email: "maria@example.com",
        phone: "33-9876-5432",
        createdAt: "2024-01-20",
        verified: false,
        totalCars: 1,
        status: "activo",
      },
      {
        id: "3",
        name: "Carlos Ramírez",
        email: "carlos@example.com",
        phone: "81-5555-1234",
        createdAt: "2024-02-01",
        verified: true,
        totalCars: 2,
        status: "suspendido",
      },
    ])
  }, [isAdmin, router])

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  if (!isAdmin) return null

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Gestión de Usuarios</h1>
        <p className="text-gray-600 mt-2">Administra y supervisa todos los usuarios de la plataforma</p>
      </div>

      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar por nombre o email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
          />
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Nombre</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Email</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Teléfono</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Verificado</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Autos</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Estado</th>
              <th className="px-6 py-3 text-center text-sm font-semibold text-gray-900">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredUsers.map((user) => (
              <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 text-sm font-medium text-gray-900">{user.name}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{user.email}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{user.phone}</td>
                <td className="px-6 py-4 text-sm">
                  {user.verified ? (
                    <div className="flex items-center gap-2 text-green-600">
                      <CheckCircle className="w-4 h-4" />
                      <span>Sí</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 text-orange-600">
                      <XCircle className="w-4 h-4" />
                      <span>No</span>
                    </div>
                  )}
                </td>
                <td className="px-6 py-4 text-sm text-gray-900 font-medium">{user.totalCars}</td>
                <td className="px-6 py-4 text-sm">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      user.status === "activo" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                    }`}
                  >
                    {user.status === "activo" ? "Activo" : "Suspendido"}
                  </span>
                </td>
                <td className="px-6 py-4 text-center">
                  <button className="text-gray-400 hover:text-gray-600">
                    <MoreVertical className="w-5 h-5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
