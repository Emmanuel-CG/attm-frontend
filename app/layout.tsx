import type React from "react"
import type { Metadata } from "next"
import { Analytics } from "@vercel/analytics/next"
import { AuthProvider } from "@/lib/auth-context"
import { Suspense } from "react"
import "./globals.css"
import { Toaster } from "@/components/ui/toaster"

export const metadata: Metadata = {
  title: "AutoMarket México",
  description: "La mejor plataforma para comprar y vender autos usados en México",
  generator: "v0.app",

  icons: {
    icon: "/Icono.png",
    shortcut: "/Icono.png",
    apple: "/Icono.png",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es">
      <body className="font-sans antialiased">
        <Suspense fallback={null}>
          <AuthProvider>{children}</AuthProvider>
        </Suspense>
        <Toaster />
        <Analytics />
      </body>
    </html>
  )
}
