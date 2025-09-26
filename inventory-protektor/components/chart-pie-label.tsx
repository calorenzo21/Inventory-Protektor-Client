"use client"
import { LabelList, Pie, PieChart } from "recharts"
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

interface ChartPieLabelListProps {
  chartData: Array<{
    model: string;
    units: number;
    fill: string;
  }>;
}

export function ChartPieLabelList({ chartData }: ChartPieLabelListProps) {
  const totalUnits = chartData.reduce((acc, curr) => acc + curr.units, 0)

  // Generar configuración dinámica del chart
  const chartConfig = chartData.reduce((config, item) => {
    config[item.model] = {
      label: item.model,
      color: item.fill,
    };
    return config;
  }, {
    units: {
      label: "Unidades",
    },
  } as ChartConfig);

  return (
    <Card className="flex flex-col border-3">
      <CardHeader className="items-center pb-0">
        <CardTitle className="font-medium">Distribución de Stock</CardTitle>
        <CardDescription className="font-normal">Todos los productos en stock</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square h-[350px]"
        >
          <PieChart>
            <ChartTooltip
              content={<ChartTooltipContent nameKey="model" hideLabel />}
            />
            <Pie data={chartData} dataKey="units">
              {/* <LabelList
                dataKey="units"
                className="fill-black font-medium"
                stroke="none"
                fontSize={13}
                formatter={(value: number, entry: any) => {
                  const percentage = ((value / totalUnits) * 100).toFixed(1)
                  return `${percentage}%`
                }}
              /> */}
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}