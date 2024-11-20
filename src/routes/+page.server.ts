import { redirect } from '@sveltejs/kit';

import type { Actions } from './$types';

export const actions: Actions = {
	signup: async ({ request, locals: { supabase } }) => {
		const formData = await request.formData();
		const email = formData.get('email') as string;
		const password = formData.get('password') as string;

		// Sign up the user
		const { data: authData, error: authError } = await supabase.auth.signUp({
			email,
			password
		});

		if (authError) {
			console.error(authError);
			redirect(303, '/auth/error');
		}

		// Get the default role (member_basic)
		const { data: roleData } = await supabase
			.from('roles')
			.select('id')
			.eq('role_name', 'member_basic')
			.single();

		if (!roleData?.id) {
			console.error('Default role not found');
			redirect(303, '/auth/error');
		}

		// Create user record
		const { error: userError } = await supabase.from('users').insert({
			id: authData.user!.id,
			email: email,
			role_id: roleData.id,
			max_searches_per_month: 20,
			max_saved_searches: 10,
			current_searches_this_month: 0
		});

		if (userError) {
			console.error(userError);
			redirect(303, '/auth/error');
		}

		redirect(303, '/dashboard');
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
