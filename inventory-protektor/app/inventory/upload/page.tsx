"use client"
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {  
  CheckCircle, 
  Package, 
  ShoppingCart,
  Eye,
  FileSpreadsheet,
  Calendar,
  ArrowLeft,
  Undo2,
  RefreshCw
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { 
  FileType,
  Order, 
  PurchaseRequest,
} from "@/lib/types";
import { ImportDialog } from "@/components/import-dialog";
import { SummaryCards } from "@/components/summary-cards";
import { OrderPreview } from "@/components/order-preview";
import { PurchaseRequestPreview } from "@/components/purchase-request-preview";
import { uploadFile } from "@/app/actions/upload";
import { processSalesLoad } from "@/app/actions/process-sales-uploads";
import { processPurchaseLoad } from "@/app/actions/process-purchase-uploads";
import { getLoadHistory, ApiLoadHistory } from "@/app/actions/get-loads";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { revertLoad } from "@/app/actions/revert-load";

export default function InventoryManagementPage() {
  const router = useRouter();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [purchaseRequest, setPurchaseRequest] = useState<PurchaseRequest | null>(null);
  const [importComplete, setImportComplete] = useState(false);
  const [fileType, setFileType] = useState<FileType | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [inventoryUpdated, setInventoryUpdated] = useState(false);
  const [fileName, setFileName] = useState<string>("");
  const [loadHistory, setLoadHistory] = useState<ApiLoadHistory[]>([]);
  const [lastViewed, setLastViewed] = useState<string | null>(null);
  const [isLoadingHistory, setIsLoadingHistory] = useState(true);
  const [isReverting, setIsReverting] = useState<string | null>(null);

  // Cargar historial desde la API
  const fetchLoadHistory = async () => {
    setIsLoadingHistory(true);
    try {
      const history = await getLoadHistory();
      setLoadHistory(history);
    } catch (error) {
      console.error('Error loading history:', error);
    } finally {
      setIsLoadingHistory(false);
    }
  };

  useEffect(() => {
    // Cargar datos guardados localmente para la sesión actual
    const savedData = localStorage.getItem("importedData");
    const savedLastViewed = localStorage.getItem("lastViewed");

    if (savedLastViewed) {
      setLastViewed(savedLastViewed);
    }

    if (savedData) {
      const { fileType, data, fileName } = JSON.parse(savedData);
      setFileType(fileType);
      setFileName(fileName);
      if (fileType === "order") {
        setOrders(data);
        setPurchaseRequest(null);
      } else {
        setPurchaseRequest(data[0]);
        setOrders([]);
      }
      setImportComplete(true);
    }

    // Cargar historial desde la API
    fetchLoadHistory();
  }, []);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setUploadedFile(file);
      setFileName(file.name);
      simulateUpload();
    }
  };

  const simulateUpload = () => {
    setIsUploading(true);
    setUploadProgress(0);
    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 90) {
          clearInterval(interval);
          setIsUploading(false);
          return 90;
        }
        return prev + 10;
      });
    }, 200);
  };

  const handleImport = async () => {
    if (!uploadedFile) return;

    try {
      setUploadProgress(90);
      setIsUploading(true);
      
      const result = await uploadFile(uploadedFile);
      console.log("Import result:", result);
      setUploadProgress(100);

      const { fileType, data } = result;
      setFileType(fileType);

      if (fileType === "order") {
        setOrders(data as Order[]);
        setPurchaseRequest(null);
      } else {
        setPurchaseRequest((data as PurchaseRequest[])[0]);
        setOrders([]);
      }

      localStorage.setItem("importedData", JSON.stringify({ fileType, data, fileName }));
      setImportComplete(true);
      setIsDialogOpen(false);
      setInventoryUpdated(false);
      setLastViewed("current");
      localStorage.setItem("lastViewed", "current");
    } catch (error) {
      console.error("Error al importar:", error);
      setUploadProgress(0);
    } finally {
      setTimeout(() => {
        setIsUploading(false);
        setUploadedFile(null);
        setUploadProgress(0);
      }, 500);
    }
  };

  const handleSubmitInventoryChanges = async () => {
    setIsSubmitting(true);
    
    try {
      let result;

      if (fileType === 'order') {
        result = await processSalesLoad(fileName, orders);
      } else if (fileType === 'purchase_request' && purchaseRequest) {
        result = await processPurchaseLoad(fileName, [purchaseRequest]);
      } else {
        throw new Error('Tipo de archivo no válido o datos faltantes');
      }
      
      localStorage.removeItem("importedData");
      setInventoryUpdated(true);
      setImportComplete(false);
      setFileType(null);
      setOrders([]);
      setPurchaseRequest(null);
      setLastViewed(null);
      localStorage.setItem("lastViewed", "");
      
      // Recargar el historial después de procesar
      await fetchLoadHistory();
    } catch (error) {
      console.error('Error al actualizar inventario:', error);
      alert('Error al actualizar el inventario. Por favor, intenta de nuevo.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRevertLoad = async (loadId: string) => {
    setIsReverting(loadId);
    try {
      await revertLoad(loadId);
      
      // Actualizar el estado local inmediatamente para mejor UX
      setLoadHistory(prevHistory => prevHistory.filter(load => load.loadId !== loadId));
      
      // Recargar los datos del servidor en segundo plano
      await fetchLoadHistory();
      
      alert("Carga revertida exitosamente");
    } catch (error) {
      console.error("Error al revertir la carga:", error);
      alert("Error al revertir la carga");
    } finally {
      setIsReverting(null);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      setUploadedFile(files[0]);
      simulateUpload();
    }
  };

  const viewHistoricalLoad = (load: ApiLoadHistory) => {
    router.push(`/inventory/upload/${load.loadId}`);
  };

  const backToHistory = () => {
    setOrders([]);
    setPurchaseRequest(null);
    setImportComplete(false);
    setFileType(null);
    setInventoryUpdated(false);
    setFileName("");
    setLastViewed(null);
    localStorage.removeItem("importedData");
    localStorage.setItem("lastViewed", "");
  };

  // Función para convertir el tipo de la API al tipo local
  const mapApiTypeToLocal = (apiType: "SALE" | "PURCHASE"): FileType => {
    return apiType === "SALE" ? "order" : "purchase_request";
  };

  // Estadísticas
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

  const getTotalPurchaseProducts = () =>
    purchaseRequest?.products.reduce((sum, product) => sum + product.quantity, 0) || 0;
  const getTotalPurchaseCost = () => purchaseRequest?.totalCost || 0;
  const getTotalPurchaseModels = () => purchaseRequest?.products.reduce((set, product) => {
    set.add(product.model);
    return set;
  }, new Set<string>()).size || 0;
  const purchaseDateFormatted = new Date(purchaseRequest?.requestDate || "");

  return (
    <div className="container mx-auto p-6 space-y-6 w-full">
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-3xl font-semibold mb-3 text-navy-blue">Gestión de Inventario</h1>
          <p className="text-muted-foreground font-normal">Importa órdenes o solicitudes de compra para gestionar tu inventario</p>
        </div>

        <div className="flex gap-2">
          {importComplete && (
            <Button variant="outline" onClick={backToHistory}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver al Historial
            </Button>
          )}
          <Button className="bg-navy-blue" onClick={() => setIsDialogOpen(true)}>
            Importar Archivo
          </Button>
        </div>
      </div>

      {inventoryUpdated && (
        <Alert className="border-green-200 bg-green-50">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-800">
            ¡El inventario se ha actualizado exitosamente! Todos los cambios se han aplicado a tu sistema.
          </AlertDescription>
        </Alert>
      )}

      {/* Vista Previa - Solo se muestra cuando hay datos importados */}
      {importComplete && fileType && (
        <>
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
            {lastViewed !== "current" && (
              <Badge variant="outline" className="text-sm">
                Vista Histórica
              </Badge>
            )}
          </div>

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
                    ? "Revisa las órdenes que disminuirán tu inventario"
                    : "Revisa la solicitud de compra que aumentará tu inventario"}
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

          {!inventoryUpdated && lastViewed === "current" && (
            <div className="flex justify-center">
              <Button 
                size="lg" 
                onClick={handleSubmitInventoryChanges} 
                disabled={isSubmitting} 
                className="min-w-48"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Actualizando Inventario...
                  </>
                ) : (
                  <>
                    <CheckCircle className="h-4 w-4 mr-2" />
                    {fileType === "order"
                      ? "Aplicar Órdenes"
                      : "Aplicar Solicitud de Compra"}
                  </>
                )}
              </Button>
            </div>
          )}
        </>
      )}

      {/* Historial de Cargas - Solo se muestra cuando NO hay vista previa */}
      {!importComplete && (
        <div>
          {isLoadingHistory ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary mx-auto mb-4"></div>
              <h3 className="text-lg font-semibold mb-2">Cargando historial...</h3>
              <p className="text-muted-foreground">
                Obteniendo el historial de cargas desde el servidor.
              </p>
            </div>
          ) : loadHistory.length === 0 ? (
            <div className="text-center py-8">
              <FileSpreadsheet className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No hay cargas procesadas</h3>
              <p className="text-muted-foreground mb-4">
                Comienza importando tu primer archivo para ver el historial de cargas aquí.
              </p>
            </div>
          ) : (
            <div className="space-y-4 pt-5">
              {loadHistory.map((load) => (
                <Card key={load.loadId} className="relative overflow-hidden border-2 hover:shadow-lg transition-shadow">
                  <CardContent className="p-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 flex-1 min-w-0">
                        <div className="relative flex-shrink-0">
                          <div className="w-16 h-16 bg-gradient-to-br from-navy-blue to-blue-900 rounded-lg flex items-center justify-center shadow-lg">
                            <FileSpreadsheet className="h-8 w-8 text-white" />
                          </div>
                        </div>

                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-lg truncate" title={load.fileName}>
                            {load.fileName}
                          </h3>
                          <div className="flex items-center gap-2 mt-1">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm text-muted-foreground">
                              {new Date(load.loadDate).toLocaleDateString("es-ES", {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                              })}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 mt-2">
                            <Badge
                              variant={load.loadType === "SALE" ? "destructive" : "default"}
                              className={`text-sm ${load.loadType === "PURCHASE" ? "bg-green-600" : ""}`}
                            >
                              {load.loadType === "SALE" ? (
                                <>
                                  <ShoppingCart className="h-4 w-4 mr-1" />
                                  Venta
                                </>
                              ) : (
                                <>
                                  <Package className="h-4 w-4 mr-1" />
                                  Compra
                                </>
                              )}
                            </Badge>
                          </div>
                        </div>
                      </div>

                      <div className="flex gap-3 flex-shrink-0">
                        <Button 
                          variant="outline" 
                          onClick={() => viewHistoricalLoad(load)}
                          className="bg-transparent"
                        >
                          <Eye className="h-4 w-4" />
                          <span className="ml-2">Visualizar</span>
                        </Button>

                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="outline"
                              className="text-red-600 hover:text-red-700 hover:bg-red-50 bg-transparent"
                              disabled={isReverting === load.loadId}
                            >
                              {isReverting === load.loadId ? (
                                <RefreshCw className="h-4 w-4 animate-spin" />
                              ) : (
                                <Undo2 className="h-4 w-4" />
                              )}
                              <span className="ml-2 hidden sm:inline">Revertir</span>
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>¿Revertir carga?</AlertDialogTitle>
                              <AlertDialogDescription>
                                Esta acción eliminará la carga "{load.fileName}" del historial.
                                Esta acción no se puede deshacer.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel disabled={isReverting === load.loadId}>Cancelar</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleRevertLoad(load.loadId)}
                                className="bg-red-600 hover:bg-red-700"
                                disabled={isReverting === load.loadId}
                              >
                                {isReverting === load.loadId ? (
                                  <>
                                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                                    Revertiendo...
                                  </>
                                ) : (
                                  "Revertir"
                                )}
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Diálogo de importación */}
      <ImportDialog
        isDialogOpen={isDialogOpen}
        setIsDialogOpen={setIsDialogOpen}
        uploadedFile={uploadedFile}
        isUploading={isUploading}
        uploadProgress={uploadProgress}
        handleFileUpload={handleFileUpload}
        handleDragOver={handleDragOver}
        handleDrop={handleDrop}
        handleImport={handleImport}
        setUploadedFile={setUploadedFile}
        setUploadProgress={setUploadProgress}
        setIsUploading={setIsUploading}
      />
    </div>
  );
}