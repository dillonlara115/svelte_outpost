export async function GET({ url }) {
    const imageUrl = url.searchParams.get('url');
    
    if (!imageUrl) {
        return new Response('No URL provided', { status: 400 });
    }

    try {
        const response = await fetch(imageUrl, {
            headers: {
                'User-Agent': 'Mozilla/5.0' // Sometimes helps with rate limiting
            }
        });
        
        const headers = new Headers(response.headers);
        headers.set('Cache-Control', 'public, max-age=31536000'); // Cache for 1 year
        
        return new Response(response.body, {
            headers,
            status: response.status
        });
    } catch (error) {
        return new Response('Failed to fetch image', { status: 500 });
    }
}