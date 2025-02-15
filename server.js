const express = require("express");
const { createProxyMiddleware } = require("http-proxy-middleware");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to serve static files (e.g., frontend assets)
app.use(express.static(path.join(__dirname, "public")));

// Proxy Middleware to handle requests
app.use(
  "/proxy",
  createProxyMiddleware({
    target: "https://example.com", // Default target (overridden per request)
    changeOrigin: true,
    pathRewrite: {
      "^/proxy": "", // This rewrites the `/proxy` prefix from the URL
    },
    onProxyReq: (proxyReq, req) => {
      if (req.query.url) {
        // Decode and re-encode the URL to avoid issues
        const decodedUrl = decodeURIComponent(req.query.url);
        proxyReq.path = decodedUrl; // Pass the target URL to the proxy
      }
    },
    onProxyRes: (proxyRes, req, res) => {
      // Allow content to be embedded in an iframe
      res.setHeader('X-Frame-Options', 'ALLOWALL'); // Allow the iframe to load the content
      res.setHeader('Content-Security-Policy', 'frame-ancestors *'); // Allow embedding the content in any domain

      // Log response status and headers for debugging
      console.log(`Proxying: ${req.query.url} | Status: ${proxyRes.statusCode}`);
    },
    onError: (err, req, res) => {
      // Catch errors and send a 404 page with the error message
      console.error('Error during proxy:', err);
      res.status(404).send('Error: Proxy request failed');
    }
  })
);

app.listen(PORT, () => {
  console.log(`Custom Proxy running on port ${PORT}`);
});
