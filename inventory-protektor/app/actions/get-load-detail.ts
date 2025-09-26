'use server';

import { Order, PurchaseRequest } from "@/lib/types";

// Tipo para la respuesta de la API
export interface ApiLoadDetailResponse {
  fileType: "order" | "purchase_request";
  data: Order[] | PurchaseRequest[];
}

// Tipo para el detalle completo (incluyendo metadatos)
export interface LoadDetail {
  loadId: string;
  fileName: string;
  loadType: "SALE" | "PURCHASE";
  loadDate: string;
  fileType: "order" | "purchase_request";
  data: Order[] | PurchaseRequest[];
}

export async function getLoadDetail(loadId: string): Promise<ApiLoadDetailResponse> {
  try {
    const response = await fetch(`http://localhost:8080/api/loads/${loadId}`, {
      method: 'GET',
    });

    if (!response.ok) {
      throw new Error(`Error en la API: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error al obtener detalle de carga:', error);
    throw new Error('Error al procesar la solicitud');
  }
}