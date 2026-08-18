import type {
  Request,
  Response,
  NextFunction,
} from "express";

import sanitizeHtml from "sanitize-html";

const sanitizeValue = (
  value: unknown
): unknown => {
  if (typeof value === "string") {
    return sanitizeHtml(value, {
      allowedTags: [],
      allowedAttributes: {},
    }).trim();
  }

  if (Array.isArray(value)) {
    return value.map(sanitizeValue);
  }

  if (
    value !== null &&
    typeof value === "object"
  ) {
    const sanitized: Record<
      string,
      unknown
    > = {};

    for (const [key, nestedValue] of Object.entries(
      value as Record<string, unknown>
    )) {
      sanitized[key] =
        sanitizeValue(nestedValue);
    }

    return sanitized;
  }

  return value;
};

export const sanitizeBody = (
  req: Request,
  _res: Response,
  next: NextFunction
): void => {
  req.body = sanitizeValue(req.body);

  next();
};