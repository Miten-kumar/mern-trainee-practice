export type OrderStatus =
  | "PENDING"
  | "CONFIRMED"
  | "FAILED"
  | "CANCELLED";

export type PaymentStatus =
  | "PENDING"
  | "SUCCESS"
  | "FAILED"
  | "REFUNDED";

export interface OrderItemInput {
  productId: number;

  quantity: number;
}

export interface CreateOrderInput {
  userId: number;

  items: OrderItemInput[];
}

export interface OrderItem {
  id: number;

  orderId: number;

  productId: number;

  quantity: number;

  price: string;
}

export interface Payment {
  id: number;

  orderId: number;

  amount: string;

  status: PaymentStatus;

  transactionId: string | null;
}

export interface Order {
  id: number;

  userId: number;

  totalAmount: string;

  status: OrderStatus;

  items: OrderItem[];

  payment: Payment | null;

  createdAt?: string;

  updatedAt?: string;
}

export interface OrderResponse {
  success: boolean;

  message: string;

  data: Order;
}

export interface OrdersResponse {
  success: boolean;

  data: Order[];
}