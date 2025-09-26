import React from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import Image from "next/image";
import { Order } from "../lib/types";
import { getCategoryColor } from "./data-table";

// Función para formatear la fecha
const formatDate = (dateString: string) => {
  const date = new Date(dateString);

  // Manejar fechas inválidas
  if (isNaN(date.getTime())) {
    return "Fecha inválida";
  }

  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();

  return `${day}/${month}/${year}`;
};

interface OrderPreviewProps {
  orders: Order[];
}

export const OrderPreview: React.FC<OrderPreviewProps> = ({
  orders,
}) => {
  return (
    <Accordion type="single" collapsible className="w-full">
      {orders.map((order) => (
        <AccordionItem key={order.id} value={order.id}>
          <AccordionTrigger className="hover:no-underline">
            <div className="flex items-center justify-between w-full pr-4">
              <div className="flex items-center gap-4">
                <div className="text-left">
                  <p className="font-semibold">{order.clientName}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className="font-medium">${order.total.toFixed(2)}</p>
                  <p className="text-sm text-muted-foreground font-normal">{formatDate(order.orderDate)}</p>
                </div>
              </div>
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-4 pt-4">
              <div className="grid gap-4">
                {order.products.map((product) => (
                  <div key={product.id} className="flex items-center gap-4 p-4 border rounded-lg bg-gray-50">
                    <Image
                      src={`/images/${product.imageUrl || 'placeholder.svg'}`}
                      alt={product.model}
                      width={80}
                      height={80}
                      className="rounded-md object-cover"
                      onError={(e) => {
                        e.currentTarget.onerror = null; // Previene loops de error
                        e.currentTarget.src = "/placeholder.svg";
                      }}
                    />
                    <div className="flex-1">
                      <h4 className="font-semibold">{product.model}</h4>
                      <p className="text-sm text-muted-foreground mb-2 font-normal">{product.description}</p>
                      <Badge variant="outline" className={`${getCategoryColor(product.category)} font-normal`}>{product.category.split(' ')[0]}</Badge>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">${Number(product.price).toFixed(2)}</p>
                      <p className="text-sm text-muted-foreground">Cant: {product.quantity}</p>
                      <p className="text-sm font-medium">
                        Total: ${(Number(product.price) * product.quantity).toFixed(2)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              <Separator />
              <div className="flex justify-between items-center">
                <div className="text-sm text-muted-foreground">
                  ID de Orden: {order.id} • {order.products.length} artículos
                </div>
                <div className="text-lg font-bold">Total: ${order.total.toFixed(2)}</div>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
};