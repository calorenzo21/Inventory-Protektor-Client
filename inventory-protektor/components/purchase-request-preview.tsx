import React from "react";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import { PurchaseRequest } from "../lib/types";
import { getCategoryColor } from "./data-table";

interface PurchaseRequestPreviewProps {
  purchaseRequest: PurchaseRequest;
}

export const PurchaseRequestPreview: React.FC<PurchaseRequestPreviewProps> = ({
  purchaseRequest,
}) => {

  return (
    <div className="space-y-6">
      <div className="grid gap-4">
        {purchaseRequest.products.map((product) => (
          <div key={product.id} className="flex items-center gap-4 p-4 border bg-gray-50 rounded-lg">
            {product.imageUrl ? (
              <Image
                src={`/images/${product.imageUrl}`}
                alt={product.model}
                width={80}
                height={80}
                className="rounded-md object-contain"
              />
            ) : (
              <span className="text-xs text-gray-500 text-center">Imagen<br />no disponible</span>
            )}
            <div className="flex-1">
              <h4 className="font-semibold">{product.model}</h4>
              <p className="text-sm text-muted-foreground mb-2 line-clamp-1">{product.description}</p>
              <Badge variant="outline" className={`${getCategoryColor(product.category)} font-normal`}>{product.category.split(' ')[0]}</Badge>
            </div>
            <div className="text-right min-w-[120px]">
              <p className="font-semibold">${Number(product.price).toFixed(2)} c/u</p>
              <p className="text-sm text-muted-foreground">Cant: {product.quantity}</p>
              <p className="text-sm font-medium">Total: ${Number(product.total).toFixed(2)}</p>
            </div>
          </div>
        ))}
      </div>
      {/* </div> */}
    </div>
  );
};