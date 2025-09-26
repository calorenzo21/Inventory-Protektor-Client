import React from "react";
import { Button } from "@/components/ui/button";
import { FileSpreadsheet, Upload } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface NoFilesImportedProps {
  setIsDialogOpen: (open: boolean) => void;
}

export const NoFilesImported: React.FC<NoFilesImportedProps> = ({ 
  setIsDialogOpen 
}) => {
  return (
    <Card className="text-center py-12">
      <CardContent>
        <FileSpreadsheet className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
        <h3 className="text-lg font-semibold mb-2">No se han Importado Archivos</h3>
        <p className="text-muted-foreground mb-4">
          Importa tu archivo Excel con órdenes o solicitudes de compra para gestionar el inventario
        </p>
        <Button onClick={() => setIsDialogOpen(true)}>
          <Upload className="h-4 w-4 mr-2" />
          Importar Archivo
        </Button>
      </CardContent>
    </Card>
  );
};