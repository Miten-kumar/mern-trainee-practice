import type { PaymentStatus } from "./order.types";


export interface Payment {
  id: number;

  orderId: number;

  amount: string;

  status: PaymentStatus;

  transactionId: string | null;

  createdAt?: string;

  updatedAt?: string;
}

export interface PaymentResponse {
  success: boolean;

  message?: string;

  data: Payment;
}