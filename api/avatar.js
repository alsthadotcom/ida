export default async function handler(request, response) {
    const { url } = request.query;

    if (!url) {
        return response.status(400).json({ error: 'Missing url parameter' });
    }

    try {
        const imageResponse = await fetch(decodeURIComponent(url));

        if (!imageResponse.ok) {
            return response.status(imageResponse.status).send('Failed to fetch image');
        }

        const contentType = imageResponse.headers.get('content-type');
        response.setHeader('Content-Type', contentType);
        // Cache for 1 hour
        response.setHeader('Cache-Control', 'public, max-age=3600');

        const arrayBuffer = await imageResponse.arrayBuffer();
        response.send(Buffer.from(arrayBuffer));
    } catch (error) {
        console.error('Proxy error:', error);
        response.status(500).json({ error: 'Internal Server Error' });
    }
}
