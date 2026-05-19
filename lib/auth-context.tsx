  "use client"

  import axios from "axios"
  import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
  import type { User } from "./types"

  const API_BASE_URL = "https://attm-backend-main-gvzubr.laravel.cloud/api"

  const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
  })

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
      const res = await api.post("/login", {
        email,
        password,
      })

      const data = res.data

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
  const register = async (
    email: string,
    password: string,
    name: string,
    phone: string
  ): Promise<boolean> => {
    try {
      const res = await api.post("/register", {
        email,
        password,
        name,
        phone,
      })

      const data = res.data

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
      const res = await api.post(
        "/update-profile",
        updatedUser,
        {
          headers: {
            Authorization: token,
          },
        }
      )

      const data = res.data

      setUser(data.user)
      localStorage.setItem("automarket_user", JSON.stringify(data.user))

      return true
    } catch (e) {
      console.error("Error updateProfile:", e)
      return false
    }
  }

    // 5. Logout: Conecta con AuthController@logout
  const logout = async () => {
    try {
      if (token) {
        await api.post(
          "/logout",
          {},
          {
            headers: {
              Authorization: token,
            },
          }
        )
      }
    } catch (e) {
      console.error("Error logout:", e)
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
