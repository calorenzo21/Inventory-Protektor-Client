"use client"

import * as React from "react"
import {
  type ColumnDef,
  type ColumnFiltersState,
  type SortingState,
  type VisibilityState,
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"
import {
  AlertTriangleIcon,
  CheckCircle2Icon,
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronsLeftIcon,
  ChevronsRightIcon,
  ColumnsIcon,
  MoreVerticalIcon,
  PlusIcon,
} from "lucide-react"
import { z } from "zod"

import { useIsMobile } from "@/hooks/use-mobile"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { type ChartConfig, ChartContainer } from "@/components/ui/chart"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

// Update the schema to match our new data structure
export const schema = z.object({
  id: z.number(),
  modelo: z.string(),
  categoria: z.string(),
  precio: z.number(),
  stock: z.number(),
  garantias: z.number(),
  statusStock: z.string(),
  ultimaActualizacion: z.string(),
  totalStockGarantia: z.number(),
  valor: z.number(),
})

// Función para generar un color de fondo basado en el nombre del modelo
function getColorFromModel(modelo: string): string {
  // Extraer la primera letra y convertirla a un número (código ASCII)
  const firstChar = modelo.charCodeAt(0)
  // Usar diferentes rangos de colores según la categoría del modelo
  if (modelo.startsWith("P")) {
    return `hsl(${(firstChar * 5) % 360}, 70%, 80%)`
  } else if (modelo.startsWith("S")) {
    return `hsl(${(firstChar * 7) % 360}, 80%, 75%)`
  } else {
    return `hsl(${(firstChar * 9) % 360}, 75%, 70%)`
  }
}

// Función para obtener el color de la categoría
function getCategoryColor(categoria: string): string {
  switch (categoria) {
    case "Doméstico":
      return "bg-yellow-100 text-yellow-800 hover:bg-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-500 text-sm"
    case "Industrial":
      return "bg-blue-100 text-blue-800 hover:bg-blue-200 dark:bg-blue-900/30 dark:text-blue-500 text-sm"
    case "Supervisor":
      return "bg-green-100 text-green-800 hover:bg-green-200 dark:bg-green-900/30 dark:text-green-500 text-sm"
    default:
      return ""
  }
}

// Replace the columns definition
const columns: ColumnDef<z.infer<typeof schema>>[] = [
  {
    id: "image",
    header: "",
    cell: ({ row }) => {
      const modelo = row.original.modelo
      const initials = modelo.substring(0, 2)
      const bgColor = getColorFromModel(modelo)

      return (
        <div className="flex justify-center items-center">
          <Avatar className="h-12 w-12 border-2 border-muted">
            <AvatarImage src={`/placeholder.svg?height=100&width=100&text=${modelo}`} alt={modelo} />
            <AvatarFallback style={{ backgroundColor: bgColor }} className="text-foreground">
              {initials}
            </AvatarFallback>
          </Avatar>
        </div>
      )
    },
    enableHiding: false,
  },
  {
    accessorKey: "modelo",
    header: "Modelo",
    cell: ({ row }) => {
      return <TableCellViewer item={row.original} />
    },
    enableHiding: false,
  },
  {
    accessorKey: "categoria",
    header: "Categoría",
    cell: ({ row }) => {
      const categoryColor = getCategoryColor(row.original.categoria)
      return (
        <div className="w-32">
          <Badge variant="outline" className={`px-1.5 ${categoryColor}`}>
            {row.original.categoria}
          </Badge>
        </div>
      )
    },
  },
  {
    accessorKey: "precio",
    header: "Precio",
    cell: ({ row }) => <div className="font-medium">${row.original.precio.toFixed(2)}</div>,
  },
  {
    accessorKey: "stock",
    header: "Stock",
    cell: ({ row }) => <div className="font-medium text-center">{row.original.stock}</div>,
  },
  {
    accessorKey: "garantias",
    header: "Garantías",
    cell: ({ row }) => <div className="font-medium text-center">{row.original.garantias}</div>,
  },
  {
    accessorKey: "statusStock",
    header: "Status Stock",
    cell: ({ row }) => (
      <Badge
        variant={row.original.statusStock === "Adecuado" ? "outline" : "default"}
        className={`flex gap-2 px-2 text-sm lg:w-[115px] ${row.original.statusStock === "Adecuado" ? "" : "text-red-800 bg-red-100"}`}
      >
        {row.original.statusStock === "Adecuado" ? (
          <CheckCircle2Icon className="text-green-500 dark:text-green-400"/>
        ) : (
          <AlertTriangleIcon className="text-red-800" />
        )}
        {row.original.statusStock}
      </Badge>
    ),
  },
  {
    accessorKey: "ultimaActualizacion",
    header: "Última Actualización",
    cell: ({ row }) => {
      const date = new Date(row.original.ultimaActualizacion)
      return <div className="font-medium">{date.toLocaleDateString()}</div>
    },
  },
  {
    accessorKey: "totalStockGarantia",
    header: "Total Stock",
    cell: ({ row }) => <div className="font-medium text-center">{row.original.totalStockGarantia}</div>,
  },
  {
    accessorKey: "valor",
    header: "Valor Total",
    cell: ({ row }) => <div className="font-medium text-right">${row.original.valor.toFixed(2)}</div>,
  },
  {
    id: "actions",
    cell: () => (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="flex size-8 text-muted-foreground data-[state=open]:bg-muted" size="icon">
            <MoreVerticalIcon />
            <span className="sr-only">Open menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-32">
          <DropdownMenuItem>Editar</DropdownMenuItem>
          <DropdownMenuItem>Duplicar</DropdownMenuItem>
          <DropdownMenuItem>Destacar</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem>Eliminar</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    ),
  },
]

// Modificar la función DataTable para eliminar los tabs
export function DataTable({
  data: initialData,
}: {
  data: z.infer<typeof schema>[]
}) {
  const [data, setData] = React.useState(() => initialData)
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [pagination, setPagination] = React.useState({
    pageIndex: 0,
    pageSize: 10,
  })

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      columnVisibility,
      columnFilters,
      pagination,
    },
    getRowId: (row) => row.id.toString(),
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
  })

  return (
    <div className="flex w-full flex-col justify-start gap-6">
      <div className="flex items-center justify-between px-4 lg:px-6">
        <h2 className="text-lg font-semibold">Inventario de Productos</h2>
        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <ColumnsIcon />
                <span className="hidden lg:inline">Personalizar Columnas</span>
                <span className="lg:hidden">Columnas</span>
                <ChevronDownIcon />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              {table
                .getAllColumns()
                .filter((column) => typeof column.accessorFn !== "undefined" && column.getCanHide())
                .map((column) => {
                  return (
                    <DropdownMenuCheckboxItem
                      key={column.id}
                      className="capitalize"
                      checked={column.getIsVisible()}
                      onCheckedChange={(value) => column.toggleVisibility(!!value)}
                    >
                      {column.id}
                    </DropdownMenuCheckboxItem>
                  )
                })}
            </DropdownMenuContent>
          </DropdownMenu>
          <Button variant="outline" size="sm">
            <PlusIcon />
            <span className="hidden lg:inline">Añadir Producto</span>
          </Button>
        </div>
      </div>
      <div className="relative flex flex-col gap-4 overflow-auto px-4 lg:px-6">
        <div className="overflow-hidden rounded-lg border">
          <Table>
            <TableHeader className="sticky top-0 z-10 bg-muted">
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead key={header.id} colSpan={header.colSpan}>
                        {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                      </TableHead>
                    )
                  })}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow key={row.id}>
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={columns.length} className="h-24 text-center">
                    No hay resultados.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        <div className="flex items-center justify-between px-4">
          <div className="flex w-full items-center gap-8 lg:w-fit">
            <div className="hidden items-center gap-2 lg:flex">
              <Label htmlFor="rows-per-page" className="text-sm font-medium">
                Filas por página
              </Label>
              <Select
                value={`${table.getState().pagination.pageSize}`}
                onValueChange={(value) => {
                  table.setPageSize(Number(value))
                }}
              >
                <SelectTrigger className="w-20" id="rows-per-page">
                  <SelectValue placeholder={table.getState().pagination.pageSize} />
                </SelectTrigger>
                <SelectContent side="top">
                  {[10, 20, 30, 40, 50].map((pageSize) => (
                    <SelectItem key={pageSize} value={`${pageSize}`}>
                      {pageSize}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex w-fit items-center justify-center text-sm font-medium">
              Página {table.getState().pagination.pageIndex + 1} de {table.getPageCount()}
            </div>
            <div className="ml-auto flex items-center gap-2 lg:ml-0">
              <Button
                variant="outline"
                className="hidden h-8 w-8 p-0 lg:flex"
                onClick={() => table.setPageIndex(0)}
                disabled={!table.getCanPreviousPage()}
              >
                <span className="sr-only">Ir a la primera página</span>
                <ChevronsLeftIcon />
              </Button>
              <Button
                variant="outline"
                className="size-8"
                size="icon"
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
              >
                <span className="sr-only">Ir a la página anterior</span>
                <ChevronLeftIcon />
              </Button>
              <Button
                variant="outline"
                className="size-8"
                size="icon"
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
              >
                <span className="sr-only">Ir a la página siguiente</span>
                <ChevronRightIcon />
              </Button>
              <Button
                variant="outline"
                className="hidden size-8 lg:flex"
                size="icon"
                onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                disabled={!table.getCanNextPage()}
              >
                <span className="sr-only">Ir a la última página</span>
                <ChevronsRightIcon />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

const chartData = [
  { month: "January", desktop: 186, mobile: 80 },
  { month: "February", desktop: 305, mobile: 200 },
  { month: "March", desktop: 237, mobile: 120 },
  { month: "April", desktop: 73, mobile: 190 },
  { month: "May", desktop: 209, mobile: 130 },
  { month: "June", desktop: 214, mobile: 140 },
]

const chartConfig = {
  desktop: {
    label: "Desktop",
    color: "var(--primary)",
  },
  mobile: {
    label: "Mobile",
    color: "var(--primary)",
  },
} satisfies ChartConfig

// Update the TableCellViewer component to display product information
function TableCellViewer({ item }: { item: z.infer<typeof schema> }) {
  const isMobile = useIsMobile()
  const initials = item.modelo.substring(0, 2)
  const bgColor = getColorFromModel(item.modelo)
  const categoryColor = getCategoryColor(item.categoria)

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="link" className="w-fit px-0 text-left text-foreground">
          {item.modelo}
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="flex flex-col">
        <SheetHeader className="gap-1">
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16 border-2 border-muted">
              <AvatarImage src={`/placeholder.svg?height=100&width=100&text=${item.modelo}`} alt={item.modelo} />
              <AvatarFallback style={{ backgroundColor: bgColor }} className="text-foreground text-xl">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div>
              <SheetTitle>{item.modelo}</SheetTitle>
              <SheetDescription>
                <Badge variant="outline" className={`mt-1 px-1.5 ${categoryColor}`}>
                  {item.categoria}
                </Badge>
              </SheetDescription>
            </div>
          </div>
        </SheetHeader>
        <div className="flex flex-1 flex-col gap-4 overflow-y-auto py-4 text-sm">
          {!isMobile && (
            <>
              <Separator />
              <div className="grid gap-2">
                <div className="flex gap-2 font-medium leading-none">
                  {item.statusStock === "Adecuado" ? (
                    <>
                      Stock adecuado <CheckCircle2Icon className="size-4 text-green-500" />
                    </>
                  ) : (
                    <>
                      Stock bajo <AlertTriangleIcon className="size-4 text-destructive" />
                    </>
                  )}
                </div>
                <div className="text-muted-foreground">
                  Última actualización: {new Date(item.ultimaActualizacion).toLocaleDateString()}
                </div>
              </div>
              <Separator />
            </>
          )}
          <form className="flex flex-col gap-4">
            <div className="flex flex-col gap-3">
              <Label htmlFor="modelo">Modelo</Label>
              <Input id="modelo" defaultValue={item.modelo} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-3">
                <Label htmlFor="categoria">Categoría</Label>
                <Select defaultValue={item.categoria}>
                  <SelectTrigger id="categoria" className="w-full">
                    <SelectValue placeholder="Seleccionar categoría" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Domestico">Doméstico</SelectItem>
                    <SelectItem value="Industrial">Industrial</SelectItem>
                    <SelectItem value="Supervisor">Supervisor</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex flex-col gap-3">
                <Label htmlFor="statusStock">Status Stock</Label>
                <Select defaultValue={item.statusStock}>
                  <SelectTrigger id="statusStock" className="w-full">
                    <SelectValue placeholder="Seleccionar status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Adecuado">Adecuado</SelectItem>
                    <SelectItem value="Bajo">Bajo</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-3">
                <Label htmlFor="precio">Precio</Label>
                <Input id="precio" type="number" step="0.01" defaultValue={item.precio} />
              </div>
              <div className="flex flex-col gap-3">
                <Label htmlFor="stock">Stock</Label>
                <Input id="stock" type="number" defaultValue={item.stock} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-3">
                <Label htmlFor="garantias">Garantías</Label>
                <Input id="garantias" type="number" defaultValue={item.garantias} />
              </div>
              <div className="flex flex-col gap-3">
                <Label htmlFor="ultimaActualizacion">Última Actualización</Label>
                <Input id="ultimaActualizacion" type="date" defaultValue={item.ultimaActualizacion} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-3">
                <Label htmlFor="totalStockGarantia">Total</Label>
                <Input id="totalStockGarantia" type="number" defaultValue={item.totalStockGarantia} disabled />
              </div>
              <div className="flex flex-col gap-3">
                <Label htmlFor="valor">Valor Total</Label>
                <Input id="valor" type="number" step="0.01" defaultValue={item.valor} disabled />
              </div>
            </div>
          </form>
        </div>
        <SheetFooter className="mt-auto flex gap-2 sm:flex-col sm:space-x-0">
          <Button className="w-full">Guardar</Button>
          <SheetClose asChild>
            <Button variant="outline" className="w-full">
              Cancelar
            </Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
