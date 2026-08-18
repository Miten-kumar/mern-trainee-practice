const SENSITIVE_FIELDS = new Set([
  "password",
  "token",
  "accessToken",
  "refreshToken",
  "authorization",
  "apiKey",
  "secret",
  "cardNumber",
  "cvv",
  "email",
  "phone",
]);

const REDACTED_VALUE = "[REDACTED]";

export function redactSensitiveData(
  data: unknown
): Record<string, unknown> {
  if (
    data === null ||
    typeof data !== "object"
  ) {
    return {};
  }

  if (Array.isArray(data)) {
    return {
      value: data.map((item) =>
        redactValue(item)
      ),
    };
  }

  return redactObject(
    data as Record<string, unknown>
  );
}

function redactValue(
  value: unknown
): unknown {
  if (Array.isArray(value)) {
    return value.map((item) =>
      redactValue(item)
    );
  }

  if (
    value !== null &&
    typeof value === "object"
  ) {
    return redactObject(
      value as Record<string, unknown>
    );
  }

  return value;
}

function redactObject(
  object: Record<string, unknown>
): Record<string, unknown> {
  const result: Record<string, unknown> = {};

  for (const [key, value] of Object.entries(
    object
  )) {
    if (SENSITIVE_FIELDS.has(key)) {
      result[key] = REDACTED_VALUE;
    } else {
      result[key] = redactValue(value);
    }
  }

  return result;
}