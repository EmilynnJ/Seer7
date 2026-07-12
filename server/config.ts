import "dotenv/config";
import { z } from "zod";

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  PORT: z.coerce.number().int().positive().default(4000),
  CORS_ORIGIN: z.string().default("http://localhost:5173"),

  SUPABASE_URL: z.string().url(),
  SUPABASE_JWKS_URL: z.string().url(),
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1, "SUPABASE_SERVICE_ROLE_KEY is required"),
  SUPABASE_JWT_SECRET: z.string().optional(),

  STRIPE_SECRET_KEY: z.string().optional(),
  STRIPE_WEBHOOK_SIGNING_SECRET: z.string().optional(),

  CLOUDFLARE_MOQ_RELAY_URL: z.string().default("draft-14.cloudflare.mediaoverquic.com"),
  CLOUDFLARE_ACCOUNT_ID: z.string().optional(),
  CLOUDFLARE_TURN_SERVERS_API_KEY: z.string().optional(),
  CLOUDFLARE_REALTIME_APP_ID: z.string().optional(),
  CLOUDFLARE_REALTIME_TOKEN: z.string().optional(),
  CLOUDFLARE_REALTIME_WEBHOOK_ID: z.string().optional(),
  CLOUDFLARE_SERVERLESS_SFU: z.string().optional(),

  REDIS_DB_USERNAME: z.string().default("default"),
  REDIS_DB_HOST: z.string().optional(),
  REDIS_DB_PASSWORD: z.string().optional(),
  REDIS_DB_ENDPOINT: z.string().optional(),
  REDIS_DB_PORT: z.coerce.number().int().positive().optional(),

  CLOUDINARY_BUCKET_NAME: z.string().default("SoulSeer"),
  CLOUDINARY_API_KEY: z.string().optional(),
  CLOUDINARY_SECRET: z.string().optional(),
});

/**
 * Parsed, validated environment configuration.
 * Fails fast at boot if required secrets are missing.
 */
const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  // eslint-disable-next-line no-console
  console.error("Invalid environment configuration:", parsed.error.flatten().fieldErrors);
  throw new Error("Invalid environment configuration. Check your .env file against .env.example.");
}

export const env = parsed.data;
export const isProduction = env.NODE_ENV === "production";
