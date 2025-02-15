const express = require("express");
const axios = require("axios");
const { createProxyMiddleware } = require("http-proxy-middleware");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to serve static files (e.g., frontend assets)
app.use(express.static(path.join(__dirname, "public")));

// Proxy Middleware to handle requests
app.use("/proxy", async (req, res) => {
  try {
    const targetUrl = decodeURIComponent(req.query.url);  // Decode the URL passed in query

    // Fetch the target content using Axios (or any HTTP client)
    const response = await axios.get(targetUrl, {
      headers: {
        "User-Agent": "Mozilla/5.0",  // Mimic a browser user-agent for better compatibility
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
        "Accept-Encoding": "gzip, deflate, br",
        "Connection": "keep-alive",
      },
    });

    // Set headers to allow the content to be rendered directly in the browser
    res.setHeader('Content-Type', 'text/html');
    res.setHeader('X-Frame-Options', 'ALLOWALL'); // Allow content to be embedded if needed
    res.setHeader('Content-Security-Policy', 'frame-ancestors *'); // Allow embedding in iframe, if necessary

    // Send the fetched content as the response
    res.send(response.data);
  } catch (error) {
    console.error("Error fetching the target URL:", error);
    res.status(500).send("Error fetching the content from the target URL.");
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Custom Proxy running on port ${PORT}`);
});
