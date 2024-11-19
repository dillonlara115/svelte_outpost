import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request, locals: { supabase } }) => {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
        return new Response('Unauthorized', { status: 401 });
    }

    try {
        // Get current user's search limits
        const { data: userData, error: userError } = await supabase
            .from('users')
            .select('max_saved_searches')
            .eq('id', session.user.id)
            .single();

        if (userError) throw userError;

        // Count existing saved searches
        const { count, error: countError } = await supabase
            .from('saved_searches')
            .select('*', { count: 'exact', head: true })
            .eq('user_id', session.user.id);

        if (countError) throw countError;

        // Check if user has reached their limit
        if (count && userData?.max_saved_searches && count >= userData.max_saved_searches) {
            return json({
                error: 'Saved search limit reached. Please upgrade your plan to save more searches.'
            }, { status: 400 });
        }

        const searchData = await request.json();
        
        const { data, error } = await supabase
            .from('saved_searches')
            .insert({
                user_id: session.user.id,
                search_data: searchData
            })
            .select()
            .single();

        if (error) throw error;

        return json({ success: true, data });

    } catch (error) {
        console.error('Error saving search:', error);
        return json({ error: 'Failed to save search' }, { status: 500 });
    }
};