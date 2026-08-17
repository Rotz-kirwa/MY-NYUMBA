import { z } from "zod";

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  DATABASE_URL: z.string().optional(),
  SESSION_SECRET: z.string().default("mynyumba_default_super_secret_session_key_2026"),
  PORT: z.string().optional().default("10000"),

  // M-Pesa Integration Credentials
  MPESA_ENVIRONMENT: z.enum(["sandbox", "production"]).default("sandbox"),
  MPESA_CONSUMER_KEY: z.string().optional().default("MOCK_KEY"),
  MPESA_CONSUMER_SECRET: z.string().optional().default("MOCK_SECRET"),
  MPESA_PASSKEY: z.string().optional().default("MOCK_PASSKEY"),
  MPESA_SHORTCODE: z.string().optional().default("174379"),
  MPESA_CALLBACK_URL: z.string().optional().default("https://mynyumba.co.ke/api/v1/mpesa/callback"),
});

function parseEnv() {
  const result = envSchema.safeParse(process.env);
  if (!result.success) {
    console.error("❌ Invalid environment variables:", result.error.format());
    throw new Error("Invalid environment configuration");
  }
  return result.data;
}

export const env = parseEnv();
