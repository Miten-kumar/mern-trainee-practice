import sanitizeHtml from "sanitize-html";

export const sanitizeText = (
  value: string
): string => {
  return sanitizeHtml(value, {
    allowedTags: [],
    allowedAttributes: {},
  }).trim();
};