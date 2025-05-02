// Simple Cloudflare Pages worker

export default {
  async fetch(request, env) {
    try {
      const url = new URL(request.url);
      
      // Return an empty Response for the favicon.ico to avoid 404s
      if (url.pathname === '/favicon.ico') {
        return new Response(null, { status: 204 });
      }
      
      // Handle API routes
      if (url.pathname.startsWith('/api/')) {
        // API routes are handled by Next.js
        return env.ASSETS.fetch(request);
      }
      
      // Static assets and pages
      return env.ASSETS.fetch(request);
    } catch (e) {
      return new Response('Error loading page: ' + e.message, { status: 500 });
    }
  }
};