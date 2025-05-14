"use client"
import { TrendingUp } from "lucide-react"
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, LabelList } from "recharts"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

type ChartLowProductsProps = {
    chartData: { producto: string; stock: number; minimo: number; diferencia: number }[]; // Recibe chartData
  }

// Configuración de los colores
const chartConfig = {
  stock: {
    label: "Stock",
    color: "#ffadad",
  },
  diferencia: {
    label: "Diferencia",
    color: "#a0c4ff",
  },
} satisfies ChartConfig

export function ChartLowProducts({ chartData }: ChartLowProductsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Productos con Bajo Stock</CardTitle>
        <CardDescription>Productos y su Stock comparado con el Stock Mínimo</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="w-full max-h-[300px]">
          <BarChart
            accessibilityLayer
            data={chartData}
            margin={{
              top: 20,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="producto"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              className="text-[14px]"
            />
            <ChartTooltip content={<ChartTooltipContent hideLabel />}/>
            <Legend/>

            {/* Barra para el Stock */}
            <Bar
              dataKey="stock"
              stackId="a"
              fill="#ffadad"
              radius={[0, 0, 4, 4]}
            >
              <LabelList
                dataKey="stock"
                position="top"
                offset={8}
                className="fill-foreground"
                fontSize={12}
              />
            </Bar>

            {/* Barra para el Stock Mínimo */}
            <Bar
              dataKey="diferencia"
              stackId="a"
              fill="#a0c4ff"
              radius={[4, 4, 0, 0]}
            >
              <LabelList
                dataKey="minimo"
                position="top"
                offset={8}
                className="fill-foreground"
                fontSize={16}
              />
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}