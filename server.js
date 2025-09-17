const path = require('path');
const express = require('express');
const compression = require('compression');

const app = express();
const PORT = process.env.PORT || 3000;

// Enable gzip compression
app.use(compression());

// Basic security headers (very light)
app.use((req, res, next) => {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'SAMEORIGIN');
    res.setHeader('Referrer-Policy', 'no-referrer-when-downgrade');
    next();
});

// Serve static assets
const staticDir = path.join(__dirname);
app.use(express.static(staticDir, {
    maxAge: '1d',
    setHeaders: (res, filePath) => {
        if (filePath.endsWith('index.html')) {
            res.setHeader('Cache-Control', 'no-store');
        }
    }
}));

// Root route → index.html
app.get('/', (_req, res) => {
    res.sendFile(path.join(staticDir, 'index.html'));
});

// Optional SPA fallback: if you later add client-side routing
// app.get('*', (_req, res) => {
// 	res.sendFile(path.join(staticDir, 'index.html'));
// });

app.listen(PORT, () => {
    console.log(`Crossword app running on http://localhost:${PORT}`);
});
