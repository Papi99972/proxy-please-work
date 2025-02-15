const express = require("express");
const axios = require("axios"); // Use axios to fetch content
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to serve static files (e.g., frontend assets)
app.use(express.static(path.join(__dirname, "public")));

// Proxy to handle requests
app.use("/proxy", async (req, res) => {
  const targetUrl = req.query.url;
  if (!targetUrl) {
    return res.status(400).send("No URL provided");
  }

  try {
    // Fetch content from the target URL using axios
    const response = await axios.get(decodeURIComponent(targetUrl), {
      responseType: "text", // Ensure we get the raw content as text
    });

    // Send the fetched content back to the frontend
    res.setHeader("Content-Type", "text/html");  // Set the correct content type
    res.send(response.data);  // Send the proxied content
  } catch (error) {
    console.error("Error fetching the target URL:", error);
    res.status(500).send("Error fetching content from the target URL");
  }
});

app.listen(PORT, () => {
  console.log(`Custom Proxy running on port ${PORT}`);
});
