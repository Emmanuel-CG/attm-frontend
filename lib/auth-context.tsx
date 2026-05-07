"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import type { User } from "./types"

const API_BASE_URL = "http://localhost:8000/api"

interface AuthContextType {
  user: User | null
  token: string | null
  login: (email: string, password: string) => Promise<boolean>
  register: (email: string, password: string, name: string, phone: string) => Promise<boolean>
  logout: () => void
  updateProfile: (updatedUser: Partial<User>) => Promise<boolean>
  isAuthenticated: boolean
  isAdmin: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)

  // 1. Hidratación: Recuperar sesión al cargar la página
  useEffect(() => {
    const savedUser = localStorage.getItem("automarket_user")
    const savedToken = localStorage.getItem("authToken")
    if (savedUser && savedToken) {
      setUser(JSON.parse(savedUser))
      setToken(savedToken)
    }
  }, [])

  // 2. Login: Conecta con AuthController@login
  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const res = await fetch(`${API_BASE_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "Accept": "application/json" },
        body: JSON.stringify({ email, password }),
      })
      const data = await res.json()
      if (!res.ok) return false

      setToken(data.token)
      setUser(data.user)
      localStorage.setItem("authToken", data.token)
      localStorage.setItem("automarket_user", JSON.stringify(data.user))
      return true
    } catch (e) {
      console.error("Error login:", e)
      return false
    }
  }

  // 3. Registro: Conecta con AuthController@register
  const register = async (email: string, password: string, name: string, phone: string): Promise<boolean> => {
    try {
      const res = await fetch(`${API_BASE_URL}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "Accept": "application/json" },
        body: JSON.stringify({ email, password, name, phone }),
      })
      const data = await res.json()
      if (!res.ok) return false

      // Login automático tras registro
      setToken(data.token)
      setUser(data.user)
      localStorage.setItem("authToken", data.token)
      localStorage.setItem("automarket_user", JSON.stringify(data.user))
      return true
    } catch (e) {
      console.error("Error register:", e)
      return false
    }
  }

  // 4. Update: Conecta con AuthController@updateProfile
  const updateProfile = async (updatedUser: Partial<User>): Promise<boolean> => {
    if (!token) return false
    try {
      const res = await fetch(`${API_BASE_URL}/update-profile`, {
        method: "POST", // O PUT según tu ruta de Laravel
        headers: { 
          "Content-Type": "application/json",
          "Accept": "application/json",
          "Authorization": token // Token directo sin Bearer
        },
        body: JSON.stringify(updatedUser),
      })
      const data = await res.json()
      if (!res.ok) return false

      setUser(data.user)
      localStorage.setItem("automarket_user", JSON.stringify(data.user))
      return true
    } catch (e) {
      console.error("Error updateProfile:", e)
      return false
    }
  }

  // 5. Logout: Conecta con AuthController@logout
  const logout = () => {
    if (token) {
      fetch(`${API_BASE_URL}/logout`, {
        method: "POST",
        headers: { 
          "Authorization": token,
          "Accept": "application/json"
        }
      })
    }
    setUser(null)
    setToken(null)
    localStorage.removeItem("automarket_user")
    localStorage.removeItem("authToken")
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        login,
        register,
        logout,
        updateProfile,
        isAuthenticated: !!user,
        isAdmin: user?.role === "admin",
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error("useAuth must be used within an AuthProvider")
  return context
}
