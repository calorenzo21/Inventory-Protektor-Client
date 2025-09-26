import React from "react";
import { Upload } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface FileUploadAreaProps {
  handleDragOver: (e: React.DragEvent) => void;
  handleDrop: (e: React.DragEvent) => void;
  handleFileUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export const FileUploadArea: React.FC<FileUploadAreaProps> = ({
  handleDragOver,
  handleDrop,
  handleFileUpload,
}) => {
  return (
    <div
      className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center hover:border-muted-foreground/50 transition-colors"
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      <Upload className="h-8 w-8 mx-auto mb-4 text-muted-foreground" />
      <p className="text-sm text-muted-foreground mb-2 text-center">
        Arrastra y suelta o{" "}
        <Label htmlFor="file-upload" className="text-primary cursor-pointer underline inline-block">
          Selecciona un archivo
        </Label>{" "}
        <span>para subir</span>
      </p>
      <p className="text-xs text-muted-foreground">XLSX o XLS</p>
      <Input
        id="file-upload"
        type="file"
        accept=".xlsx,.xls"
        className="hidden"
        onChange={handleFileUpload}
      />
    </div>
  );
};