import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export function SectionCards() {
  return (
    <div className="grid grid-cols-1 gap-4 px-4 lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
      <Card className="@container/card bg-gradient-to-b from-[#a0c4ff] to-white">
        <CardHeader>
          <CardDescription className="text-black">Stock Total</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl text-blue-800">
            3154
          </CardTitle>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5">
          <div className="line-clamp-1 flex gap-2 font-medium text-muted-foreground font-mono">
            Unidades totales en inventario
          </div>
        </CardFooter>
      </Card>
      <Card className="@container/card bg-gradient-to-b from-[#caffbf] to-white">
        <CardHeader>
          <CardDescription className="text-black">Valor Monetario</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl text-green-800">
            $45177.15
          </CardTitle>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-base">
          <div className="line-clamp-1 flex gap-2 font-medium text-muted-foreground">
            Valor total de inventario
          </div>
        </CardFooter>
      </Card>
      <Card className="@container/card bg-gradient-to-b from-[#fdffb6] to-white">
        <CardHeader>
          <CardDescription className="text-black">Productos con Bajo Stock</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl text-yellow-800">
            7
          </CardTitle>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-base">
          <div className="line-clamp-1 flex gap-2 font-medium text-muted-foreground">
            Productos por debajo del mínimo
          </div>
        </CardFooter>
      </Card>
      <Card className="@container/card bg-gradient-to-b from-[#9bf6ff] to-white">
        <CardHeader>
          <CardDescription className="text-black">Top Ventas (Abril)</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl text-cyan-800">
            305
          </CardTitle>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-base">
          <div className="line-clamp-1 flex gap-2 font-medium text-muted-foreground">
            Mejor Producto: PAR-220
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}