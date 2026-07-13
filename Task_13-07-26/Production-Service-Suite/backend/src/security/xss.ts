// src/security/xss.ts

import xss from "xss";


/**
 * Sanitize a single string value
 */
export function sanitize(
  value: string
): string {

  return xss(value, {

    // Remove all HTML tags
    whiteList: {},

    // Remove unknown tags completely
    stripIgnoreTag: true,

    // Remove content inside script/style tags
    stripIgnoreTagBody: [
      "script",
      "style"
    ]

  });

}


/**
 * Recursively sanitize objects
 * Used for req.body, params etc.
 */
export function sanitizeObject(
  data: unknown
): unknown {


  // String value
  if (
    typeof data === "string"
  ) {

    return sanitize(data);

  }


  // Array value
  if (
    Array.isArray(data)
  ) {

    return data.map(
      (item) =>
        sanitizeObject(item)
    );

  }


  // Object value
  if (
    typeof data === "object" &&
    data !== null
  ) {

    const cleanObject:
      Record<string, unknown> = {};


    Object.entries(data)
      .forEach(
        ([key, value]) => {

          cleanObject[key] =
            sanitizeObject(value);

        }
      );


    return cleanObject;

  }


  // Number, boolean, null etc.
  return data;

}