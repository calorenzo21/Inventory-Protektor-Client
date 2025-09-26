'use server';

export async function revertLoad(loadId: string) {
  console.log("Reverting load with ID:", loadId);
  try {
    const response = await fetch(`http://localhost:8080/api/loads/${loadId}/revert`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Error en la API: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error al revertir la carga:', error);
    throw new Error('Error al revertir la carga');
  }
}