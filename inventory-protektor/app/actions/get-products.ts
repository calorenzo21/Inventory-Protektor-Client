'use server';

export async function getAllProducts() {
  try {
    const response = await fetch('http://localhost:8080/api/products', {
      method: 'GET',
    });

    if (!response.ok) {
      throw new Error(`Error en la API: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error al obtener productos:', error);
    throw new Error('Error al procesar la solicitud');
  }
}