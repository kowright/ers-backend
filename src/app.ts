
import * as http from 'http';
import WebSocket from 'ws';
import express from 'express';
import path from 'path';

const hostname = '127.0.0.1';
const port = 3003;

const app = express();

app.use(express.static(path.join(__dirname, 'public')));

type User = {
    name: string;
    clientId: string;
    color: string;
};

type ChatMessage = User & {
    timestamp: number;
    message: string;
};

let chatLog: ChatMessage[] = [];
let users: User[] = [];

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'home.html'));
});

const server = http.createServer(app);
const wss = new WebSocket.Server({ server });


wss.on('connection', (ws: WebSocket & { name?: string }) => {
    console.log('New WebSocket connection established with server.');
    const clientId = Math.random().toString(36).substring(2, 9);
    console.log(`Client connected: ${clientId}`);
    console.info('There are now ' + wss.clients.size + " client(s)");
    const newUser: User = {
        name: '',
        clientId,
        color: '',
    }
    users.push(newUser);

    ws.on('message', (raw) => {
        const data = JSON.parse(raw.toString());
        const foundUser = users.find(user => user.clientId === data.clientId);
        if (data.type === 'join') {
            ws.name = data.name;
            console.info(`${ws.name} joined the chat!`);
            
            if (foundUser) {
                foundUser.color = data.color;
                foundUser.name = data.name;
            }
            else {
                console.error('Cannot find foundUser');
            }

            const chatEntry = {
                timestamp: Date.now(),
                name: 'Server',
                message: `${data.name} joined the chat! Say hi!`,
                clientId: clientId,
                color: '#FFFFFF',
            };
            wss.clients.forEach((client: WebSocket) =>
                client.send(JSON.stringify({
                    type: 'chat',
                    payload: chatEntry
                })));
            return;
        }

        if (data.type === 'message') {
            const chatEntry = {
                timestamp: Date.now(),
                name: data.name ?? 'Anonymous',
                message: data.text,
                clientId: clientId,
                color: foundUser ? foundUser.color : '#ff0000',
            };

            chatLog.push(chatEntry);
            const chatString = `{${new Date(chatEntry.timestamp).toLocaleTimeString()}} [${data.name}]: ${data.text}`

            wss.clients.forEach((client: WebSocket) => {
                if (client.readyState === WebSocket.OPEN) {
                    /* client.send(messageString);*/
                    client.send(JSON.stringify({
                        type: 'chat',
                        payload: chatEntry
                    }));
                }
            });
        }
    });

    ws.on('close', (code: number) => {
        console.log("Client disconnected.");
        console.log("Code:", code);

        const chatEntry = {
            timestamp: Date.now(),
            name: 'Server',
            message: `${ws.name} left the chat! Bye-bye now!`,
            clientId: clientId,
            color: '#FFFFFF',
        };
        wss.clients.forEach((client: WebSocket) =>
            client.send(JSON.stringify({
                type: 'chat',
                payload: chatEntry
            })));
    
        const before = users.length;
        users = users.filter(user => user.clientId !== clientId);
        const after = users.length;

        console.log(`Removed user ${ws.name}. Users: ${before} ? ${after}`);

    });

    ws.on('error', (err) => {
        console.error('WebSocket error:', err);
    });

    ws.send(JSON.stringify({
        type: 'server',
        message: 'You are connected to the WebSocket Server!',
        id: clientId
    }));
});

wss.on('close', (code: number, reason: Buffer) => {
    console.log("Server closed");
    console.log(code, reason.toString());
});

server.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});
