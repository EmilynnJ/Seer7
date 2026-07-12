import type { NextFunction, Request, Response } from "express";
import { createRemoteJWKSet, jwtVerify } from "jose";
import { env } from "../config";

export type UserRole = "client" | "reader" | "admin";

export interface AuthenticatedUser {
  authId: string;
  email: string | undefined;
  role: UserRole;
}

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      user?: AuthenticatedUser;
    }
  }
}

// Cached remote JWKS - Supabase rotates keys; jose handles caching/refresh internally.
const jwks = createRemoteJWKSet(new URL(env.SUPABASE_JWKS_URL));

/**
 * Validates the Supabase-issued JWT from the Authorization: Bearer header.
 * This is the ONLY source of truth for identity/role on the backend.
 * The client's claimed role is NEVER trusted without this verification.
 */
export async function requireAuth(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const header = req.headers.authorization;
    if (!header?.startsWith("Bearer ")) {
      res.status(401).json({ error: "Missing or malformed Authorization header" });
      return;
    }

    const token = header.slice("Bearer ".length).trim();
    const { payload } = await jwtVerify(token, jwks, {
      issuer: `${env.SUPABASE_URL}/auth/v1`,
    });

    const role = (payload["user_role"] as UserRole | undefined) ??
      (payload["app_metadata"] as { role?: UserRole } | undefined)?.role ??
      "client";

    req.user = {
      authId: String(payload.sub),
      email: typeof payload.email === "string" ? payload.email : undefined,
      role,
    };

    next();
  } catch {
    res.status(401).json({ error: "Invalid or expired token" });
  }
}

/**
 * Role gate. Must run after requireAuth. Server-side enforcement only -
 * frontend role state is never trusted for authorization decisions.
 */
export function requireRole(...allowed: UserRole[]) {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({ error: "Not authenticated" });
      return;
    }
    if (!allowed.includes(req.user.role)) {
      res.status(403).json({ error: "Insufficient permissions" });
      return;
    }
    next();
  };
}
