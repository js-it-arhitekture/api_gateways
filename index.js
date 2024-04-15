const express = require('express');
const grpcRouter = require('./grpcRouter');
const { createProxyMiddleware } = require('http-proxy-middleware');
const cors = require('cors');
const axios = require('axios');

const app = express();
app.use(cors());
app.use(express.json());

// Define proxy middleware for each microservice
const usersProxy = createProxyMiddleware({
    target: 'http://users-service:8080',
    changeOrigin: true,
    pathRewrite: {
        '^/api/users': '/api/users'
    }
});

const purchasesProxy = createProxyMiddleware({
    target: 'http://tickets_provider_service:8084',
    changeOrigin: true,
    pathRewrite: {
        '^/api/purchases': '/api/purchases'
    }
});

app.use('/api/purchases', async (req, res, next) => {
    if (req.method === 'POST') {
        try {
            console.log('Request received:', req.method, req.url);
            const response = await axios.post('http://tickets_provider_service:8084/api/purchases', req.body);
            console.log("Response from fetch", response.data);
            res.json(response.data);
        } catch (error) {
            console.error('Error:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    } else {
        next();
    }
});

// Use proxy middleware for each microservice route
app.use('/api/users', usersProxy);
app.use('/api/tickets', grpcRouter);
app.use('/api/purchases', purchasesProxy);
app.use('/api/health', (req, res) => res.json({ status: 200 }));

// Start the Express server
const PORT = 8085;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

module.exports = app;
