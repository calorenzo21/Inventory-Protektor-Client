"use client"

import * as React from "react"
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

interface ChartAreaInteractiveProps {
  chartData: Array<{
    month: string;
    units: number;
  }>;
}

const chartConfig = {
  units: {
    label: "Unidades",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig

export function ChartAreaInteractive({ chartData }: ChartAreaInteractiveProps) {
  // Obtener el año actual
  const currentYear = new Date().getFullYear();

  return (
    <Card className="border-3">
      <CardHeader>
        <CardTitle className="font-medium">Unidades Vendidas por Mes</CardTitle>
        <CardDescription className="font-normal">{currentYear}</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="aspect-auto h-[250px] w-full">
          <AreaChart data={chartData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
            <defs>
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
            <Area
              dataKey="units"
              type="linear"
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