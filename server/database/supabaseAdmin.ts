import { createClient, SupabaseClient } from "@supabase/supabase-js";
import WebSocket from "ws";
import { env } from "../config";

/**
 * Admin (service-role) Supabase client.
 * SERVER-SIDE ONLY. Never send this client or the service role key to the browser.
 * Bypasses RLS - use only for trusted backend operations after auth/role checks.
 *
 * `ws` is supplied explicitly as the WebSocket transport for the realtime client
 * because Node.js < 22 has no native WebSocket implementation available to the
 * Supabase SDK.
 */
export const supabaseAdmin: SupabaseClient = createClient(env.SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  realtime: { transport: WebSocket as any },
});
