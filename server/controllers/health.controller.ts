import type { Request, Response } from "express";
import { supabaseAdmin } from "../database/supabaseAdmin";

/**
 * Liveness/readiness probe. Checks process health and a lightweight
 * Supabase connectivity check (no sensitive data returned).
 */
export async function getHealth(_req: Request, res: Response): Promise<void> {
  let dbStatus: "ok" | "error" = "ok";

  try {
    const { error } = await supabaseAdmin.from("users").select("id").limit(1);
    if (error) dbStatus = "error";
  } catch {
    dbStatus = "error";
  }

  const healthy = dbStatus === "ok";

  res.status(healthy ? 200 : 503).json({
    status: healthy ? "ok" : "degraded",
    service: "soulseer-api",
    timestamp: new Date().toISOString(),
    checks: {
      database: dbStatus,
    },
  });
}
