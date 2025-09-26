'use server';

import { PurchaseRequest } from '@/lib/types';

// Server Action para procesar solicitudes de compra
export async function processPurchaseLoad(fileName: string, data: PurchaseRequest[]) {
  const payload = {
    fileName,
    fileType: 'purchase_request' as const,
    data
  };

  console.log('Procesando carga de compras:', JSON.stringify(payload));
  try {
    const response = await fetch('http://localhost:8080/api/loads/purchase-loads', {
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
    console.error('Error al procesar carga de compras:', error);
    throw new Error('Error al procesar la carga de compras');
  }
}