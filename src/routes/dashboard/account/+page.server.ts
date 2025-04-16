import { fail, redirect, type RequestHandler } from '@sveltejs/kit';
import { logger } from '$lib/utils/logger';
import type { Actions } from './$types';
import Stripe from 'stripe';
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import type { PostgrestError } from '@supabase/supabase-js';

import { PRIVATE_STRIPE_SECRET_KEY } from '$env/static/private';
import { PUBLIC_URL_DEV, PUBLIC_URL_PROD } from '$env/static/public';

const stripe = new Stripe(PRIVATE_STRIPE_SECRET_KEY);

export const actions: Actions = {
	signup: async ({ request, locals: { supabase } }) => {
		let sessionUrl: string | null = '';
		let error: string = '';
		console.log('Signup action called');
		const formData = await request.formData();
		const email = formData.get('email') as string;
		const password = formData.get('password') as string;
		const priceId = formData.get('priceId') as string; // Get the selected plan
		const mainUrl = process.env.NODE_ENV === 'production' ? PUBLIC_URL_PROD : PUBLIC_URL_DEV;

		// Step 1: Create a Stripe Checkout session
		try {
			const session = await stripe.checkout.sessions.create({
				payment_method_types: ['card'],
				line_items: [
					{
						price: priceId, // Use the selected plan
						quantity: 1,
					},
				],
				mode: 'subscription',
				success_url: `${mainUrl}/?session_id={CHECKOUT_SESSION_ID}&status=success`,
				cancel_url: `${mainUrl}/?session_id={CHECKOUT_SESSION_ID}&status=cancel`,
				metadata: {
					email: email,
					password: password,
				},
			});


			if (!session.url) {
				error = 'Could not initialize a payment. Please try again later.';
			}

			logger.success('Stripe session created successfully');
			sessionUrl = session.url;
		} catch (error) {
			logger.error('An error occurred when initializing checkout: ', error);
			return redirect(303, '/auth/error');
		}

		if (error) {
			return fail(500, { message: error });
		}

		if (!sessionUrl) {
			return fail(500, {
				message: 'The checkout session could not be generated. Please try again later'
			});
		}

		return redirect(303, sessionUrl);
	},

	login: async ({ request, locals: { supabase } }) => {
		const formData = await request.formData();
		const email = formData.get('email') as string;
		const password = formData.get('password') as string;

		const { error } = await supabase.auth.signInWithPassword({ email, password });
		if (error) {
			console.error(error);
			redirect(303, '/auth/error');
		}

		redirect(303, '/dashboard');
	}
};

// Define the expected structure for the user data fetched from the database
interface DbUser {
	email: string;
	roles: {
		role_name: string;
	} | null; // roles can be null if no role is assigned or the join fails
	// Include other fields if necessary
}

export const load: PageServerLoad = async ({ depends, locals: { supabase, safeGetSession } }) => {
	depends('supabase:db:user_profile'); // Use a specific dependency key

	const { session, user: authUser } = await safeGetSession();

	if (!session || !authUser) {
		// User is not logged in, return null user data
		return { user: null };
	}

	// Fetch the user profile from your 'users' table, joining with 'roles'
	const { data: profileData, error: dbError } = await supabase
		.from('users')
		.select(`
			email,
			roles (
				role_name
			)
		`)
		.eq('id', authUser.id)
		.returns<DbUser[]>() // Specify the expected return type
		.single();

	if (dbError) {
		console.error('Error fetching user profile:', (dbError as PostgrestError).message || dbError);
		// You might want to throw an error or return a specific state
		// For now, return the authUser data without profile info
		return { user: { ...authUser, role: null } }; // Add role as null
	}

	// Combine the auth user data with the fetched profile data (especially the role)
	const fullUserData = {
		...authUser,
		// Use optional chaining in case profileData or roles is null/undefined
		role: profileData?.roles?.role_name || null
	};

	return { user: fullUserData };
};