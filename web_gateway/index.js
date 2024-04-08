
// 8080 -> web_api gateway
// 8081 -> users_service
// 9000 -> tickets_service 
// 8083 -> tickets_purchase_service

const express = require('express');
const grpcRouter = require('./grpcRouter');
const { createProxyMiddleware } = require('http-proxy-middleware');


const app = express();

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

// Start the Express server
const PORT = 8085;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

