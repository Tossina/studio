
import 'dotenv/config';
import express from 'express';
import { createServer } from 'node:http';
import { Server } from 'socket.io';
import next from 'next';
import { gameManager } from './src/lib/game-manager';

const dev = process.env.NODE_ENV !== 'production';
const hostname = 'localhost';
const port = 3000;
// when using middleware `hostname` and `port` must be provided below
const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = express();
  const httpServer = createServer(server);
  const io = new Server(httpServer);
  gameManager.initialize(io);

  io.on('connection', (socket) => {
    console.log('A user connected', socket.id);

    socket.on('disconnect', () => {
      console.log('User disconnected', socket.id);
    });

    socket.on('player-action', async ({ gameId, userId, action, amount }) => {
      console.log(`Action received from ${userId}: ${action}`);
      await gameManager.handleAction(gameId, userId, action, amount);
    });

    socket.on('join-game', async ({ gameId, userId }) => {
      console.log(`Socket ${socket.id} joining game ${gameId} as ${userId}`);
      await gameManager.joinGame(socket, gameId, userId);
    });
  });

  server.use((req, res) => {
    return handle(req, res);
  });

  httpServer.listen(port, () => {
    console.log(`> Ready on http://${hostname}:${port}`);
  });
});
