import * as XLSX from 'xlsx';
import { v4 as uuidv4 } from 'uuid';
import { Repository } from 'typeorm';
import { Product } from 'src/products/entities/product.entity';
import { PurchaseRequest } from '../interfaces/purchase-client.interface';
import { BadRequestException } from '@nestjs/common';
import { ProductData } from '../interfaces/order-client.interface';

const PRODUCT_CODE_MAP: Record<string, string> = {
  PRD1: 'PRD-110',
  PRDP1: 'PRDP-110',
  PEE1: 'PEE-110',
  PEEP1: 'PEEP-110',
  PEEPHD1: 'PEEPHD-110',
  PAR1: 'PAR-110',
  PAR2: 'PAR-220',
  PARDA1: 'PARDA-110',
  PARDA2: 'PARDA-220',
  PARE1: 'PARE-110',
  PARE2: 'PARE-220',
  PARTE1: 'PARTE-110',
  PARTE2: 'PARTE-220',
  PMRDA2: 'PMRDA-220',
  USTD2: 'USTD-220',
  USTDA2: 'USTDA-220',
  PARPHD2: 'PARPHD-220',
  SPD1320: 'SPD-1320',
  PARP1: 'PARP-110',
  PARP2: 'PARP-220',
  PARPHD: 'PARPHD-110',
  PARDAP1: 'PARDAP-110',
  PARDAP2: 'PARDAP-220',
  PAREP1: 'PAREP-110',
  PAREP2: 'PAREP-220',
  PARTEP1: 'PARTEP-110',
  PARTEP2: 'PARTEP-220',
};

/**
 * Reads a purchase request sheet from an Excel file and extracts purchase details.
 * @param sheet - The Excel worksheet containing the purchase data.
 * @param productRepo - The repository to fetch product details.
 * @param sheetName - The name of the sheet being processed.
 * @returns A promise that resolves to a PurchaseRequest object.
 */
export const readPurchaseSheet = async (sheet: XLSX.WorkSheet, productRepo: Repository<Product>, sheetName: string): Promise<PurchaseRequest> => {
  const productsData = await getProducts(sheet, productRepo);

  return {
    id: uuidv4(),
    products: productsData,
    totalCost: getTotal(productsData),
    requestDate: getDate(sheet),
    sheetName,
  };
}

/**
 * Gets the date from the specified cell in the worksheet.
 * @param sheet - The Excel worksheet.
 * @returns The date extracted from the cell E8.
 * @throws BadRequestException if the date is not found or invalid.
 */
const getDate = (sheet: XLSX.WorkSheet): Date => {
  const dateCell = sheet['E8'];

  if (!dateCell) {
    throw new BadRequestException('Date not found in cell E8');
  }

  const dateValue = dateCell.v;

  if (typeof dateValue === 'number') {
    const excelBaseDate = new Date(1900, 0, 1);
    const excelDate = new Date(excelBaseDate.getTime() + (dateValue - 2) * 86400000);

    return excelDate;
  } else {
    throw new BadRequestException('Invalid date value in cell E8');
  }
}

/**
 * Extracts products from the Excel worksheet and maps them to PurchaseProduct objects.
 * @param sheet - The Excel worksheet containing product data.
 * @param productRepo - The repository to fetch products from the database.
 * @returns An array of PurchaseProduct objects.
 */
export const getProducts = async (
  sheet: XLSX.WorkSheet,
  productRepo: Repository<Product>
): Promise<ProductData[]> => {
  const products: ProductData[] = [];
  
  // Obtener todos los productos de la base de datos
  const dbProducts = await productRepo.find({ 
    relations: ['category'],
    where: Object.values(PRODUCT_CODE_MAP).map(code => ({ model: code }))
  });

  // Crear mapa de productos por código
  const productMap = new Map<string, Product>();
  dbProducts.forEach(product => {
    productMap.set(product.model, product);
  });

  // Definir rango de columnas (C a T)
  const startCol = 'C'.charCodeAt(0);
  const endCol = 'T'.charCodeAt(0);

  for (let col = startCol; col <= endCol; col++) {
    const colChar = String.fromCharCode(col);
    
    // Celdas para código (fila 13) y cantidad (fila 14)
    const codeCell = sheet[`${colChar}13`];
    const qtyCell = sheet[`${colChar}14`];
    
    if (!codeCell || !qtyCell || qtyCell.v <= 0) continue;
    
    // Normalizar código del Excel
    const excelCode = String(codeCell.v).trim().toUpperCase();
    
    // Buscar código completo en el mapa estático
    const fullCode = PRODUCT_CODE_MAP[excelCode];
    
    if (!fullCode) {
      console.warn(`Código no mapeado: ${excelCode}`);
      continue;
    }
    
    // Buscar producto en el mapa
    const product = productMap.get(fullCode);
    
    if (product) {      
      products.push({
        id: product.productId,
        model: product.model,
        description: product.description || '',
        quantity: qtyCell.v,
        price: product.priceDistribution ? product.priceDistribution : 0,
        total: product.priceDistribution ? product.priceDistribution * qtyCell.v : 0,
        imageUrl: product.imageUrl || '',
        category: product.category?.name || 'Uncategorized'
      });
      console.log(`Modelo: ${product.model}, Precio Distribution: ${product.priceDistribution}, Cantidad: ${qtyCell.v}, Total: ${product.priceDistribution * qtyCell.v}`);
    } else {
      console.warn(`Producto no encontrado: ${fullCode} (${excelCode})`);
    }
  }
  
  return products;
};

/**
 * Calculates the total cost of all products in the purchase request.
 * @param products - The array of products in the purchase request.
 * @returns The total cost.
 */
const getTotal = (products: ProductData[]): number => {
  return products.reduce((sum, product) => sum + product.total, 0);
};
