
import * as http from 'http';
import WebSocket from 'ws';
import express from 'express';
import path from 'path';

const hostname = '127.0.0.1';
const port = 3003;

const app = express();

app.use(express.static(path.join(__dirname, 'public')));

type ChatMessage = {
    timestamp: number;
    clientId: string;
    message: string;
    name: string;

};

const chatLog: ChatMessage[] = [];

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'home.html'));
});

/*app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'home.html'));
});*/

const server = http.createServer(app);
const wss = new WebSocket.Server({ server });


/*wss.on('connection', (ws: WebSocket) => {*/
wss.on('connection', (ws: WebSocket & { name?: string }) => {
    console.log('New WebSocket connection established with server.');
    const clientId = Math.random().toString(36).substring(2, 9);
    console.log(`Client connected: ${clientId}`);
    console.log('There are now ' + wss.clients.size + " client(s)");

    /* ws.on('message', (message: WebSocket.RawData) => {*/
    ws.on('message', (raw) => {
        const data = JSON.parse(raw.toString());
        console.log('Received: ', data);
        /*  const messageString = message.toString();*/
  
  /*      console.log(`Received message: ${messageString}`);*/

        if (data.type === 'join') {
            ws.name = data.name;
            console.log(`${ws.name} joined the chat!`);
            // TODO: let all clients know someone joined
            return;
        }

        if (data.type === 'message') {
            console.log('chat message', data.text);
            const chatEntry = {
                timestamp: Date.now(),
                name: data.name ?? 'Anonymous',
                message: data.text,
                clientId: clientId,
            };

            chatLog.push(chatEntry);
            const chatString = `{${new Date(chatEntry.timestamp).toLocaleTimeString()}} [${data.name}]: ${data.text}`

            console.log(chatString);

            wss.clients.forEach((client: WebSocket) => {
                if (client.readyState === WebSocket.OPEN) {
                    /* client.send(messageString);*/
                    client.send(JSON.stringify({
                        type: 'chat',
                        payload: chatEntry
                    }));
                }
            });
            console.log(`Message Sent`);
            console.log('chat log', chatLog.map(chat => `{[${chat.name}]: ${chat.message}`))
        }
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

    ws.send(JSON.stringify({
        type: 'server',
        message: 'You are connected to the WebSocket Server!'
    }));
});

wss.on('close', (code: number, reason: Buffer) => {
    console.log("Server closed");
    console.log(code, reason.toString());
});

server.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});
