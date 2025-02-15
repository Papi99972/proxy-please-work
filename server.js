const express = require('express');
const axios = require('axios');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Serve static files (your frontend)
app.use(express.static(path.join(__dirname, 'public')));

// Proxy to handle URL fetching
app.get('/proxy', async (req, res) => {
    const targetUrl = req.query.url;
    if (!targetUrl) {
        return res.status(400).send('No URL provided');
    }

    try {
        // Fetch content from the target URL using axios
        const response = await axios.get(decodeURIComponent(targetUrl), {
            responseType: 'text',
        });

        // Send the content back to the frontend
        res.setHeader('Content-Type', 'text/html');
        res.send(response.data);
    } catch (error) {
        console.error('Error fetching the target URL:', error);
        res.status(500).send('Error fetching content from the target URL');
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Proxy server running on port ${PORT}`);
});
