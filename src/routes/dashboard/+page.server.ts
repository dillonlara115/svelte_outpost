import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ depends, locals: { supabase } }) => {
	depends('supabase:db:user');
	const { data: user, error } = await supabase
		.from('users')
		.select(
			'max_saved_searches, max_searches_per_month, current_searches_this_month, email, roles (role_name)'
		)
		.single();

	if (error) {
		console.error('Error fetching user data:', error.message || error);
		return { user: null };
	}
	// Extract role_name directly if you only expect one role per user

	// Return user with role_name flattened for easier usage
	return { user: user ?? null };
};
