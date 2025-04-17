import { fail } from '@sveltejs/kit';
import { logger } from '$lib/utils/logger';
import type { Actions } from './$types';
import { PUBLIC_URL_DEV, PUBLIC_URL_PROD } from '$env/static/public';

// Determine the base URL based on the environment for redirect URIs
const baseUrl = process.env.NODE_ENV === 'production' ? PUBLIC_URL_PROD : PUBLIC_URL_DEV;

export const actions: Actions = {
    reset: async ({ request, locals: { supabase } }) => {
        const formData = await request.formData();
        const email = formData.get('email') as string;

        if (!email) {
            return fail(400, { message: 'Email is required.', email });
        }

        // Define the URL where the user should be redirected after clicking the reset link
        const redirectUrl = `${baseUrl}/auth/update-password?recovery=true`; 

        const { error } = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: redirectUrl,
        });

        if (error) {
            logger.error('Error sending password reset email:', error);
            return fail(500, { message: 'Server error. Failed to send password reset email. Please try again.', email });
        }

        return { success: true, message: 'Password reset email sent. Check your inbox.' };
    },
}; 