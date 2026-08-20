import dotenv from "dotenv";

dotenv.config();

const getEnv = (
  key: string,
  defaultValue?: string
): string => {
  const value = process.env[key] ?? defaultValue;

  if (!value) {
    throw new Error(
      `Missing required environment variable: ${key}`
    );
  }

  return value;
};

const portValue = Number(
  getEnv("PORT", "5000")
);

if (!Number.isInteger(portValue) || portValue <= 0) {
  throw new Error("PORT must be a valid positive number");
}

export const env = {
  nodeEnv: getEnv(
    "NODE_ENV",
    "development"
  ),

  port: portValue,

  frontendUrl: getEnv(
    "FRONTEND_URL",
    "http://localhost:5173"
  )
} as const;