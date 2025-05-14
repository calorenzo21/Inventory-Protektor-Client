"use client"

import * as React from "react"
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts"

import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

// Datos de unidades vendidas por mes
const chartData = [
  { month: "Enero", units: 911 },
  { month: "Febrero", units: 901 },
  { month: "Marzo", units: 849 },
  { month: "Abril", units: 1182 },
]

const chartConfig = {
  units: {
    label: "Unidades",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig

export function ChartAreaInteractive() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Unidades Vendidas por Mes</CardTitle>
        <CardDescription>Enero - Abril 2025</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="aspect-auto h-[250px] w-full">
          <AreaChart data={chartData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
            <defs>
              {/* Definición del gradiente */}
              <linearGradient id="fillUnits" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#a0c4ff" stopOpacity={1.0} />
                <stop offset="95%" stopColor="#a0c4ff" stopOpacity={0.1} />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
            />
            <YAxis />
            <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="dot" />} />
            {/* Cambié "type" a "linear" y mantuve el gradiente */}
            <Area
              dataKey="units"
              type="linear"   // Aquí cambiamos el tipo a "linear"
              fill="url(#fillUnits)"
              stroke="#a0c4ff"
              stackId="a"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}