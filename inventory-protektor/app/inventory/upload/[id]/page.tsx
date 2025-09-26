"use client"

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {  
  Package, 
  ShoppingCart,
  ArrowLeft,
  FileSpreadsheet,
  Calendar
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  FileType,
  Order, 
  PurchaseRequest,
} from "@/lib/types";
import { SummaryCards } from "@/components/summary-cards";
import { OrderPreview } from "@/components/order-preview";
import { PurchaseRequestPreview } from "@/components/purchase-request-preview";
import { getLoadDetail, ApiLoadDetailResponse } from "@/app/actions/get-load-detail";

export default function LoadDetailPage() {
  const params = useParams();
  const router = useRouter();
  const loadId = params.id as string;
  
  const [loadDetail, setLoadDetail] = useState<ApiLoadDetailResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [purchaseRequest, setPurchaseRequest] = useState<PurchaseRequest | null>(null);
  const [fileType, setFileType] = useState<FileType | null>(null);

  useEffect(() => {
    const fetchLoadDetail = async () => {
      if (!loadId) return;
      
      setIsLoading(true);
      setError(null);
      
      try {
        const detail = await getLoadDetail(loadId);
        setLoadDetail(detail);
        
        // Configurar los datos según el tipo
        const mappedFileType: FileType = detail.fileType === "order" ? "order" : "purchase_request";
        setFileType(mappedFileType);
        
        if (detail.fileType === "order") {
          setOrders(detail.data as Order[]);
          setPurchaseRequest(null);
        } else {
          setPurchaseRequest((detail.data as PurchaseRequest[])[0]);
          setOrders([]);
        }
      } catch (error) {
        console.error('Error loading load detail:', error);
        setError('Error al cargar los detalles de la carga');
      } finally {
        setIsLoading(false);
      }
    };

    fetchLoadDetail();
  }, [loadId]);

  const handleBackToList = () => {
    router.push('/inventory/upload');
  };

  // Estadísticas para órdenes
  const getTotalOrders = () => orders.length;
  const getTotalProducts = () => orders.reduce(
    (sum, order) => sum + order.products.reduce(
      (pSum, product) => pSum + product.quantity, 0
    ), 0
  );
  const getTotalRevenue = () => orders.reduce(
    (sum, order) => sum + order.total, 0
  );
  const getUniqueClients = () => new Set(orders.map((order) => order.clientName)).size;

  // Estadísticas para solicitudes de compra
  const getTotalPurchaseProducts = () =>
    purchaseRequest?.products.reduce((sum, product) => sum + product.quantity, 0) || 0;
  const getTotalPurchaseCost = () => purchaseRequest?.totalCost || 0;
  const getTotalPurchaseModels = () => purchaseRequest?.products.reduce((set, product) => {
    set.add(product.model);
    return set;
  }, new Set<string>()).size || 0;
  const purchaseDateFormatted = new Date(purchaseRequest?.requestDate || "");

  if (isLoading) {
    return (
      <div className="container mx-auto p-6 space-y-6">
        <div className="flex items-end justify-between">
          <div>
            <h1 className="text-3xl font-semibold mb-3">Gestión de Inventario</h1>
            <p className="text-muted-foreground font-normal">Visualizando detalles de la carga</p>
          </div>
          <Button variant="outline" onClick={handleBackToList}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver al Listado
          </Button>
        </div>
        
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary mx-auto mb-4"></div>
          <h3 className="text-lg font-semibold mb-2">Cargando detalles...</h3>
          <p className="text-muted-foreground">
            Obteniendo la información de la carga desde el servidor.
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-6 space-y-6">
        <div className="flex items-end justify-between">
          <div>
            <h1 className="text-3xl font-semibold mb-3">Gestión de Inventario</h1>
            <p className="text-muted-foreground font-normal">Error al cargar los detalles</p>
          </div>
          <Button variant="outline" onClick={handleBackToList}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver al Listado
          </Button>
        </div>
        
        <Alert className="border-red-200 bg-red-50">
          <AlertDescription className="text-red-800">
            {error}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  if (!loadDetail || !fileType) {
    return (
      <div className="container mx-auto p-6 space-y-6">
        <div className="flex items-end justify-between">
          <div>
            <h1 className="text-3xl font-semibold mb-3">Gestión de Inventario</h1>
            <p className="text-muted-foreground font-normal">Carga no encontrada</p>
          </div>
          <Button variant="outline" onClick={handleBackToList}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver al Listado
          </Button>
        </div>
        
        <div className="text-center py-8">
          <FileSpreadsheet className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">Carga no encontrada</h3>
          <p className="text-muted-foreground">
            No se pudo encontrar la carga solicitada.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-3xl font-semibold mb-3">Gestión de Inventario</h1>
          <p className="text-muted-foreground font-normal">Visualizando detalles de la carga</p>
        </div>
        <Button variant="outline" onClick={handleBackToList}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Volver al Listado
        </Button>
      </div>

      {/* Información de la carga */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <Badge
            variant={fileType === "order" ? "destructive" : "default"}
            className={`text-sm ${fileType === "purchase_request" ? "bg-green-600" : ""}`}
          >
            {fileType === "order" ? (
              <>
                <ShoppingCart className="h-6 w-6 mr-1" />
                Venta
              </>
            ) : (
              <>
                <Package className="h-6 w-6 mr-1" />
                Compra
              </>
            )}
          </Badge>
          <Badge variant="outline" className="text-sm">
            Vista Histórica
          </Badge>
        </div>
        
        {/* Mostrar fecha de la orden/solicitud si está disponible */}
        {orders.length > 0 && orders[0].orderDate && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="h-4 w-4" />
            <span>
              {new Date(orders[0].orderDate).toLocaleDateString("es-ES", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </span>
          </div>
        )}
        
        {purchaseRequest && purchaseRequest.requestDate && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="h-4 w-4" />
            <span>
              {new Date(purchaseRequest.requestDate).toLocaleDateString("es-ES", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </span>
          </div>
        )}
        
        {/* Mostrar nombre de la hoja si está disponible */}
        {orders.length > 0 && orders[0].sheetName && (
          <div className="text-sm text-muted-foreground">
            <strong>Hoja:</strong> {orders[0].sheetName}
          </div>
        )}
        
        {purchaseRequest && purchaseRequest.sheetName && (
          <div className="text-sm text-muted-foreground">
            <strong>Hoja:</strong> {purchaseRequest.sheetName}
          </div>
        )}
      </div>

      {/* Tarjetas de resumen */}
      <SummaryCards
        fileType={fileType}
        getTotalOrders={getTotalOrders}
        getTotalProducts={getTotalProducts}
        getUniqueClients={getUniqueClients}
        getTotalRevenue={getTotalRevenue}
        getTotalPurchaseProducts={getTotalPurchaseProducts}
        getTotalPurchaseCost={getTotalPurchaseCost}
        getTotalPurchaseModels={getTotalPurchaseModels}
      />

      {/* Vista previa del contenido */}
      <Card>
        <CardHeader>
          <CardTitle className="font-medium">
            {fileType === "order" 
              ? "Vista Previa de Órdenes" 
              : "Vista Previa de Solicitud de Compra"}
          </CardTitle>
          <div className="flex flex-row space-y-2 justify-between">
            <CardDescription className="font-normal text-muted-foreground">
              {fileType === "order"
                ? "Detalles de las órdenes procesadas"
                : "Detalles de la solicitud de compra procesada"}
            </CardDescription>
            {
              fileType === "purchase_request" && purchaseRequest && (
                <p className="text-md text-muted-foreground pt-0.5">
                  Fecha: {purchaseDateFormatted.toLocaleDateString('es-ES', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
              ) 
            }
          </div>
        </CardHeader>
        <CardContent>
          {fileType === "order" ? (
            <OrderPreview 
              orders={orders} 
            />
          ) : (
            purchaseRequest && (
              <PurchaseRequestPreview 
                purchaseRequest={purchaseRequest} 
              />
            )
          )}
        </CardContent>
      </Card>
    </div>
  );
}