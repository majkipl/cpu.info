import { WebSocketServer } from "ws";
import si from "systeminformation";

const wss = new WebSocketServer({ port: 8080 });
const ttl = 1000;

wss.on("connection", (ws) => {
    ws.on("message", (data) => {
        console.log("received: %s", data);
    });

    setInterval(async () => {
        const cpuTemp = JSON.stringify(await si.currentLoad());
        ws.send(cpuTemp);
    }, ttl);
});
