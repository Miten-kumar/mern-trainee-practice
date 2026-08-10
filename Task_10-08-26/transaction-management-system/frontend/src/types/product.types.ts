export interface Product {
  id: number;

  name: string;

  price: string;

  stock: number;

  version: number;

  createdAt?: string;

  updatedAt?: string;
}

export interface ProductsResponse {
  success: boolean;

  data: Product[];
}

export interface ProductResponse {
  success: boolean;

  data: Product;
}