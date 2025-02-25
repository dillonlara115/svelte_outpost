import { json } from '@sveltejs/kit';
import Stripe from 'stripe';
import { PRIVATE_STRIPE_SECRET_KEY } from '$env/static/private';

const stripe = new Stripe(PRIVATE_STRIPE_SECRET_KEY);

export const POST = async ({ request, locals: { supabase } }) => {
    // Get authenticated user
    const { data, error: userError } = await supabase.auth.getUser();
    const user = data?.user;

    if (userError || !user) {
        console.error('Unauthorized access attempt:', userError);
        return json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Fetch user's Stripe customer ID from Supabase
    const { data: userData, error: fetchError } = await supabase
    .from('users')
    .select('stripe_customer_id')
    .eq('id', user.id)
    .single();

if (fetchError || !userData?.stripe_customer_id) {
    return json({ error: 'User does not have a Stripe customer ID' }, { status: 400 });
}

    if (fetchError || !userData?.stripe_customer_id) {
        console.error('No Stripe customer ID found:', fetchError);
        return json({ error: 'User does not have a Stripe customer ID' }, { status: 400 });
    }

    try {
        // Create a Stripe customer portal session
        const portalSession = await stripe.billingPortal.sessions.create({
            customer: userData.stripe_customer_id,
            return_url: 'https://app.outpostleads.com/dashboard/account' // Adjust as needed
        });

        return json({ url: portalSession.url });
    } catch (err) {
        console.error('Error creating Stripe portal session:', err);
        return json({ error: 'Failed to create portal session' }, { status: 500 });
    }
};
