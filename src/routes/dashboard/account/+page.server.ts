import { error, json } from '@sveltejs/kit';
import Stripe from 'stripe';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals: { supabase } }) => {
    const { data: { session } } = await supabase.auth.getSession();

    if (!session) {
        throw error(401, 'Unauthorized');
    }

    // Fetch user data including role
    const { data: userData, error: userError } = await supabase
        .from('users')
        .select(`
            email,
            roles (
                role_name
            )
        `)
        .eq('id', session.user.id)
        .single();

    if (userError) {
        console.error('Error fetching user data:', userError);
        throw error(500, 'Error fetching user data');
    }

    return {
        user: {
            ...session.user,
            email: userData?.email,
            last_sign_in_at: session.user.last_sign_in_at, // From session
            role_name: userData?.roles?.role_name
        }
    };
};
