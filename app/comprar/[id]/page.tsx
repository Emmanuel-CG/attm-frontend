import { CarDetailContent } from "@/components/car-detail-content"
const API_BASE_URL = "https://attm-backend-main-gvzubr.laravel.cloud/api"

async function getCar(id: string) {
  const res = await fetch(`${API_BASE_URL}/cars/${id}`, {
    cache: "no-store",
  })

  if (!res.ok) return null

  return res.json()
}

export default async function CarDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {

  const { id } = await params

  const car = await getCar(id)

  if (!car) {

    return (
      <div>
        Auto no encontrado
      </div>
    )
  }

  return <CarDetailContent car={car} />
}
