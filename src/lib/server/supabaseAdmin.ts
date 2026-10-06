import { createClient } from '@supabase/supabase-js';
import { env } from '$env/dynamic/private';
import { PUBLIC_SUPABASE_URL } from '$env/static/public';

/**
 * Service-role client that bypasses RLS. Server-only: used by the Stripe
 * webhook and the checkout flow, which write to `users` without a user session.
 */
export const supabaseAdmin = createClient(
	PUBLIC_SUPABASE_URL,
	env.PRIVATE_SUPABASE_SERVICE_ROLE_KEY ?? '',
	{ auth: { persistSession: false, autoRefreshToken: false } }
);
