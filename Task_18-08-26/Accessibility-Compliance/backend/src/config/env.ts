import dotenv from "dotenv";

dotenv.config();

const requiredEnvVariables = [
  "DATABASE_URL",
  "FRONTEND_URL",
];

for (const variable of requiredEnvVariables) {
  if (!process.env[variable]) {
    throw new Error(`Missing required environment variable: ${variable}`);
  }
}

export const env = {
  port: Number(process.env.PORT) || 5000,

  nodeEnv: process.env.NODE_ENV || "development",

  databaseUrl: process.env.DATABASE_URL,

  frontendUrl: process.env.FRONTEND_URL!,
};