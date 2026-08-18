import { randomUUID } from "crypto";

export function generateCorrelationId(): string {
  return randomUUID();
}

export function getCorrelationId(
  incomingId?: string
): string {
  return incomingId?.trim() || generateCorrelationId();
}