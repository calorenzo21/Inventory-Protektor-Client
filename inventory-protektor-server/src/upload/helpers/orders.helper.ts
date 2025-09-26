import * as XLSX from 'xlsx';
import { Order, ProductData } from '../interfaces/order-client.interface';
import { v4 as uuidv4 } from 'uuid';
import { BadRequestException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Product } from 'src/products/entities/product.entity';

/**
 * Reads an order sheet from an Excel file and extracts order details.
 * @param sheet - The Excel worksheet containing the order data.
 * @param productRepo - The repository to fetch product details.
 * @returns A promise that resolves to an Order object.
 */
export const readOrderSheet = async (sheet: XLSX.WorkSheet, productRepo: Repository<Product>, sheetName: string): Promise<Order> => {
  return {
      id: uuidv4(),
      clientName: getClientName(sheet),
      products: await getProducts(sheet, productRepo),
      total: getBase(sheet),
      orderDate: getDate(sheet),
      sheetName,
  };
}

/**
 * Gets the date from the specified cell in the worksheet.
 * @param sheet - The Excel worksheet.
 * @returns The date extracted from the cell J4.
 * @throws BadRequestException if the date is not found or invalid.
 */
const getDate = (sheet: XLSX.WorkSheet): Date => {
  const dateCell = sheet['J4'];

  if (!dateCell) {
    throw new BadRequestException('Date not found in cell J4');
  }

  const dateValue = dateCell.v;

  if (typeof dateValue === 'number') {
    const excelBaseDate = new Date(1900, 0, 1);
    const excelDate = new Date(excelBaseDate.getTime() + (dateValue - 2) * 86400000);

    return excelDate;
  } else {
    throw new BadRequestException('Invalid date value in cell J4');
  }
}

/**
 * Gets the base value from the specified cell in the worksheet.
 * @param sheet - The Excel worksheet.
 * @returns The base value extracted from the cell G27.
 * @throws BadRequestException if the base value is not found.
 */  
const getBase = (sheet: XLSX.WorkSheet): number => {
  const baseCell = sheet['G27'];

  if (!baseCell) {
    throw new BadRequestException('Base value not found in cell G27');
  }

  return baseCell.v;
}

/**
 * Gets the client name from the specified cell in the worksheet.
 * @param sheet - The Excel worksheet.
 * @returns The client name extracted from the cell B5.
 * @throws BadRequestException if the client name is not found.
 */
const getClientName = (sheet: XLSX.WorkSheet): string => {
  const clientNameCell = sheet['B5'];

  if (!clientNameCell) {
    throw new BadRequestException('Client name not found in cell B5');
  }

  return clientNameCell.v;
}

/**
 * Extracts product details from the worksheet and checks against the database.
 * @param sheet - The Excel worksheet containing product data.
 * @param productRepo - The repository to fetch product details.
 * @returns A promise that resolves to an array of ProductData objects.
 */
const getProducts = async (sheet: XLSX.WorkSheet, productRepo: Repository<Product>): Promise<ProductData[]> => {
  const products: ProductData[] = [];

  for (let i = 7; i < 25; i++) {  
    const productCell = sheet[`A${i + 1}`];
    const quantityCell = sheet[`E${i + 1}`];
    const unitPriceCell = sheet[`F${i + 1}`];
    const totalCell = sheet[`G${i + 1}`];

    if (productCell && quantityCell && quantityCell.v > 0) {
      const product = await productRepo.findOne({ where: { model: productCell.v }, relations: ['category'] });

      if (product) {
        products.push({
          id: product.productId,
          model: productCell.v,
          description: product.description || '',
          quantity: quantityCell.v,
          price: unitPriceCell ? unitPriceCell.v : 0,
          total: totalCell ? totalCell.v : 0,
          category: product.category ? product.category.name : 'Uncategorized',
          imageUrl: product.imageUrl || '',
        });
      }
    }
  }
  return products;
}