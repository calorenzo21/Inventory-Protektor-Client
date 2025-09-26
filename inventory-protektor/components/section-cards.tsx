import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import { 
  ShoppingCart, 
  Package, 
  Users, 
  DollarSign, 
  FileSpreadsheet,
  TriangleAlert, 
} from "lucide-react";

interface SectionCardsProps {
  summary: {
    totalStock: number;
    totalValue: number;
    lowStockCount: number;
    lastMonthSold: number;
  };
}

export function SectionCards({ summary }: SectionCardsProps) {
  return (
    <div className="grid grid-cols-1 gap-4 px-4 lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
      <Card className="@container/card bg-gradient-to-b from-blue-100 to-white border-3 border-blue-800 px-3">
        <CardHeader>
          <div className="flex flex-row items-center justify-between">
            <div className="flex flex-col gap-1.5">
              <CardDescription className="text-black font-medium">Stock Total</CardDescription>
              <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl text-blue-800">
                {summary.totalStock.toLocaleString('es-ES')}
              </CardTitle>
            </div>
            <div className="flex rounded-full bg-blue-200 w-12 h-12 items-center justify-center">
              <Package className="h-5 w-5 text-blue-800" />
            </div>
          </div>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5">
          <div className="line-clamp-1 flex gap-2 font-normal text-muted-foreground">
            Unidades totales en inventario
          </div>
        </CardFooter>
      </Card>
      <Card className="@container/card bg-gradient-to-b from-green-100 to-white border-3 border-green-800 px-3">
        <CardHeader>
          <div className="flex flex-row items-center justify-between">
            <div className="flex flex-col gap-1.5">
              <CardDescription className="text-black font-medium">Valor Monetario</CardDescription>
              <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl text-green-800">
                ${summary.totalValue.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </CardTitle>
            </div>
            <div className="flex rounded-full bg-green-200 w-12 h-12 items-center justify-center">
              <DollarSign className="h-5 w-5 text-green-800" />
            </div>
          </div>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-base">
          <div className="line-clamp-1 flex gap-2 font-normal text-muted-foreground">
            Valor total de inventario
          </div>
        </CardFooter>
      </Card>
      <Card className="@container/card bg-gradient-to-b from-yellow-100 to-white border-3 border-yellow-800 px-3">
        <CardHeader>
          <div className="flex flex-row items-center justify-between">
            <div className="flex flex-col gap-1.5">
              <CardDescription className="text-black font-medium">Bajo Stock</CardDescription>
              <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl text-yellow-800">
                {summary.lowStockCount}
              </CardTitle>
            </div>
            <div className="flex rounded-full bg-yellow-200 w-12 h-12 items-center justify-center">
              <TriangleAlert className="h-5 w-5 text-yellow-800" />
            </div>
          </div>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-base">
          <div className="line-clamp-1 flex gap-2 font-normal text-muted-foreground">
            Productos por debajo del mínimo
          </div>
        </CardFooter>
      </Card>
      <Card className="@container/card bg-gradient-to-b from-cyan-100 to-white border-3 border-cyan-800 px-3">
        <CardHeader>
          <div className="flex flex-row items-center justify-between">
            <div className="flex flex-col gap-1.5">
              <CardDescription className="text-black font-medium">Ventas (Junio)</CardDescription>
              <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl text-cyan-800">
                {summary.lastMonthSold.toLocaleString()}
              </CardTitle>
            </div>
            <div className="flex rounded-full bg-cyan-200 w-12 h-12 items-center justify-center">
              <ShoppingCart className="h-5 w-5 text-cyan-800" />
            </div>
          </div>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-base">
          <div className="line-clamp-1 flex gap-2 font-normal text-muted-foreground">
            Unidades vendidas
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}