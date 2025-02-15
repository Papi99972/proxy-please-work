const express = require("express");
const cors = require("cors");  // Import CORS middleware
const { createProxyMiddleware } = require("http-proxy-middleware");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

// Enable CORS for all origins
app.use(cors());

// Middleware to serve static files (e.g., frontend assets)
app.use(express.static(path.join(__dirname, "public")));

// Proxy Middleware to handle requests
app.use(
  "/proxy",
  createProxyMiddleware({
    target: "https://example.com", // Default target (overridden per request)
    changeOrigin: true,
    pathRewrite: {
      "^/proxy": "",  // This will strip `/proxy` from the URL path
    },
    onProxyReq: (proxyReq, req, res) => {
      const targetUrl = req.query.url;
      if (targetUrl) {
        proxyReq.path = targetUrl;  // Override the request path with the provided URL
      }
    },
  })
);

app.listen(PORT, () => {
  console.log(`Custom Proxy running on port ${PORT}`);
});
