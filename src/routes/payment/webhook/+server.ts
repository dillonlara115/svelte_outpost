import Stripe from 'stripe';
import {
	PRIVATE_STRIPE_SECRET_KEY,
	PRIVATE_STRIPE_WEBHOOK_SECRET
} from '$env/static/private';
import { json, type RequestHandler } from '@sveltejs/kit';
import logger from '$lib/utils/logger';
import { supabase } from '$lib/supabaseClient';

const stripe = new Stripe(PRIVATE_STRIPE_SECRET_KEY);

function fulfillOrder(lineItems: Stripe.ApiList<Stripe.LineItem>) {
	console.log('Fullfilling order: ', lineItems);
}

export const POST: RequestHandler = async ({ request }) => {
	logger.info('[payment webhook] Received a webhook request from Stripe.');
	const signature = request.headers.get('stripe-signature');
	const rawBody = await request.text();

	if (!request.body) {
		logger.error('[payment webhook] No request body has been provided');
		return json({ received: false });
	}

	if (!signature) {
		logger.error('[payment webhook] No Stripe signature has been provided');
		return json({ received: false });
	}

	let event: Stripe.Event;

	try {
		if (!request.body) throw new Error('No request body');

		event = stripe.webhooks.constructEvent(
			rawBody,
			signature,
			PRIVATE_STRIPE_WEBHOOK_SECRET
		);

		logger.success('[payment webhook] Constructed a Stripe webhook event');
	} catch (err) {
		logger.error('[payment webhook] Could not construct a Stripe webhook event', err);
		return new Response(
			JSON.stringify({
				error: 'Could not construct a Stripe webhook event'
			}),
			{ status: 500 }
		);
	}
	//logger.info(`EVENT TYPES [payment webhook] Received event: ${event.type}`);
	// Handle different types of events here
	switch (event.type) {
		case 'checkout.session.completed':
			logger.info('[payment webhook] Received a checkout session completed event');
			break;
		case 'invoice.paid':
			logger.info('[payment webhook] Received an invoice paid event');
			break;
		case 'invoice.payment_failed':
			logger.info('[payment webhook] Received an invoice payment failed event');
			break;
		default:
			//logger.warn(`[payment webhook] Received an unhandled event type: ${event.type}`);
			break;
	}

	if (event.type === 'checkout.session.completed') {
		logger.info('[CHECKOUT SESSION COMPLETED]');
		const sessionWithItems = await stripe.checkout.sessions.retrieve(
			event.data.object.id,
			{
				expand: ['line_items']
			}
		);
		const session = event.data.object as Stripe.Checkout.Session;

		  // Extract the price ID from the line items
		  const lineItems = sessionWithItems.line_items?.data;
		  const priceId = lineItems ? lineItems[0].price.id : null;
	  
		  if (!priceId) {
			console.error('Price ID not found in line items');
			return json({ error: 'Price ID not found' }, { status: 500 });
		  }
	  
		  // Map the price ID to a user role
		  const roleMapping = {
			'price_1QjVoaB8sVzGezu0kfetCOuV': 'e9fee1d7-17ff-4b62-81ec-1fa8ac7332ec',
			'price_1QjVmwB8sVzGezu02fSPx4ud': 'e9fee1d7-17ff-4b62-81ec-1fa8ac7332ec',
			'price_1QjVoxB8sVzGezu0olflndDZ': 'a0317245-b139-4589-9fb8-777b7dc4aaaf',
			'price_1QjVnQB8sVzGezu0lZyVFAYQ': 'a0317245-b139-4589-9fb8-777b7dc4aaaf',
			// Add more mappings as needed
		  } as const;
	  
		  const userRole = roleMapping[priceId as keyof typeof roleMapping];
	  
		  if (!userRole) {
			console.error('No user role found for price ID:', priceId);
			return json({ error: 'No user role found for price ID' }, { status: 500 });
		  }

    // Extract the password from metadata
    const password = session.metadata.password;
    const email = session.metadata.email;

    // Create user in Supabase auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (authError) {
      console.error('Error creating user in Supabase:', authError);
      return json({ error: 'Error creating user in Supabase' }, { status: 500 });
    }

    // Insert user into the custom users table
    const { error: insertError } = await supabase
      .from('users')
      .insert({
        id: authData.user.id, // Use the auth user ID
        email: email,
        role_id: userRole, // Use the mapped role ID
        // Add any other fields you need
      });

    if (insertError) {
      console.error('Error inserting user into custom users table:', insertError);
      return json({ error: 'Error inserting user into custom users table' }, { status: 500 });
    }

    console.log('User created in Supabase with role:', authData);
  }
	return json({ received: true });
};
