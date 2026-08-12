class AppError extends Error {
  constructor(message, statusCode, code) {
    super(message);
    this.name = this.constructor.name;
    this.statusCode = statusCode;
    this.code = code;
  }
}

class InsufficientStockError extends AppError {
  constructor(sku, requested, available) {
    super(`Not enough stock for ${sku}: requested ${requested}, available ${available}`, 409, 'INSUFFICIENT_STOCK');
    this.sku = sku;
    this.requested = requested;
    this.available = available;
  }
}

class OptimisticLockError extends AppError {
  constructor(productId) {
    super(`Product ${productId} was modified concurrently, retry needed`, 409, 'LOCK_CONFLICT');
    this.productId = productId;
  }
}

class PaymentDeclinedError extends AppError {
  constructor(reason) {
    super(`Payment declined: ${reason}`, 402, 'PAYMENT_DECLINED');
    this.reason = reason;
  }
}

class NotFoundError extends AppError {
  constructor(entity, id) {
    super(`${entity} ${id} not found`, 404, 'NOT_FOUND');
  }
}

class ValidationError extends AppError {
  constructor(message) {
    super(message, 400, 'VALIDATION_ERROR');
  }
}

module.exports = {
  AppError,
  InsufficientStockError,
  OptimisticLockError,
  PaymentDeclinedError,
  NotFoundError,
  ValidationError
};
