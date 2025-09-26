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

import { useIsMobile } from "@/hooks/use-mobile"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
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
import Image from "next/image";
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

// Tipo para los datos de la fila
export type Product = {
  productId: string;
  model: string;
  description: string;
  precio: number;
  priceDistribution: number;
  stock: number;
  minStock: number;
  imageUrl: string;
  lastUpdated: string;
  category: {
    id: string;
    name: string;
    description: string;
  };
};

// Función para obtener el color de la categoría
export function getCategoryColor(categoryName: string): string {
  switch (categoryName) {
    case "Protectores Eléctricos":
      return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-500 text-sm"
    case "Industrial":
      return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-500 text-sm"
    case "Supervisor":
      return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-500 text-sm"
    default:
      return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-400 text-sm"
  }
}

// Función para convertir los datos entrantes al tipo correcto
function convertProductData(data: any[]): Product[] {
  return data.map(item => ({
    ...item,
    precio: typeof item.precio === 'string' ? parseFloat(item.precio) : item.precio,
    priceDistribution: typeof item.priceDistribution === 'string' ? parseFloat(item.priceDistribution) : item.priceDistribution,
  }));
}

// Reemplazar la definición de columnas
const columns: ColumnDef<Product>[] = [
  {
    id: "image",
    header: "",
    cell: ({ row }) => {
      const product = row.original;
      return (
        <div className="flex justify-center items-center">
          <Image
            src={`/images/${product.imageUrl}`}
            alt={product.model}
            width={64}
            height={64}
            className="rounded-md object-contain"
          />
        </div>
      );
    },
    enableHiding: false,
  },
  {
    accessorKey: "model",
    header: "Modelo",
    cell: ({ row }) => {
      return <TableCellViewer item={row.original} />
    },
    enableHiding: false,
  },
  {
    accessorKey: "category.name",
    header: "Categoría",
    cell: ({ row }) => {
      const categoryName = row.original.category.name;
      const categoryColor = getCategoryColor(categoryName);
      const firstWord = categoryName.split(' ')[0];
      return (
        <div className="w-32">
          <Badge variant="outline" className={`px-1.5 ${categoryColor} font-normal`}>
            {firstWord}
          </Badge>
        </div>
      )
    },
  },
  {
    accessorKey: "precio",
    header: "Precio Unitario",
    cell: ({ row }) => <div className="font-normal">${row.original.precio.toFixed(2)}</div>,
  },
  {
    accessorKey: "stock",
    header: "Stock Actual",
    cell: ({ row }) => <div className="font-normal text-center">{row.original.stock}</div>,
  },
  {
    id: "statusStock",
    header: "Status Stock",
    cell: ({ row }) => {
      const { stock, minStock } = row.original;
      const status = stock < minStock ? "Bajo" : "Adecuado";

      return (
        <Badge
          variant={status === "Adecuado" ? "outline" : "default"}
          className={`flex gap-2 px-2 text-sm lg:w-[115px] ${status === "Adecuado" ? "bg-green-50" : "text-red-800 bg-red-100 font-medium"}`}
        >
          {status === "Adecuado" ? (
            <CheckCircle2Icon className="text-green-500 dark:text-green-400" />
          ) : (
            <AlertTriangleIcon className="text-red-800" />
          )}
          {status}
        </Badge>
      );
    },
  },
  {
    accessorKey: "lastUpdated",
    header: "Última Actualización",
    cell: ({ row }) => {
      const date = new Date(row.original.lastUpdated);
      return <div className="font-normal">{date.toLocaleDateString()}</div>;
    },
  },
  {
    id: "valorTotal",
    header: "Valor Total",
    cell: ({ row }) => {
      const { precio, stock } = row.original;
      const totalValue = precio * stock;
      return <div className="font-normal text-right">${totalValue.toFixed(2)}</div>;
    },
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
];

// Modificar la función DataTable
export function DataTable({
  data: initialData,
}: {
  data: any[] // Aceptamos datos crudos
}) {
  // Convertir los datos al tipo correcto
  const data = React.useMemo(() => convertProductData(initialData), [initialData]);
  
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [pagination, setPagination] = React.useState({
    pageIndex: 0,
    pageSize: 10,
  });

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      columnVisibility,
      columnFilters,
      pagination,
    },
    getRowId: (row) => row.productId,
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
    <div className="container flex flex-col justify-start gap-6 mx-auto">
      <div className="flex items-center justify-between px-4 lg:px-6">
        <div className="flex flex-col items-start gap-3">
          <h2 className="text-3xl font-semibold text-navy-blue">Inventario de Productos</h2>
          <p className="text-muted-foreground font-normal"> Monitorea existencias, detalles y estado de cada producto en tiempo real</p>
        </div>
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

// Componente TableCellViewer
function TableCellViewer({ item }: { item: Product }) {
  const isMobile = useIsMobile()
  const categoryColor = getCategoryColor(item.category.name)
  const statusStock = item.stock < item.minStock ? "Bajo" : "Adecuado";
  const categoryFirstWord = item.category.name.split(' ')[0];

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="link" className="w-fit px-0 text-left text-foreground">
          {item.model}
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="flex flex-col px-4">
        <SheetHeader className="gap-1">
          <div className="flex items-center gap-4">
            <Image
              src={`/images/${item.imageUrl}`}
              alt={item.model}
              width={64}
              height={64}
              className="rounded-md object-contain"
            />
            <div>
              <SheetTitle>{item.model}</SheetTitle>
              <SheetDescription>
                <Badge variant="outline" className={`mt-1 px-1.5 ${categoryColor} font-normal`}>
                  {categoryFirstWord}
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
                <div className="flex gap-2 font-semibold leading-none">
                  {statusStock === "Adecuado" ? (
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
                  Última actualización: {new Date(item.lastUpdated).toLocaleDateString()}
                </div>
              </div>
              <Separator />
            </>
          )}
          <form className="flex flex-col gap-4">
            <div className="flex flex-col gap-3">
              <Label htmlFor="model">Modelo</Label>
              <Input id="model" defaultValue={item.model} />
            </div>
            <div className="flex flex-col gap-3">
              <Label htmlFor="description">Descripción</Label>
              <Input id="description" defaultValue={item.description} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-3">
                <Label htmlFor="category">Categoría</Label>
                <Select defaultValue={item.category.name}>
                  <SelectTrigger id="category" className="w-full">
                    <SelectValue placeholder="Seleccionar categoría" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Doméstico">Doméstico</SelectItem>
                    <SelectItem value="Industrial">Industrial</SelectItem>
                    <SelectItem value="Supervisor">Supervisor</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex flex-col gap-3">
                <Label htmlFor="statusStock">Status Stock</Label>
                <Select defaultValue={statusStock}>
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
                <Label htmlFor="precio">Precio Unitario</Label>
                <Input 
                  id="precio" 
                  type="number" 
                  step="0.01" 
                  defaultValue={item.precio.toFixed(2)} 
                />
              </div>
              <div className="flex flex-col gap-3">
                <Label htmlFor="stock">Stock Actual</Label>
                <Input id="stock" type="number" defaultValue={item.stock} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-3">
                <Label htmlFor="minStock">Stock Mínimo</Label>
                <Input id="minStock" type="number" defaultValue={item.minStock} />
              </div>
              <div className="flex flex-col gap-3">
                <Label htmlFor="lastUpdated">Última Actualización</Label>
                <Input 
                  id="lastUpdated" 
                  type="date" 
                  defaultValue={new Date(item.lastUpdated).toISOString().split('T')[0]} 
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-3">
                <Label htmlFor="priceDistribution">Precio Distribución</Label>
                <Input 
                  id="priceDistribution" 
                  type="number" 
                  step="0.01" 
                  defaultValue={item.priceDistribution.toFixed(2)} 
                />
              </div>
              <div className="flex flex-col gap-3">
                <Label htmlFor="valor">Valor Total</Label>
                <Input 
                  id="valor" 
                  type="number" 
                  step="0.01" 
                  defaultValue={(item.precio * item.stock).toFixed(2)} 
                  disabled 
                />
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
  );
}