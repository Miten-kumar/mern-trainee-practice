import apiClient from "./client";

import type {
  Product,
} from "../types/product.types";

interface ProductsResponse {
  success: boolean;
  data: Product[];
}

export async function getProducts(): Promise<Product[]> {
  const response =
    await apiClient.get<ProductsResponse>(
      "/products"
    );

  return response.data.data;
}

export async function getProductById(
  id: number
): Promise<Product> {
  const products = await getProducts();

  const product = products.find(
    (item) => item.id === id
  );

  if (!product) {
    throw new Error("Product not found");
  }

  return product;
}