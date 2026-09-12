import http from "node:http";
import { Server } from "socket.io";

const port = Number(globalThis.process?.env.PORT || 3001);
const allowedOrigins = (globalThis.process?.env.CLIENT_ORIGINS || "*")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

const httpServer = http.createServer((request, response) => {
  if (request.url === "/health") {
    response.writeHead(200, { "Content-Type": "application/json" });
    response.end(JSON.stringify({ ok: true, visitors: io.engine.clientsCount }));
    return;
  }

  response.writeHead(404);
  response.end();
});

const io = new Server(httpServer, {
  cors: {
    origin: allowedOrigins.includes("*") ? true : allowedOrigins,
    methods: ["GET", "POST"],
  },
});

const broadcastVisitorCount = () => {
  io.emit("visitor-count", io.engine.clientsCount);
};

io.on("connection", (socket) => {
  broadcastVisitorCount();

  socket.on("disconnect", broadcastVisitorCount);
});

httpServer.listen(port, () => {
  console.log(`Realtime server listening on port ${port}`);
});
