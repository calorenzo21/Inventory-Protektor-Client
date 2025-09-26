export type FileType = "order" | "purchase_request";

export interface PurchaseRequest {
  id: string;
  requestDate: string;
  products: Product[];
  totalCost: number;
  sheetName: string;
}

export interface Product {
  id: string;
  model: string;
  description: string;
  quantity: number;
  price: number | string;
  total: number;
  category: string;
  imageUrl: string;
}

export interface Order {
  id: string;
  clientName: string;
  products: Product[];
  total: number;
  orderDate: string;
  sheetName: string;
}

export interface LoadHistory {
  id: string;
  fileName: string;
  fileType: FileType;
  processedDate: Date;
  data: Order[] | PurchaseRequest[];
}