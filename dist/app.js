"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http = __importStar(require("http"));
const ws_1 = __importDefault(require("ws"));
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const hostname = '127.0.0.1';
const port = 3003;
const app = (0, express_1.default)();
app.use(express_1.default.static(path_1.default.join(__dirname, 'public')));
app.get('*', (req, res) => {
    res.sendFile(path_1.default.join(__dirname, 'public', 'home.html'));
});
/*app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'home.html'));
});*/
const server = http.createServer(app);
const wss = new ws_1.default.Server({ server });
wss.on('connection', (ws) => {
    console.log('New WebSocket connection established.');
    console.log('There are ' + wss.clients.size + " client(s)");
    ws.on('message', (message) => {
        const messageString = message.toString();
        console.log(`Received message: ${messageString}`);
        wss.clients.forEach((client) => {
            if (client.readyState === ws_1.default.OPEN) {
                client.send(messageString);
            }
        });
        console.log(`Message Sent`);
    });
    ws.on('close', (code, reason) => {
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
wss.on('close', (code, reason) => {
    console.log("Server closed");
    console.log(code, reason.toString());
});
server.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});
//# sourceMappingURL=app.js.map