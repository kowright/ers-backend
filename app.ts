console.log('Hello world');


import * as http from 'http';
import WebSocket from 'ws';
import express from 'express';

const hostname = '127.0.0.1';
const port = 3002;

const app = express();

const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

wss.on('connection', (ws: WebSocket) => {
    console.log('New WebSocket connection established.');
    console.log('There are ' + wss.clients.size + " client(s)");

    ws.on('message', (message: WebSocket.RawData) => {
        const messageString = message.toString();
        console.log(`Received message: ${messageString}`);

        wss.clients.forEach((client: WebSocket) => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(messageString);
            }
        });
        ws.send(`Message Sent`);
    });

    ws.send('Welcome to the WebSocket server!');
});

wss.on('close', (code: number, reason: Buffer) => {
    console.log("Client left");
    console.log(code, reason.toString());
});

server.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});
