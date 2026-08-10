import apiClient from "./client";
import type { PaymentResponse, } from "../types/payment.types";


export async function getPayment(
  orderId: number
) {
  const response =
    await apiClient.get<PaymentResponse>(
      `/payments/${orderId}`
    );

  return response.data.data;
}