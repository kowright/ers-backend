
import * as http from 'http';
import WebSocket from 'ws';
import express from 'express';
import path from 'path';

const hostname = '127.0.0.1';
const port = 3003;

const app = express();

app.use(express.static(path.join(__dirname, 'public')));

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'home.html'));
});

/*app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'home.html'));
});*/

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
        console.log(`Message Sent`);
    });

    ws.on('close', (code: number, reason: Buffer) => {
        console.log("Client disconnected.");
        console.log("Code:", code);
        console.log("Reason:", reason.toString());
        console.log('Remaining clients: ' + wss.clients.size);
    });

    ws.on('error', (err) => {
        console.log('WebSocket error:', err);
    });

    ws.send('Welcome to the WebSocket server!');
});

wss.on('close', (code: number, reason: Buffer) => {
    console.log("Server closed");
    console.log(code, reason.toString());
});

server.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});
