export interface CreateOrderItemInput {
  productId: number;
  quantity: number;
}

export interface CreateOrderInput {
  userId: number;
  items: CreateOrderItemInput[];
}