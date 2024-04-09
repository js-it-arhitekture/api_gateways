const express = require('express');
const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const { Empty } = require('google-protobuf/google/protobuf/empty_pb');

const router = express.Router();

// Load the gRPC proto file
const PROTO_PATH = __dirname + '/ticket.proto';
const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true
});
const protoDescriptor = grpc.loadPackageDefinition(packageDefinition);
const grpcService = new protoDescriptor.TicketService('tickets_service:9000', grpc.credentials.createInsecure());

// Define gRPC middleware to forward requests to the gRPC service

router.get('/test', (req, res) => {
    return res.json({ message: "Hello from the tickets service!" });
})

router.post('/create', (req, res) => {
    const requestData = req.body;

    grpcService.create(requestData, (error, response) => {
        if (error) {
            console.error('Error:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        } else {
            console.log('Response:', response);
            res.json(response);
        }
    });
});

router.get('/get', (req, res) => {
    const requestData = req.body;

    grpcService.get(requestData, (error, response) => {
        if (error) {
            console.error('Error:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        } else {
            console.log('Response:', response);
            res.json(response);
        }
    });
});

router.post('/remove', (req, res) => {
    const requestData = req.body;

    grpcService.remove(requestData, (error, response) => {
        if (error) {
            console.error('Error:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        } else {
            console.log('Response:', response);
            res.json(response);
        }
    });
});

router.post('/update', (req, res) => {
    const requestData = req.body;

    grpcService.update(requestData, (error, response) => {
        if (error) {
            console.error('Error:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        } else {
            console.log('Response:', response);
            res.json(response);
        }
    });
});

router.get('/list', (req, res) => {
    const request = new Empty(); // Create an instance of Empty
    grpcService.list(request, (error, response) => {
        if (error) {
            console.error('Error:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        } else {
            console.log('Response:', response);
            res.json(response);
        }
    });
});

module.exports = router;
