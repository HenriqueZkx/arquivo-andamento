const express = require('express');
const http = require('http');
const path = require('path');


// Load .env if present
require('dotenv').config();

const PORT = parseInt(process.env.PORT, 10) || 3000;
const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Simple request logger
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()}  ${req.method} ${req.url}`);
    next();
});

// Serve static files from ./public (optional)
app.use('/static', express.static(path.join(__dirname, 'public')));

// Root route
app.get('/', (req, res) => {
    res.json({
        service: path.basename(__dirname),
        uptime: process.uptime(),
        env: process.env.NODE_ENV || 'development',
        timestamp: Date.now(),
    });
});

// Healthcheck endpoints
app.get('/healthz', (req, res) => res.status(200).json({ status: 'ok' }));
app.get('/readyz', (req, res) => res.status(200).json({ ready: true }));

// 404 handler
app.use((req, res) => {
    res.status(404).json({ error: 'Not Found' });
});

// Error handler
app.use((err, req, res, next) => {
    console.error(err && err.stack ? err.stack : err);
    res.status(err && err.status ? err.status : 500).json({ error: err?.message || 'Internal Server Error' });
});

// Create and start server
const server = http.createServer(app);

server.listen(PORT, () => {
    console.log(`Service listening on http://localhost:${PORT} (env=${process.env.NODE_ENV || 'development'})`);
});

// Graceful shutdown
function shutdown(signal) {
    console.log(`Received ${signal}, shutting down...`);
    server.close(() => {
        console.log('Closed server.');
        process.exit(0);
    });
    // Force exit after timeout
    setTimeout(() => {
        console.error('Force exiting.');
        process.exit(1);
    }, 10_000);
}

process.on('SIGINT', () => shutdown('SIGINT'));
process.on('SIGTERM', () => shutdown('SIGTERM'));

// Export app for testing
module.exports = app;