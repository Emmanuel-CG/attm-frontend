"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { BarChart3, Users, Car, FileText, Settings, LogOut } from "lucide-react"
import { useAuth } from "@/lib/auth-context"
import { useRouter } from "next/navigation"

export function AdminSidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const { logout, user } = useAuth()

  const menuItems = [
    { href: "/admin", icon: BarChart3, label: "Dashboard" },
    { href: "/admin/usuarios", icon: Users, label: "Usuarios" },
    { href: "/admin/autos", icon: Car, label: "Autos" },
    { href: "/admin/reportes", icon: FileText, label: "Reportes" },
    { href: "/admin/configuracion", icon: Settings, label: "Configuración" },
  ]

  return (
    <aside className="w-64 bg-gradient-to-b from-blue-600 to-blue-700 text-white min-h-screen p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-2">AutoMarket</h1>
        <p className="text-blue-100 text-sm">Panel de Administración</p>
      </div>

      <nav className="space-y-2 mb-8">
        {menuItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                isActive ? "bg-blue-500 text-white" : "text-blue-100 hover:bg-blue-600"
              }`}
            >
              <Icon className="w-5 h-5" />
              <span>{item.label}</span>
            </Link>
          )
        })}
      </nav>

      <div className="border-t border-blue-500 pt-6 space-y-4">
        <div className="px-4 py-3 bg-blue-500 rounded-lg">
          <p className="text-xs text-blue-100">Usuario Admin</p>
          <p className="text-sm font-semibold truncate">{user?.email}</p>
        </div>
<button
  onClick={async () => {

    await logout()

    router.push("/login")
  }}
  className="w-full flex items-center gap-3 px-4 py-3 text-blue-100 hover:bg-blue-600 rounded-lg transition-colors"
>
  <LogOut className="w-5 h-5" />

  <span>
    Cerrar Sesión
  </span>
</button>
      </div>
    </aside>
  )
}
