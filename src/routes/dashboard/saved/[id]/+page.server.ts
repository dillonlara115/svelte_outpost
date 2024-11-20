import type { PageServerLoad } from './$types';
import { error } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ params, locals: { supabase } }) => {
    const { data: { session } } = await supabase.auth.getSession();

    if (!session) {
        throw error(401, 'Unauthorized');
    }

    const { data: savedSearch, error: searchError } = await supabase
        .from('saved_searches')
        .select('*')
        .eq('id', params.id)
        .eq('user_id', session.user.id)  // Ensure user can only see their own searches
        .single();

    if (searchError || !savedSearch) {
        throw error(404, 'Saved search not found');
    }

    return {
        savedSearch
    };
};