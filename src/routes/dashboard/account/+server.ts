import { json } from '@sveltejs/kit';
import Stripe from 'stripe';
import { PRIVATE_STRIPE_SECRET_KEY } from '$env/static/private';

const stripe = new Stripe(PRIVATE_STRIPE_SECRET_KEY);

export const POST = async ({ locals: { supabase } }) => {
    const { data: user, error: userError } = await supabase.auth.getUser();

    if (userError || !user) {
        console.error('Unauthorized access attempt:', userError);
        return json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Retrieve the Stripe customer ID from your database
    const { data: customerData, error: customerError } = await supabase
        .from('stripe_customers')
        .select('stripe_customer_id')
        .eq('user_id', user.id)
        .single();

    if (customerError || !customerData) {
        console.error('Stripe customer not found:', customerError);
        return json({ error: 'Stripe customer not found' }, { status: 404 });
    }

    try {
        const session = await stripe.billingPortal.sessions.create({
            customer: customerData.stripe_customer_id,
            return_url: 'https://app.outpostleads.com/dashboard/account',
        });

        return json({ url: session.url });
    } catch (err) {
        console.error('Error creating Stripe customer portal session:', err);
        return json({ error: 'Failed to create customer portal session' }, { status: 500 });
    }
};