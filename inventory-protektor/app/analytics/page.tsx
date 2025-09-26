"use client"

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Package,
  TrendingUp,
  TrendingDown,
  ShoppingCart,
  DollarSign,
  Users,
} from "lucide-react"
import {
  LineChart,
  Line,
  PieChart,
  Pie,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  AreaChart,
  Area,
  LabelList,
} from "recharts"
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

// Datos de ejemplo adaptados - Tendencia anual completa
const yearSalesTrend = [
  { month: "Ene", ventas: 125000 },
  { month: "Feb", ventas: 142000 },
  { month: "Mar", ventas: 138000 },
  { month: "Abr", ventas: 165000 },
  { month: "May", ventas: 155000 },
  { month: "Jun", ventas: 178000 },
  { month: "Jul", ventas: 189000 },
  { month: "Ago", ventas: 172000 },
  { month: "Sep", ventas: 195000 },
  { month: "Oct", ventas: 183000 },
  { month: "Nov", ventas: 201000 },
  { month: "Dic", ventas: 215000 },
]

const chartLineConfig = {
  ventas: {
    label: "Ventas",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig

const categoryData = [
  { name: "pinturas", ventas: 285000, fill: "#fdffb6" },
  { name: "Protectores eléctricos", ventas: 190000, fill: "#ffd6a5" },
  { name: "revestimientos", ventas: 158000, fill: "#a0c4ff" },
]

const totalSales = categoryData.reduce((acc, curr) => acc + curr.ventas, 0)

const chartPieCategoryConfig = {
  ventas: {
    label: "Ventas",
  },
  pinturas: {
    label: "Pinturas",
    color: "#fdffb6",
  },
  Protectores_eléctricos: {
    label: "Protectores Eléctricos",
    color: "#ffd6a5",
  },
  revestimientos: {
    label: "Revestimientos",
    color: "#a0c4ff",
  },
} satisfies ChartConfig

const brandData = [
  { name: "Protektor", ventas: 380000, productos: 18, fill: "#a0c4ff" },
  { name: "Icolor", ventas: 253000, productos: 8, fill: "#ffb3ba" },
]

const chartPieBrandConfig = {
  ventas: {
    label: "Ventas",
  },
  Protektor: {
    label: "Protektor",
    color: "#a0c4ff",
  },
  Icolor: {
    label: "Icolor",
    color: "#ffb3ba",
  },
} satisfies ChartConfig

const topProducts = [
  {
    codigo: "PAR-220",
    modelo: "PAR-220",
    categoria: "Pinturas",
    marca: "Protektor",
    ventas_unidades: 125,
    ventas_valor: 45000,
    precio: 360,
    trend: "up",
  },
  {
    codigo: "PRD-110",
    modelo: "PRD-110",
    categoria: "Pinturas",
    marca: "Icolor",
    ventas_unidades: 98,
    ventas_valor: 38000,
    precio: 388,
    trend: "up",
  },
  {
    codigo: "SPD-1320",
    modelo: "SPD-1320",
    categoria: "Protectores Eléctricos",
    marca: "Protektor",
    ventas_unidades: 156,
    ventas_valor: 58000,
    precio: 372,
    trend: "up",
  },
  {
    codigo: "PEE-110",
    modelo: "PEE-110",
    categoria: "Protectores Eléctricos",
    marca: "Protektor",
    ventas_unidades: 87,
    ventas_valor: 32000,
    precio: 368,
    trend: "down",
  },
  {
    codigo: "USTD-220",
    modelo: "USTD-220",
    categoria: "Revestimientos",
    marca: "Protektor",
    ventas_unidades: 76,
    ventas_valor: 28000,
    precio: 368,
    trend: "up",
  },
]

const topClients = [
  {
    nombre: "Ferretería Central",
    pedidos: 24,
    total_comprado: 45000,
    ultima_compra: "2024-01-15",
    categoria_favorita: "Pinturas",
  },
  {
    nombre: "Distribuidora Norte",
    pedidos: 18,
    total_comprado: 38500,
    ultima_compra: "2024-01-14",
    categoria_favorita: "Protectores Eléctricos",
  },
  {
    nombre: "Comercial Sur",
    pedidos: 22,
    total_comprado: 42000,
    ultima_compra: "2024-01-13",
    categoria_favorita: "Revestimientos",
  },
  {
    nombre: "Mayorista Este",
    pedidos: 15,
    total_comprado: 35000,
    ultima_compra: "2024-01-12",
    categoria_favorita: "Pinturas",
  },
  {
    nombre: "Constructora Alfa",
    pedidos: 19,
    total_comprado: 41200,
    ultima_compra: "2024-01-11",
    categoria_favorita: "Protectores Eléctricos",
  },
]

const recentSales = [
  {
    id: "V-001",
    cliente: "Ferretería Central",
    productos: "PAR-220, PRD-110",
    total: 2150,
    fecha: "2024-01-15",
    estado: "Completada",
  },
  {
    id: "V-002",
    cliente: "Distribuidora Norte",
    productos: "SPD-1320, PEE-110",
    total: 1890,
    fecha: "2024-01-15",
    estado: "Completada",
  },
  {
    id: "V-003",
    cliente: "Comercial Sur",
    productos: "USTD-220, PAR-110",
    total: 1456,
    fecha: "2024-01-14",
    estado: "Pendiente",
  },
  {
    id: "V-004",
    cliente: "Mayorista Este",
    productos: "PRDP-110, PARE-110",
    total: 2340,
    fecha: "2024-01-14",
    estado: "Completada",
  },
  {
    id: "V-005",
    cliente: "Constructora Alfa",
    productos: "PAREP-220, USTDA-220",
    total: 1780,
    fecha: "2024-01-13",
    estado: "Completada",
  },
]

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"]

// Agregar datos mensuales para la comparación de marcas después de los datos existentes
const brandComparisonData = [
  { month: "Ene", Protektor: 32000, Icolor: 21000 },
  { month: "Feb", Protektor: 36000, Icolor: 24000 },
  { month: "Mar", Protektor: 35000, Icolor: 23000 },
  { month: "Abr", Protektor: 42000, Icolor: 28000 },
  { month: "May", Protektor: 39000, Icolor: 26000 },
  { month: "Jun", Protektor: 45000, Icolor: 30000 },
  { month: "Jul", Protektor: 48000, Icolor: 54000 },
  { month: "Ago", Protektor: 43000, Icolor: 50000 },
  { month: "Sep", Protektor: 49000, Icolor: 60000 },
  { month: "Oct", Protektor: 46000, Icolor: 70000 },
  { month: "Nov", Protektor: 51000, Icolor: 60000 },
  { month: "Dic", Protektor: 54000, Icolor: 40000 },
]

const chartAreaConfig = {
  Protektor: {
    label: "Protektor",
    color: "var(--chart-1)",
  },
  Icolor: {
    label: "Icolor",
    color: "var(--chart-2)",
  },
} satisfies ChartConfig

export default function InventorySalesDashboard() {
  return (
    <div className="min-h-screen bg-gray-50/50">
      <div className="p-6 space-y-6 @container/main">
        {/* Métricas principales */}
        <div className="grid grid-cols-1 gap-4 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
          <Card className="@container/card bg-gradient-to-b from-green-100 to-white border-3 border-green-800 px-3">
            <CardHeader>
              <div className="flex flex-row items-center justify-between">
                <div className="flex flex-col gap-1.5">
                  <CardDescription className="text-black font-medium">Ventas del Mes</CardDescription>
                  <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl text-green-800">
                    $215,000
                  </CardTitle>
                </div>
                <div className="flex rounded-full bg-green-200 w-12 h-12 items-center justify-center">
                  <DollarSign className="h-5 w-5 text-green-800" />
                </div>
              </div>
            </CardHeader>
            <CardFooter className="flex-col items-start gap-1.5">
              <div className="line-clamp-1 flex gap-2 font-normal text-muted-foreground">
                <span className="text-green-600 flex items-center">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  +17.2%
                </span>
                vs mes anterior
              </div>
            </CardFooter>
          </Card>

          <Card className="@container/card bg-gradient-to-b from-blue-100 to-white border-3 border-blue-800 px-3">
            <CardHeader>
              <div className="flex flex-row items-center justify-between">
                <div className="flex flex-col gap-1.5">
                  <CardDescription className="text-black font-medium">Pedidos</CardDescription>
                  <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl text-blue-800">
                    89
                  </CardTitle>
                </div>
                <div className="flex rounded-full bg-blue-200 w-12 h-12 items-center justify-center">
                  <ShoppingCart className="h-5 w-5 text-blue-800" />
                </div>
              </div>
            </CardHeader>
            <CardFooter className="flex-col items-start gap-1.5">
              <div className="line-clamp-1 flex gap-2 font-normal text-muted-foreground">
                <span className="text-green-600 flex items-center">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  +12.7%
                </span>
                vs mes anterior
              </div>
            </CardFooter>
          </Card>

          <Card className="@container/card bg-gradient-to-b from-purple-100 to-white border-3 border-purple-800 px-3">
            <CardHeader>
              <div className="flex flex-row items-center justify-between">
                <div className="flex flex-col gap-1.5">
                  <CardDescription className="text-black font-medium">Clientes Activos</CardDescription>
                  <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl text-purple-800">
                    67
                  </CardTitle>
                </div>
                <div className="flex rounded-full bg-purple-200 w-12 h-12 items-center justify-center">
                  <Users className="h-5 w-5 text-purple-800" />
                </div>
              </div>
            </CardHeader>
            <CardFooter className="flex-col items-start gap-1.5">
              <div className="line-clamp-1 flex gap-2 font-normal text-muted-foreground">
                <span className="text-green-600 flex items-center">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  +8.1%
                </span>
                vs mes anterior
              </div>
            </CardFooter>
          </Card>

          <Card className="@container/card bg-gradient-to-b from-cyan-100 to-white border-3 border-cyan-800 px-3">
            <CardHeader>
              <div className="flex flex-row items-center justify-between">
                <div className="flex flex-col gap-1.5">
                  <CardDescription className="text-black font-medium">Ticket Promedio</CardDescription>
                  <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl text-cyan-800">
                    $2,416
                  </CardTitle>
                </div>
                <div className="flex rounded-full bg-cyan-200 w-12 h-12 items-center justify-center">
                  <Package className="h-5 w-5 text-cyan-800" />
                </div>
              </div>
            </CardHeader>
            <CardFooter className="flex-col items-start gap-1.5">
              <div className="line-clamp-1 flex gap-2 font-normal text-muted-foreground">
                <span className="text-green-600 flex items-center">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  +4.2%
                </span>
                vs mes anterior
              </div>
            </CardFooter>
          </Card>
        </div>

        {/* Gráficas principales */}
        <div className="grid gap-6 lg:grid-cols-6">
          <Card className="lg:col-span-4 ">
            <CardHeader>
              <CardTitle>Tendencia de Ventas Anual</CardTitle>
              <CardDescription>Evolución de ventas durante todo el año</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer config={chartLineConfig} className="aspect-auto h-[250px] w-full">
                <LineChart
                  accessibilityLayer
                  data={yearSalesTrend}
                  margin={{
                    left: 12,
                    right: 12,
                  }}
                >
                  <CartesianGrid vertical={false} />
                  <XAxis
                    dataKey="month"
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                    tickFormatter={(value) => value.slice(0, 3)}
                  />
                  <ChartTooltip
                    cursor={false}
                    content={<ChartTooltipContent indicator="line" />}
                  />
                  <Line
                    dataKey="ventas"
                    type="natural"
                    stroke="var(--color-navy-blue)"
                    strokeWidth={2}
                    dot={{
                      fill: "var(--color-navy-blue)",
                    }}
                    activeDot={{
                      r: 6,
                    }}
                  />
                </LineChart>
              </ChartContainer>
          </CardContent>
        </Card>

          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Ventas por Categoría</CardTitle>
              <CardDescription>Distribución de ventas por tipo de producto</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer config={chartPieCategoryConfig} className="mx-auto aspect-square max-h-[250px]">
                <PieChart>
                  <ChartTooltip
                    cursor={false}
                    content={<ChartTooltipContent indicator="line" />}
                  />
                  <Pie data={categoryData} dataKey="ventas">
                    <LabelList
                      dataKey="ventas"
                      className="fill-black"
                      stroke="none"
                      fontSize={12}
                      formatter={(value: number, entry: any) => {
                        const percentage = ((value / totalSales) * 100).toFixed(1)
                        return `${percentage}%`
                      }}
                    />
                  </Pie>
                </PieChart>
              </ChartContainer>
            </CardContent>
          </Card>
        </div>

        {/* Análisis detallado */}
        <Tabs defaultValue="top-sales" className="space-y-4">
          <TabsList>
            <TabsTrigger value="top-sales">Top Ventas</TabsTrigger>
            <TabsTrigger value="brands">Marcas</TabsTrigger>
          </TabsList>

          <TabsContent value="top-sales" className="space-y-4">
            <div className="grid gap-6 lg:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Top Productos Más Vendidos</CardTitle>
                  <CardDescription>Productos con mayor rotación este mes</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {topProducts.map((product, index) => (
                      <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-sm font-medium">
                            {index + 1}
                          </div>
                          <Avatar className="h-10 w-10">
                            <AvatarImage src={`/placeholder.svg?height=40&width=40&text=${product.codigo}`} />
                            <AvatarFallback>{product.codigo.substring(0, 2)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{product.codigo}</p>
                            <p className="text-sm text-muted-foreground">
                              {product.categoria} • {product.marca}
                            </p>
                            <p className="text-xs text-muted-foreground">Precio: ${product.precio}/u</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-medium text-lg">${product.ventas_valor.toLocaleString()}</p>
                          <p className="text-sm text-muted-foreground">{product.ventas_unidades} unidades</p>
                          <div className="flex items-center justify-end">
                            {product.trend === "up" ? (
                              <TrendingUp className="h-3 w-3 text-green-600 mr-1" />
                            ) : (
                              <TrendingDown className="h-3 w-3 text-red-600 mr-1" />
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Top Clientes del Año</CardTitle>
                  <CardDescription>Clientes que más han comprado en lo que va del año</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {topClients.map((client, index) => (
                      <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center text-sm font-medium">
                            {index + 1}
                          </div>
                          <Avatar className="h-10 w-10">
                            <AvatarImage src={`/placeholder.svg?height=40&width=40&text=${client.nombre.charAt(0)}`} />
                            <AvatarFallback>{client.nombre.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{client.nombre}</p>
                            <p className="text-sm text-muted-foreground">
                              {client.pedidos} pedidos • Prefiere {client.categoria_favorita}
                            </p>
                            <p className="text-xs text-muted-foreground">Última compra: {client.ultima_compra}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-medium text-lg">${client.total_comprado.toLocaleString()}</p>
                          <p className="text-sm text-muted-foreground">Total del año</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="brands" className="space-y-4">
            <div className="grid gap-6 lg:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Rendimiento por Marca</CardTitle>
                  <CardDescription>Comparativa de ventas entre marcas</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {brandData.map((brand, index) => (
                      <div key={index} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: brand.fill }}></div>
                            <span className="text-sm font-medium">{brand.name}</span>
                            <span className="text-sm text-muted-foreground">({brand.productos} productos)</span>
                          </div>
                          <span className="font-medium">${brand.ventas.toLocaleString()}</span>
                        </div>
                        <Progress value={(brand.ventas / totalSales) * 100} className="h-2" />
                        <p className="text-xs text-muted-foreground">{((brand.ventas / totalSales) * 100).toFixed(1)}% del total de ventas</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Distribución de Ventas por Marca</CardTitle>
                  <CardDescription>Participación en el mercado</CardDescription>
                </CardHeader>
                <CardContent>
                  <ChartContainer config={chartPieBrandConfig} className="mx-auto aspect-square max-h-[250px]">
                    <PieChart>
                      <ChartTooltip
                        cursor={false}
                        content={<ChartTooltipContent indicator="line" />}
                      />
                      <Pie data={brandData} dataKey="ventas">
                        <LabelList
                          dataKey="ventas"
                          className="fill-black"
                          stroke="none"
                          fontSize={12}
                          formatter={(value: number, entry: any) => {
                            const percentage = ((value / totalSales) * 100).toFixed(1)
                            return `${percentage}%`
                          }}
                        />
                      </Pie>
                    </PieChart>
                  </ChartContainer>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        {/* Comparación de Rendimiento por Marcas */}
        <Card>
          <CardHeader>
            <CardTitle>Evolución Anual de Ventas por Marca</CardTitle>
            <CardDescription>Comparación mensual del rendimiento entre Protektor e Icolor</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartAreaConfig} className="aspect-auto h-[400px] w-full">
              <AreaChart
                accessibilityLayer
                data={brandComparisonData}
                margin={{
                  left: 12,
                  right: 12,
                }}
              >
                <defs>
                  <linearGradient id="fillProtektor" x1="0" y1="0" x2="0" y2="1">
                    <stop
                      offset="5%"
                      stopColor="#1e3a8a"
                      stopOpacity={0.8}
                    />
                    <stop
                      offset="95%"
                      stopColor="#1e3a8a"
                      stopOpacity={0.1}
                    />
                  </linearGradient>
                  <linearGradient id="fillIcolor" x1="0" y1="0" x2="0" y2="1">
                    <stop
                      offset="5%"
                      stopColor="#4ade80"
                      stopOpacity={0.8}
                    />
                    <stop
                      offset="95%"
                      stopColor="#4ade80"
                      stopOpacity={0.1}
                    />
                  </linearGradient>
                </defs>
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="month"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  tickFormatter={(value) => value.slice(0, 3)}
                />
                <YAxis />
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent indicator="line" />}
                />
                <Area
                  dataKey="Protektor"
                  type="natural"
                  fill="url(#fillProtektor)"
                  fillOpacity={0.4}
                  stroke="#1e3a8a"
                  stackId="b"
                />
                <Area
                  dataKey="Icolor"
                  type="natural"
                  fill="url(#fillIcolor)"
                  fillOpacity={0.4}
                  stroke="#4ade80"
                  stackId="a"
                />
              </AreaChart>
            </ChartContainer>

            {/* Métricas adicionales de comparación */}
            <div className="grid grid-cols-3 gap-4 mt-6">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <h4 className="font-semibold text-blue-900">Protektor</h4>
                <p className="text-2xl font-bold text-blue-700">{brandComparisonData.reduce((acc, curr) => acc + curr.Protektor, 0).toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                <p className="text-sm text-blue-600">{`${((brandComparisonData.reduce((acc, curr) => acc + curr.Protektor, 0) / (brandComparisonData.reduce((acc, curr) => acc + curr.Protektor, 0) + brandComparisonData.reduce((acc, curr) => acc + curr.Icolor, 0)) * 100) || 0).toFixed(2)}%`} del mercado</p>
                <p className="text-xs text-blue-500">Crecimiento constante</p>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <h4 className="font-semibold text-green-900">Icolor</h4>
                <p className="text-2xl font-bold text-green-700">{brandComparisonData.reduce((acc, curr) => acc + curr.Icolor, 0).toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                <p className="text-sm text-green-600">{`${((brandComparisonData.reduce((acc, curr) => acc + curr.Icolor, 0) / (brandComparisonData.reduce((acc, curr) => acc + curr.Protektor, 0) + brandComparisonData.reduce((acc, curr) => acc + curr.Icolor, 0)) * 100) || 0).toFixed(2)}%`} del mercado</p>
                <p className="text-xs text-green-500">Tendencia positiva</p>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <h4 className="font-semibold text-gray-900">Diferencia</h4>
                <p className="text-2xl font-bold text-gray-700">{(brandComparisonData.reduce((acc, curr) => acc + curr.Protektor, 0) - brandComparisonData.reduce((acc, curr) => acc + curr.Icolor, 0)).toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                <p className="text-sm text-gray-600">Brecha promedio</p>
                <p className="text-xs text-gray-500">Protektor lidera</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
