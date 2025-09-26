import { ProductData } from "./order-client.interface";

export interface PurchaseRequest {
  id: string;
  requestDate: Date;
  products: ProductData[];
  totalCost: number;
  sheetName: string;
}