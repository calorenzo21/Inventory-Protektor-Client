'use server';

import { Order } from "@/lib/types";

export async function processSalesLoad(fileName: string, data: Order[]) {
  const payload = {
    fileName,
    fileType: 'order' as const,
    data
  };

  console.log("Processing sales load with payload:", payload);
  try {
    const response = await fetch('http://localhost:8080/api/loads/sales-loads', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      throw new Error(`Error en la API: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error al procesar carga de ventas:', error);
    throw new Error('Error al procesar la carga de ventas');
  }
}