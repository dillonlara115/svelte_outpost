import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ depends, locals: { supabase } }) => {
	depends('supabase:db:user');
	const { data: user } = await supabase
		.from('users')
		.select('max_saved_searches, max_searches_per_month, current_searches_this_month')
		.single();
	return { user: user ?? null };
};