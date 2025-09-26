'use server';

// Tipo para el historial desde la API
export interface ApiLoadHistory {
  loadId: string;
  fileName: string;
  loadType: "SALE" | "PURCHASE";
  loadDate: string;
}

export async function getLoadHistory(): Promise<ApiLoadHistory[]> {
  try {
    const response = await fetch('http://localhost:8080/api/loads/history', {
      method: 'GET',
    });

    if (!response.ok) {
      throw new Error(`Error en la API: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error al obtener historial de cargas:', error);
    throw new Error('Error al procesar la solicitud');
  }
}