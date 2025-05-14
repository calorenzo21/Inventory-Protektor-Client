import { ChartAreaInteractive } from "@/components/chart-area-interactive"
import { SectionCards } from "@/components/section-cards"

import { ChartTopSales } from "@/components/chart-top-sales"
import { ChartLowProducts } from "@/components/chart-low-products"

const chartData1 = [
  { model: "PRD-110", units: 186, fill: "#fdffb6" },
  { model: "PAR-220", units: 305, fill: "#a0c4ff" },
  { model: "PARE-220", units: 237, fill: "#a0c4ff" },
  { model: "PEE-110", units: 73, fill: "#ffadad" },
  { model: "PARE-110", units: 209, fill: "#ffadad" },
]

const productos = [
  { producto: "PRDP-110", stock: 63, minimo: 100 },
  { producto: "PEEP-110", stock: 50, minimo: 100 },
  { producto: "PEEPHD-110", stock: 69, minimo: 100 },
  { producto: "PARPHD-220", stock: 59, minimo: 100 },
  { producto: "PARDA-110", stock: 30, minimo: 100 },
  { producto: "PARTE-110", stock: 69, minimo: 100 },
  // { producto: "SPD-1320", stock: 38, minimo: 50 },
]

const chartData2 = productos.map((item) => ({
  producto: item.producto,
  stock: item.stock,
  minimo: item.minimo,
  diferencia: item.minimo - item.stock,
}))

export default function Page() {
  const columnCount = chartData2.length > 4 ? "lg:col-span-2 2xl:col-span-1" : "lg:col-span-1"
  return (
    <div className="flex flex-1 flex-col">
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
          <SectionCards />
          <div className="px-4 lg:px-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className={`${columnCount}`}>
                <ChartTopSales chartData={chartData1} />
            </div>
            <div className={`${columnCount}`}>
              <ChartLowProducts chartData={chartData2} />
            </div>
          </div>
          <div className="px-4 lg:px-6">
            <ChartAreaInteractive />
          </div>
        </div>
      </div>
    </div>
  )
}