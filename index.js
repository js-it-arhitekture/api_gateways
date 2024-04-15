const express = require('express');
const grpcRouter = require('./grpcRouter');
const { createProxyMiddleware } = require('http-proxy-middleware');
const cors = require('cors');

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
