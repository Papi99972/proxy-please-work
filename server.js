const express = require("express");
const { createProxyMiddleware } = require("http-proxy-middleware");
const path = require("path");
const crypto = require("crypto");

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to serve static files (e.g., frontend assets)
app.use(express.static(path.join(__dirname, "public")));

// Function to XOR encode URLs (like UV's encoding)
function xorEncode(str) {
  const key = "W-PV-26"; // You can customize this key
  let encoded = "";
  for (let i = 0; i < str.length; i++) {
    encoded += String.fromCharCode(str.charCodeAt(i) ^ key.charCodeAt(i % key.length));
  }
  return encoded;
}

// Proxy Middleware to handle requests
app.use(
  "/proxy",
  createProxyMiddleware({
    target: "https://example.com", // Default target (overridden per request)
    changeOrigin: true,
    pathRewrite: {
      "^/proxy": "", // Remove /proxy prefix
    },
    onProxyReq: (proxyReq, req) => {
      const urlParam = req.query.url;
      if (urlParam) {
        // Decode the URL parameter before passing it to the proxy
        const decodedUrl = xorEncode(urlParam); // Decode URL using XOR encoding
        proxyReq.path = decodedUrl; // Rewrite the proxy path
      }
    },
    onProxyRes: (proxyRes, req, res) => {
      res.setHeader('Access-Control-Allow-Origin', '*');
    },
  })
);

// Endpoint for URL encoding (like UV's service for encoding URLs)
app.get("/service/:encodedUrl", (req, res) => {
  const encodedUrl = req.params.encodedUrl;
  try {
    // Decode the encoded URL using XOR (reverse of the encoding process)
    const decodedUrl = xorEncode(encodedUrl);
    res.redirect(decodedUrl); // Redirect to the decoded URL
  } catch (error) {
    res.status(400).send("Invalid URL encoding.");
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Custom Proxy running on port ${PORT}`);
});
