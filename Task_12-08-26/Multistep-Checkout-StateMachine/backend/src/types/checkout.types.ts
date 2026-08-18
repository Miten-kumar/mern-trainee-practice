export interface CreateCheckoutInput {
  cartId: string;
}

export interface ShippingAddress {
  firstName: string;
  lastName: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  phone: string;
}

export interface UpdateShippingInput {
  shippingAddress: ShippingAddress;
}

export type PaymentMethod = "CARD" | "UPI";

export interface PaymentInput {
  paymentMethod: PaymentMethod;
}