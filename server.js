const express = require("express");
const cors = require("cors");
const { createProxyMiddleware } = require("http-proxy-middleware");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

// Enable CORS for all origins or restrict it to specific origins
app.use(cors({
  origin: 'https://w-pv-26.vercel.app', // Allow only the frontend domain to make requests
  methods: ['GET', 'POST'],  // Allow GET and POST requests
  allowedHeaders: ['Content-Type'], // Allow specific headers
}));

// Middleware to serve static files (e.g., frontend assets)
app.use(express.static(path.join(__dirname, "public")));

// Proxy Middleware to handle requests
app.use(
  "/proxy",
  createProxyMiddleware({
    target: "", // Set empty target, we will dynamically change it
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
    onProxyRes: (proxyRes, req, res) => {
      // Ensure the response from the proxy contains the right CORS headers
      res.setHeader('Access-Control-Allow-Origin', 'https://w-pv-26.vercel.app');
      res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
      res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    },
    logLevel: 'debug', // Log for debugging proxy requests
  })
);

app.listen(PORT, () => {
  console.log(`Custom Proxy running on port ${PORT}`);
});
