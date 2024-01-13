import express from 'express';
import http from 'http';
import { Server } from 'socket.io';

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: '*',
  },
});

const currentPlayer = [] as string[];

io.on('connection', (socket) => {
  //connected
  socket.on('client-ready', () => {
    socket.emit('client-ready1', 'Hello from server');
  });
  //connecting player
  socket.on('player-connected', (data: string) => {});

  //next turn
  socket.on('finish-turn', (data) => {
    console.log(data);
  });
});

app.get('/', (_, res) => {
  res.send(`
  <div style="display:flex; justify-content:center; align-items:center; flex-direction:column; width:100%; height:100%;"
  <h1 style="text-align:center;">Hello from server</h1>
  <h2 style="text-align:center;">Send request to begin</h2>
  <h3 style="text-align:center;"><a href='http://localhost:3000'>Go back to client</a></h3>
  </div>
  `);
});

server.listen(3001, () => {
  console.log('Server is listening on port 3001');
});
