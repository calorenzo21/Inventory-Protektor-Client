import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  ShoppingCart, 
  Package, 
  Users, 
  DollarSign, 
  FileSpreadsheet 
} from "lucide-react";

interface SummaryCardsProps {
  fileType: "order" | "purchase_request";
  getTotalOrders: () => number;
  getTotalProducts: () => number;
  getUniqueClients: () => number;
  getTotalRevenue: () => number;
  getTotalPurchaseProducts: () => number;
  getTotalPurchaseCost: () => number;
  getTotalPurchaseModels: () => number;
}

export const SummaryCards: React.FC<SummaryCardsProps> = ({
  fileType,
  getTotalOrders,
  getTotalProducts,
  getUniqueClients,
  getTotalRevenue,
  getTotalPurchaseProducts,
  getTotalPurchaseModels,
  getTotalPurchaseCost,
}) => {
  if (fileType === "order") {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-b from-blue-100 to-white border-3 border-blue-800 px-4 gap-5">
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-sm font-medium">Órdenes Totales</CardTitle>
            <div className="flex rounded-full bg-blue-200 w-10 h-10 items-center justify-center">
              <ShoppingCart className="h-4 w-4 text-blue-800" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-medium text-blue-800">{getTotalOrders()}</div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-b from-green-100 to-white border-3 border-green-800 px-4 gap-5">
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-sm font-medium">Productos a Descontar</CardTitle>
            <div className="flex rounded-full bg-green-200 w-10 h-10 items-center justify-center">
              <Package className="h-4 w-4 text-green-800" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-medium text-green-800">{getTotalProducts()}</div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-b from-yellow-100 to-white border-3 border-yellow-800 px-4 gap-5">
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-sm font-medium">Clientes Únicos</CardTitle>
            <div className="flex rounded-full bg-yellow-200 w-10 h-10 items-center justify-center">
              <Users className="h-4 w-4 text-yellow-800" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-medium text-yellow-800">{getUniqueClients()}</div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-b from-cyan-100 to-white border-3 border-cyan-800 px-4 gap-5">
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-sm font-medium">Ingresos Totales (Base)</CardTitle>
            <div className="flex rounded-full bg-cyan-200 w-10 h-10 items-center justify-center">
              <DollarSign className="h-4 w-4 text-cyan-800" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-medium text-cyan-800">${getTotalRevenue().toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
          </CardContent>
        </Card>
      </div>
    );
  } else {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">

        <Card className="bg-gradient-to-b from-blue-100 to-white border-3 border-blue-800 px-4 gap-5">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-medium">Modelos Solicitados</CardTitle>
            <div className="flex rounded-full bg-blue-200 w-10 h-10 items-center justify-center">
              <ShoppingCart className="h-4 w-4 text-blue-800" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-800">{getTotalPurchaseModels()}</div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-b from-yellow-100 to-white border-3 border-yellow-800 px-4 gap-5">
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-sm font-medium">Productos a Agregar</CardTitle>
            <div className="flex rounded-full bg-yellow-200 w-10 h-10 items-center justify-center">
              <Package className="h-4 w-4 text-yellow-800" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-800">{getTotalPurchaseProducts()}</div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-b from-green-100 to-white border-3 border-green-800 px-4 gap-5">
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-sm font-medium">Costo Total</CardTitle>
            <div className="flex rounded-full bg-green-200 w-10 h-10 items-center justify-center">
              <DollarSign className="h-4 w-4 text-green-800" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-800">${getTotalPurchaseCost().toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
          </CardContent>
        </Card>
      </div>
    );
  }
};