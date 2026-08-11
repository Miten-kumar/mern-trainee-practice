import {
  redactSensitiveData,
} from "../services/redaction.service.js";

export function redact(
  data: unknown
): unknown {
  return redactSensitiveData(data);
}