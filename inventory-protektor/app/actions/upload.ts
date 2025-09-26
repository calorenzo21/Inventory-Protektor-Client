'use server';

export async function uploadFile(file: File) {
  const formData = new FormData();
  formData.append('file', file);

  try {
    const response = await fetch('http://localhost:8080/api/loads/read', {
      method: 'POST',
      body: formData
    });

    if (!response.ok) {
      throw new Error(`Error en la API: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error al subir archivo:', error);
    throw new Error('Error al procesar el archivo');
  }
}