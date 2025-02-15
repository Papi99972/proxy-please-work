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
      "^/proxy": "",
    },
    onProxyReq: (proxyReq, req) => {
      if (req.query.url) {
        proxyReq.path = req.query.url;
      }
    },
    onProxyRes: (proxyRes, req, res) => {
      // Allow content to be embedded in an iframe
      res.setHeader('X-Frame-Options', 'ALLOWALL'); // Allow the iframe to load the content
      res.setHeader('Content-Security-Policy', 'frame-ancestors *'); // Allow embedding the content in any domain
    }
  })
);

app.listen(PORT, () => {
  console.log(`Custom Proxy running on port ${PORT}`);
});
