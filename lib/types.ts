export interface Car {
  id: number
  brand: string
  model: string
  year: number
  price: number
  mileage: number
  transmission: "Manual" | "Automática"
  fuelType: "Gasolina" | "Diésel" | "Eléctrico" | "Híbrido"
  color: string
  description: string
  images: string[]
  location: string
  sellerId: number
  sellerName: string
  sellerPhone: string
  createdAt: Date
  featured?: boolean
  verified?: boolean
  status?: "pending" | "approved" | "rejected"
  sold?: boolean
  soldAt?: Date
}
export interface User {
  id: string
  email: string
  name: string
  phone: string
  createdAt: Date
  role: "user" | "admin"
  verified?: boolean
  totalCars?: number
  bio?: string
  avatar?: string
  location?: string
  responseTime?: string
  ine?: string
  curp?: string
  rfc?: string
  domicile?: string
}

export interface Contact {
  id: string
  carId: string
  buyerId: string
  buyerName: string
  buyerEmail: string
  buyerPhone: string
  message: string
  createdAt: Date
  status: "new" | "read" | "replied"
  offeredPrice?: number
}
