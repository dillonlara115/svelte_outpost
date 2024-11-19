import { json } from '@sveltejs/kit';
import Outscraper from 'outscraper';
import { OUTSCRAPER_API_KEY } from '$env/static/private';

export async function GET({ url }) {
    const city = url.searchParams.get('city');
    const state = url.searchParams.get('state');
    const zipCode = url.searchParams.get('zipCode');
    const type = url.searchParams.get('type');

    
    const query = `${type} ${city} ${state} ${zipCode}`.trim();
    const client = new Outscraper(OUTSCRAPER_API_KEY);

    const response = await client.googleMapsSearch(
        [query],
            3,
            'en',
            'US',
            0,
            false,
            ['domains_service', 'emails_validator_service']
    );

    console.log('response: ', response);
    
    return json({ businesses: response });
}