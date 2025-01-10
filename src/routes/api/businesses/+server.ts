import { json } from '@sveltejs/kit';
import { OUTSCRAPER_API_KEY } from '$env/static/private';

const ownershipAttributes = {
	womenOwned: 'From+the+business.Identifies+as+Women-owned',
	asianOwned: 'From+the+business.Identifies+as+Asian-owned',
	blackOwned: 'From+the+business.Identifies+as+Black-owned',
	latinoOwned: 'From+the+business.Identifies+as+Latino-owned',
	lgbtqOwned: 'From+the+business.Identifies+as+LGBTQ+-owned',
	veteranOwned: 'From+the+business.Identifies+as+Veteran-owned',
	indigenousOwned: 'From+the+business.Identifies+as+Indigenous-owned',
	disabledOwned: 'From+the+business.Identifies+as+Disabled-owned'
};

export async function GET({ url }) {
	const city = url.searchParams.get('city');
	const state = url.searchParams.get('state');
	const zipCode = url.searchParams.get('zipCode');
	const type = url.searchParams.get('type');
	const verified = url.searchParams.get('verified');

	// Build attributes array from ownership filters
	const attributes = Object.entries(ownershipAttributes)
		.filter(([key]) => url.searchParams.get(key) === 'true')
		.map(([, value]) => value);

	const queryParams = new URLSearchParams({
		cc: 'US',
		city: city || '',
		state: state || '',
		type: type || '',
		limit: '5'
	});

	// Add verified parameter to query if it's 'yes' or 'no'
	if (verified === 'yes') {
		queryParams.append('verified', 'true');
	} else if (verified === 'no') {
		queryParams.append('verified', 'false');
	}

	if (attributes.length > 0) {
        // Replace %2B with + in the encoded attributes
        const encodedAttributes = attributes
            .map(attr => attr.replace(/\s+/g, '+'))
            .join(',');
        queryParams.append('att', encodedAttributes);
    }
	const requestUrl = `https://dahab.app.outscraper.com/data/places?${queryParams.toString().replace(/%2B/g, '+')}`;

	// Log the request URL and params
	console.log('Request URL:', requestUrl);
	console.log('Request Headers:', { 'X-API-KEY': OUTSCRAPER_API_KEY });
	console.log('Attributes:', attributes);

	const response = await fetch(
		requestUrl,
		{
			headers: {
				'X-API-KEY': OUTSCRAPER_API_KEY
			}
		}
	);

	const data = await response.json();
	
	console.log('Raw API Response:', data); // Debug log
	
	// Get businesses from the correct property
	const businesses = data.data || [];
	console.log('Businesses array:', businesses); // Debug log

	// if (verified) {
	// 	businesses = businesses.filter((business) => business.verified);
	// 	//console.log('Businesses after verified filter:', businesses.length);
	// }

	return json({ businesses });
}
