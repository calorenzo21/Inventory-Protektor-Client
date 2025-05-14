import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ChevronDown } from "lucide-react"

const productos = [
  { producto: "PARE-110", stock: 12, minimo: 15 },
  { producto: "PARE-220", stock: 8, minimo: 10 },
  { producto: "PARTE-110", stock: 8, minimo: 10 },
  { producto: "PARTE-220", stock: 5, minimo: 10 },
  { producto: "SPD-1320", stock: 7, minimo: 10 },
]

export function TableLowProducts() {
  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-base font-semibold">Productos con Bajo Stock</CardTitle>
        <ChevronDown className="h-5 w-5 text-red-500" />
      </CardHeader>
      <CardContent className="pt-2">
        <Table className="w-full">
          <TableHeader className="bg-gray-50">
            <TableRow>
              <TableHead className="text-gray-600 px-2">Producto</TableHead>
              <TableHead className="text-right text-gray-600 px-2">Stock</TableHead>
              <TableHead className="text-right text-gray-600 px-2">Minimo</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {productos.map((item, index) => (
              <TableRow
                key={item.producto}
                className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}
              >
                <TableCell className="font-medium px-2">{item.producto}</TableCell>
                <TableCell className="text-right px-2">{item.stock}</TableCell>
                <TableCell className="text-right text-green-600 font-medium px-2">{item.minimo}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}