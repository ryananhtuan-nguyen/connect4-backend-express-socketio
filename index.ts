import express from 'express';
import http from 'http';
import { Server } from 'socket.io';

import { BoardItem, createBoardArray } from './logics/constants';

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: '*',
  },
});

io.on('connection', (socket) => {
  //creating new room
  socket.on('creating-room', ({ roomId }: { roomId: string }) => {
    socket.join(roomId);
    console.log('CREATING ', roomId);
    const newBoard = createBoardArray();
    //successfully created room
    socket.emit('room-created', roomId);
    //send init board
    socket.emit('init-board', { newBoard });
  });

  //new player requesting board
  socket.on('request-board', ({ roomId }: { roomId: string }) => {
    socket.join(roomId);
    console.log('JOINING ', roomId);
    socket.broadcast.to(roomId).emit('new-player-joined');
  });

  //sending current board to new player
  socket.on(
    'current-board',
    ({ board, roomId }: { board: BoardItem[][]; roomId: string }) => {
      console.log('REQUESTING ', roomId);
      socket.broadcast.to(roomId).emit('your-board', { board });
    }
  );
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
