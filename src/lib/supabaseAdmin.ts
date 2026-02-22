import { createClient } from "@supabase/supabase-js";

/**
 * Admin Supabase client using the Service Role Key.
 * This client bypasses Row Level Security (RLS) and should
 * ONLY be used inside Next.js Server Actions — never on the client.
 */
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRoleKey);
