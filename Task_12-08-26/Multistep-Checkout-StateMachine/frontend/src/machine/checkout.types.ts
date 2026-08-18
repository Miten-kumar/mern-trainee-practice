export interface ShippingAddress {
  firstName: string;
  lastName: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  phone: string;
}

export type PaymentMethod = "CARD" | "UPI" | "FAIL";


export interface Checkout {
  id: string;

  cartId: string;

  status:
    | "CART"
    | "SHIPPING"
    | "PAYMENT"
    | "PAYMENT_ERROR"
    | "CONFIRMATION";

  shippingAddress: ShippingAddress | null;

  paymentStatus:
    | "PENDING"
    | "PROCESSING"
    | "SUCCESS"
    | "FAILED";

  orderId: string | null;

  retryCount: number;

  errorMessage: string | null;
}

export interface CreateCheckoutPayload {
  cartId: string;
}

export interface PaymentPayload {
  paymentMethod: PaymentMethod;
}