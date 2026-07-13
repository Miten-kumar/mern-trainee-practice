const sqlPatterns: RegExp[] = [
  /(\bor\b|\band\b)\s+\d+\s*=\s*\d+/i,
  /union\s+select/i,
  /drop\s+table/i,
  /insert\s+into/i,
  /delete\s+from/i,
  /update\s+\w+\s+set/i,
  /--/,
  /;/,
  /\/\*/,
  /\*\//,
  /xp_cmdshell/i,
];

export function containsSQLInjection(value: string): boolean {
  return sqlPatterns.some((pattern) => pattern.test(value));
}