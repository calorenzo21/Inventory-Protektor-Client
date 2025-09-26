import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { X, FileSpreadsheet } from "lucide-react";
import { FileUploadArea } from "./file-upload-area";

interface ImportDialogProps {
  isDialogOpen: boolean;
  setIsDialogOpen: (open: boolean) => void;
  uploadedFile: File | null;
  isUploading: boolean;
  uploadProgress: number;
  handleFileUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleDragOver: (e: React.DragEvent) => void;
  handleDrop: (e: React.DragEvent) => void;
  handleImport: () => void;
  setUploadedFile: (file: File | null) => void;
  setUploadProgress: (progress: number) => void;
  setIsUploading: (isUploading: boolean) => void;
}

export const ImportDialog: React.FC<ImportDialogProps> = ({
  isDialogOpen,
  setIsDialogOpen,
  uploadedFile,
  isUploading,
  uploadProgress,
  handleFileUpload,
  handleDragOver,
  handleDrop,
  handleImport,
  setUploadedFile,
  setUploadProgress,
  setIsUploading,
}) => {
  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileSpreadsheet className="h-5 w-5" />
            Importar Datos de Inventario
          </DialogTitle>
          <DialogDescription>
            Sube tu archivo Excel con órdenes (para disminuir inventario) o solicitudes de compra (para aumentar inventario).
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <FileUploadArea
            handleDragOver={handleDragOver}
            handleDrop={handleDrop}
            handleFileUpload={handleFileUpload}
          />

          {uploadedFile && (
            <div className="space-y-2">
              <div className="flex items-center gap-2 p-3 bg-muted rounded-lg">
                <FileSpreadsheet className="h-4 w-4 text-green-600" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{uploadedFile.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {(uploadedFile.size / 1024).toFixed(0)}KB
                    {isUploading &&
                      ` • ${Math.round((uploadedFile.size / 1024) * (uploadProgress / 100))}KB subidos`}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setUploadedFile(null);
                    setUploadProgress(0);
                    setIsUploading(false);
                  }}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              {isUploading && <Progress value={uploadProgress} className="w-full" />}
            </div>
          )}

          <Separator />
        </div>

        <div className="flex items-center justify-end pt-4">
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => { setIsDialogOpen(false); setUploadedFile(null); setUploadProgress(0); setIsUploading(false); }}>
              Cancelar
            </Button>
            <Button onClick={handleImport} disabled={!uploadedFile || isUploading}>
              {isUploading ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  {uploadProgress < 100 ? "Subiendo..." : "Procesando..."}
                </div>
              ) : 'Importar'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};