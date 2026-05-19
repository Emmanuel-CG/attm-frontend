"use client"

import { useAuth } from "@/lib/auth-context"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import {
  Search,
  MoreVertical,
  CheckCircle,
  XCircle,
} from "lucide-react"

const API_URL = "https://attm-backend-main-gvzubr.laravel.cloud/api"

interface AdminUser {
  id: number
  name: string
  email: string
  phone: string
  verified: boolean
  totalCars: number
  status: string
}

export default function UsuariosAdmin() {
  const { isAdmin, token, user } = useAuth()
  const router = useRouter()

  const [users, setUsers] = useState<AdminUser[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    if (user && !isAdmin) {
      router.push("/login")
    }
  }, [user, isAdmin, router])

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch(`${API_URL}/admin/users`, {
          headers: {
            Accept: "application/json",
            Authorization: token || "",
          },
        })

        const data = await res.json()

        console.log(data)

        setUsers(data)
      } catch (error) {
        console.error(error)
      } finally {
        setLoading(false)
      }
    }

    if (token) {
      fetchUsers()
    }
  }, [token])

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (loading) {
    return (
      <div className="p-8">
        <p>Cargando usuarios...</p>
      </div>
    )
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          Gestión de Usuarios
        </h1>

        <p className="text-gray-600 mt-2">
          Administra todos los usuarios
        </p>
      </div>

      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />

          <input
            type="text"
            placeholder="Buscar usuario..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg"
          />
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-6 py-3 text-left">
                Nombre
              </th>

              <th className="px-6 py-3 text-left">
                Email
              </th>

              <th className="px-6 py-3 text-left">
                Teléfono
              </th>

              <th className="px-6 py-3 text-left">
                Verificado
              </th>

              <th className="px-6 py-3 text-left">
                Autos
              </th>

              <th className="px-6 py-3 text-left">
                Estado
              </th>

              <th className="px-6 py-3 text-center">
                Acciones
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-200">
            {filteredUsers.map((user) => (
              <tr
                key={user.id}
                className="hover:bg-gray-50"
              >
                <td className="px-6 py-4">
                  {user.name}
                </td>

                <td className="px-6 py-4">
                  {user.email}
                </td>

                <td className="px-6 py-4">
                  {user.phone}
                </td>

                <td className="px-6 py-4">
                  {user.verified ? (
                    <div className="flex items-center gap-2 text-green-600">
                      <CheckCircle className="w-4 h-4" />
                      Sí
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 text-red-600">
                      <XCircle className="w-4 h-4" />
                      No
                    </div>
                  )}
                </td>

                <td className="px-6 py-4">
                  {user.totalCars}
                </td>

                <td className="px-6 py-4">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      user.status === "activo"
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {user.status}
                  </span>
                </td>

                <td className="px-6 py-4 text-center">
                  <button>
                    <MoreVertical className="w-5 h-5 text-gray-500" />
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