import apiClient from "./client";

import type {
  CreateOrderInput,
  Order,
} from "../types/order.types";

interface OrderResponse {
  success: boolean;
  message: string;
  data: Order;
}

export async function createOrder(
  data: CreateOrderInput
): Promise<Order> {
  const response =
    await apiClient.post<OrderResponse>(
      "/orders",
      data
    );

  return response.data.data;
}

export async function getOrderById(
  id: number
): Promise<Order> {
  const response =
    await apiClient.get<OrderResponse>(
      `/orders/${id}`
    );

  return response.data.data;
}