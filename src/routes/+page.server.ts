import { fail, redirect, type RequestHandler } from '@sveltejs/kit';
import { logger } from '$lib/utils/logger';
import type { Actions } from './$types';
import Stripe from 'stripe';

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

        try {
            // Step 1: Create User in Supabase Auth
            const { data: authData, error: authError } = await supabase.auth.signUp({
                email,
                password
            });

            if (authError) {
                console.error('Supabase Auth error:', authError);
                return fail(400, { message: 'Failed to create user in Supabase Auth' });
            }

            const userId = authData.user?.id;
            if (!userId) {
                console.error('No user ID returned from Supabase Auth');
                return fail(500, { message: 'User creation failed' });
            }

            console.log('User created in Supabase Auth:', userId);

            // Step 2: Create Stripe Customer
            const customer = await stripe.customers.create({
                email
            });

            const stripeCustomerId = customer.id;
            console.log('Stripe customer created:', stripeCustomerId);

            // Step 3: Store stripe_customer_id in Supabase users table
            const { error: userTableError } = await supabase
                .from('users')
                .update({ stripe_customer_id: stripeCustomerId })
                .eq('id', userId);

            if (userTableError) {
                console.error('Failed to update stripe_customer_id in Supabase:', userTableError);
                return fail(500, { message: 'Failed to save Stripe customer ID' });
            }

            console.log('Stripe customer ID saved in Supabase');

            // Step 4: Create a Stripe Checkout session
            const session = await stripe.checkout.sessions.create({
                customer: stripeCustomerId,
                payment_method_types: ['card'],
                line_items: [
                    {
                        price: priceId,
                        quantity: 1
                    }
                ],
                mode: 'subscription',
                success_url: `${mainUrl}/?session_id={CHECKOUT_SESSION_ID}&status=success`,
                cancel_url: `${mainUrl}/?session_id={CHECKOUT_SESSION_ID}&status=cancel`,
                metadata: {
                    email
                }
            });

            if (!session.url) {
                error = 'Could not initialize a payment. Please try again later.';
            }

            logger.success('Stripe session created successfully');
            sessionUrl = session.url;
        } catch (err) {
            console.error('An error occurred when initializing checkout:', err);
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
    }
};
