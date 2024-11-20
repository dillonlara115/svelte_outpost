import type { PageServerLoad } from './$types';
import { redirect } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ locals: { supabase } }) => {
	const {
		data: { session }
	} = await supabase.auth.getSession();

	if (!session) {
		throw redirect(303, '/auth');
	}

	const { data: savedSearches, error } = await supabase
		.from('saved_searches')
		.select('*')
		.eq('user_id', session.user.id)
		.order('created_at', { ascending: false });

	if (error) {
		console.error('Error loading saved searches:', error);
		return {
			savedSearches: []
		};
	}

	return {
		savedSearches
	};
};
