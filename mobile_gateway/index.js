const express = require('express');
const grpcRouter = require('./grpcRouter');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();

const usersProxy = createProxyMiddleware({
    target: 'http://localhost:8081',
    changeOrigin: true,
    pathRewrite: {
        '^/api/users': '/api/users'
    },
    onProxyReq: (proxyReq, req, res) => {
        if (req.method !== 'POST' && req.method !== 'GET') {
            res.sendStatus(405);
            return;
        }
    }
});

const purchasesProxy = createProxyMiddleware({
    target: 'http://localhost:8083',
    changeOrigin: true,
    pathRewrite: {
        '^/api/purchases': '/api/purchases'
    },
    onProxyReq: (proxyReq, req, res) => {
        if (req.method !== 'POST' && req.method !== 'GET') {
            res.sendStatus(405);
            return;
        }
    }
});

app.use('/api/users', usersProxy);
app.use('/api/tickets', grpcRouter);
app.use('/api/purchases', purchasesProxy);

const PORT = 8085;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
