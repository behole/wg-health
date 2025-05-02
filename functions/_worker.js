export default {
  async fetch(request, env) {
    try {
      // For API routes
      const url = new URL(request.url);
      if (url.pathname.startsWith('/api/')) {
        // Handle API routes
        return fetch(request);
      }
      
      // For static assets and pages
      return env.ASSETS.fetch(request);
    } catch (e) {
      return new Response('Error loading page', { status: 500 });
    }
  }
}