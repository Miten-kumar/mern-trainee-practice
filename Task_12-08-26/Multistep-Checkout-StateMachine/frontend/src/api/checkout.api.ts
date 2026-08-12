import axios from "axios";

import type {
  Checkout,
  CreateCheckoutPayload,
  PaymentPayload,
  ShippingAddress,
} from "../machine/checkout.types.js";

const API_URL = import.meta.env.VITE_API_URL;

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
}

/**
 * Create checkout
 *
 * POST /api/v1/checkout
 */
export async function createCheckout(
  payload: CreateCheckoutPayload
): Promise<Checkout> {
  const response = await api.post<ApiResponse<Checkout>>(
    "/checkout",
    payload
  );

  return response.data.data;
}

/**
 * Get existing checkout
 *
 * GET /api/v1/checkout/:id
 */
export async function getCheckout(
  checkoutId: string
): Promise<Checkout> {
  const response = await api.get<ApiResponse<Checkout>>(
    `/checkout/${checkoutId}`
  );

  return response.data.data;
}

/**
 * Update shipping information
 *
 * PATCH /api/v1/checkout/:id/shipping
 */
export async function updateShipping(
  checkoutId: string,
  shippingAddress: ShippingAddress
): Promise<Checkout> {
  const response = await api.patch<ApiResponse<Checkout>>(
    `/checkout/${checkoutId}/shipping`,
    {
      shippingAddress,
    }
  );

  return response.data.data;
}

/**
 * Process payment
 *
 * POST /api/v1/checkout/:id/payment
 */
export async function processPayment(
  checkoutId: string,
  payload: PaymentPayload
): Promise<Checkout> {
  const response = await api.post<ApiResponse<Checkout>>(
    `/checkout/${checkoutId}/payment`,
    payload
  );

  return response.data.data;
}

/**
 * Retry failed payment
 *
 * POST /api/v1/checkout/:id/payment/retry
 */
export async function retryPayment(
  checkoutId: string,
  payload: PaymentPayload
): Promise<Checkout> {
  const response = await api.post<ApiResponse<Checkout>>(
    `/checkout/${checkoutId}/payment/retry`,
    payload
  );

  return response.data.data;
}