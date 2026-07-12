const redisKeys = {
  // Product Cache Keys
  PRODUCT_LIST: "products:list",

  PRODUCT_LOCK: "products:lock",

  PRODUCT: (id: number): string => `product:${id}`,

  // Session Key
  SESSION: (sessionId: string): string => `session:${sessionId}`,

  // Rate Limiter Key
  RATE_LIMIT: (ip: string): string => `rate:${ip}`,
};

export default redisKeys;