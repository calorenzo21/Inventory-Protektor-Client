"use client"
import { Bar, BarChart, CartesianGrid, LabelList, XAxis } from "recharts"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

type ChartTopSalesProps = {
    chartData: { model: string; units: number; fill: string }[]; // Definición del tipo de los datos
}

const chartConfig = {
  units: {
    label: "Unidades",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig

export function ChartTopSales({ chartData }: ChartTopSalesProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Top 5 más Vendidos</CardTitle>
        <CardDescription>Abril - 2025</CardDescription>
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
              dataKey="model"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              fontSize={14}
              tickFormatter={(value) => {
                return value.length > 10 ? value.slice(0, 10) + "..." : value
              }}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Bar dataKey="units" radius={8} opacity={1}>
              <LabelList
                position="top"
                offset={12}
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
