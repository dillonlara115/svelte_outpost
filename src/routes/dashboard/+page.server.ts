import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ depends, locals: { supabase } }) => {
	depends('supabase:db:user');
	
	const { data: { session } } = await supabase.auth.getSession();
	
	if (!session?.user?.id) {
		return { user: null };
	}

	const { data: user, error } = await supabase
		.from('users')
		.select(`
			email,
			roles (
				role_name
			),
			max_saved_searches,
			max_searches_per_month,
			current_searches_this_month
		`)
		.eq('id', session.user.id)
		.single();

	if (error) {
		console.error('Error fetching user data:', error.message || error);
		return { user: null };
	}

	return { 
		user: user ?? null,
		max_saved_searches: user?.max_saved_searches ?? 0,
		max_searches_per_month: user?.max_searches_per_month ?? 0,
		current_searches_this_month: user?.current_searches_this_month ?? 0,
		email: user?.email,
		role_name: user?.roles?.role_name
	};
};
