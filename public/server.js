const express = require('express');
const path = require('path');
const cors = require('cors');
const fs = require('fs');

const app = express();
const PORT = 8080;

app.use(cors());

// Custom middleware to handle Netlify image optimization requests
app.use((req, res, next) => {
    if (req.path === '/.netlify/images') {
        const targetUrl = req.query.url;
        if (targetUrl) {
            const localImagePath = path.join(__dirname, targetUrl.split('?')[0]);
            if (fs.existsSync(localImagePath) && fs.statSync(localImagePath).isFile()) {
                console.log(`[LOCAL-NETLIFY-MOCK] Served -> ${targetUrl}`);
                return res.sendFile(localImagePath);
            }
        }
    }
    next();
});

// Serve everything else statically from the current directory
app.use(express.static(__dirname, {
    setHeaders: (res, path) => {
        // Set CORS to ensure WebGL/Canvas can access assets properly
        res.setHeader('Access-Control-Allow-Origin', '*');
    }
}));

// Fallback to index.html for Single Page Application routing
app.get('*', (req, res) => {
    console.log(`[SPA-FALLBACK] Served index.html for -> ${req.path}`);
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
    console.log(`\n======================================================`);
    console.log(`OceanX OFFLINE Server running on http://localhost:${PORT}`);
    console.log(`No internet required. Everything is served locally!`);
    console.log(`======================================================\n`);
});
