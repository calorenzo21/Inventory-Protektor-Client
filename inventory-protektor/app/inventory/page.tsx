import { DataTable } from '@/components/data-table';
import React from 'react';
import { getAllProducts } from '@/app/actions/get-products';

export default async function Inventory() {
  try {
    // Obtener datos del servidor
    const products = await getAllProducts();
    
    return (
      <div className="flex flex-1 flex-col">
        <div className="@container/main flex flex-1 flex-col gap-2">
          <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
            {/* Pasar los productos al DataTable */}
            <DataTable data={products} />
          </div>
        </div>
      </div>
    );
    
  } catch (error) {
    // Manejar errores
    console.error('Error en Inventory:', error);
    return (
      <div className="flex flex-1 flex-col">
        <div className="@container/main flex flex-1 flex-col gap-2">
          <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
            <p className="text-red-500">Error al cargar los productos</p>
          </div>
        </div>
      </div>
    );
  }
}