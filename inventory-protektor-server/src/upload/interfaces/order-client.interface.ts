export interface ProductData {
  id: string;
  model: string;
  description: string;
  price: number;
  quantity: number;
  total: number;
  imageUrl: string;
  category: string;
}

export interface Order {
  id: string;
  clientName: string;
  orderDate: Date;
  products: ProductData[];
  total: number;
  sheetName: string;
}