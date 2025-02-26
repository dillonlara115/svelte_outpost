import Stripe from 'stripe';
import {
	PRIVATE_STRIPE_SECRET_KEY,
	PRIVATE_STRIPE_WEBHOOK_SECRET
} from '$env/static/private';
import { json, type RequestHandler } from '@sveltejs/kit';
import logger from '$lib/utils/logger';
import { supabase } from '$lib/supabaseClient';

const roleMapping = {
	'price_1QjVoaB8sVzGezu0kfetCOuV': 'e9fee1d7-17ff-4b62-81ec-1fa8ac7332ec', // Standard Plan (dev)
	'price_1QjVmwB8sVzGezu02fSPx4ud': 'e9fee1d7-17ff-4b62-81ec-1fa8ac7332ec', // Standard Plan (prod)
	'price_1QjVoxB8sVzGezu0olflndDZ': 'a0317245-b139-4589-9fb8-777b7dc4aaaf', // Business Pro Plan (dev)
	'price_1QjVnQB8sVzGezu0lZyVFAYQ': 'a0317245-b139-4589-9fb8-777b7dc4aaaf', // Business Pro Plan (prod)
} as const;

const planLimits = {
	'e9fee1d7-17ff-4b62-81ec-1fa8ac7332ec': { // Standard Plan
		max_searches_per_month: 20,
		max_saved_searches: 10
	},
	'a0317245-b139-4589-9fb8-777b7dc4aaaf': { // Business Pro Plan
		max_searches_per_month: 500,
		max_saved_searches: 50
	}
} as const;

export const config = {
	api: {
		 bodyParser: false // Disable body parsing for this route
	}
};

const stripe = new Stripe(PRIVATE_STRIPE_SECRET_KEY);

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
		logger.info('[payment webhook] Processing checkout.session.completed event');
		const session = event.data.object as Stripe.Checkout.Session;
		const email = session.metadata?.email;
		
		if (!email) {
			logger.error('[payment webhook] No email found in session metadata');
			return json({ error: 'Email not found' }, { status: 500 });
		}
		
		logger.info('[payment webhook] Updating user role for:', { email });

		// Get the price ID and role mapping
		const sessionWithItems = await stripe.checkout.sessions.retrieve(
			session.id,
			{
				expand: ['line_items']
			}
		);
		const lineItems = sessionWithItems.line_items?.data;
		const priceId = lineItems ? lineItems[0]?.price?.id : null;

		if (!priceId) {
			logger.error('[payment webhook] No price ID found in line items');
			return json({ error: 'Price ID not found' }, { status: 500 });
		}

		const userRole = roleMapping[priceId as keyof typeof roleMapping];
		const limits = planLimits[userRole];
		
		if (!userRole) {
			logger.error('[payment webhook] No role mapping found for price:', priceId);
			return json({ error: 'No role mapping found' }, { status: 500 });
		}

		logger.info('[payment webhook] Updating user role:', {
			email,
			roleId: userRole
		});

		// Update the user's role and limits
		const { error: updateError } = await supabase
			.from('users')
			.update({
				role_id: userRole,
				max_searches_per_month: limits.max_searches_per_month,
				max_saved_searches: limits.max_saved_searches,
				current_searches_this_month: 0,
				updated_at: new Date().toISOString()
			})
			.eq('email', email);

		if (updateError) {
			logger.error('[payment webhook] Failed to update user role:', updateError);
			return json({ error: 'Failed to update user role' }, { status: 500 });
		}

		logger.success('[payment webhook] Successfully updated user role');
		return json({ success: true });
	}
	return json({ received: true });
};
