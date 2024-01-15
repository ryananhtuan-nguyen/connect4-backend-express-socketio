import express from 'express';
import http from 'http';
import { Server } from 'socket.io';

import { BoardItem, createBoardArray } from './logics/constants';
import { checkWinner } from './logics/checkWin';

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: '*',
  },
});
type RoomDetail = {
  roomId: string;
  roomUsers: string[];
};

let currentRooms = [] as RoomDetail[];

io.on('connection', (socket) => {
  //creating new room
  socket.on('creating-room', ({ roomId }: { roomId: string }) => {
    socket.join(roomId);
    console.log('CREATING ', roomId);
    //add room to session
    const newRoom = { roomId, roomUsers: [socket.id] };
    currentRooms.push(newRoom);
    const newBoard = createBoardArray();
    //successfully created room
    socket.emit('room-created', roomId);
    //send init board
    socket.emit('init-board', {
      newBoard,
      userInRoom: newRoom.roomUsers.length,
    });
  });

  //new player requesting board
  socket.on('request-board', ({ roomId }: { roomId: string }) => {
    socket.join(roomId);
    console.log('JOINING ', roomId);
    const currentRoom = currentRooms.find((item) => item.roomId == roomId);
    console.log(currentRoom, 'BEFORE PUSH');
    if (currentRoom) {
      currentRoom.roomUsers.push(socket.id);
      console.log(currentRoom, 'currentROOM');
      socket.broadcast.to(roomId).emit('new-player-joined', {
        users: currentRoom.roomUsers.length,
      });
    }
  });

  //sending current board to new player
  socket.on(
    'current-board',
    ({ board, roomId }: { board: BoardItem[][]; roomId: string }) => {
      console.log('REQUESTING ', roomId);
      const currentRoom = currentRooms.find((item) => item.roomId == roomId);
      console.log(currentRoom, 'CURRENT ROOM');
      if (currentRoom)
        socket.broadcast.to(roomId).emit('your-board', {
          board,
          userInRoom: currentRoom.roomUsers.length,
        });
    }
  );

  //Finish a turn
  socket.on(
    'finished-turn',
    (data: {
      currentPlayer: string;
      newBoard: BoardItem[][];
      recentMove: number[];
      roomId: string;
    }) => {
      //TODO Checkwin
      const [x, y] = data.recentMove;
      console.log(x, y, 'LINE80 Index');
      const isWinner = checkWinner({ x, y }, data.newBoard);
      socket.broadcast.emit('next-turn', {
        turn: data.currentPlayer == 'X' ? 'O' : 'X',
        currentBoard: data.newBoard,
      });
      if (isWinner) {
        io.emit('game-end', {
          winner: data.currentPlayer,
        });
      }
    }
  );

  //clear

  socket.on('clear', (roomId: string) => {
    io.to(roomId).emit('clear-game');
  });

  //currentplayers
  socket.on('get-current-players', (roomId: string) => {
    console.log(roomId);
  });

  //disconnecting
  socket.on('disconnect', () => {
    currentRooms = currentRooms.map((item) => {
      if (item.roomUsers.includes(socket.id)) {
        return {
          ...item,
          roomUsers: item.roomUsers.filter((id) => id !== socket.id),
        };
      }
      return item;
    });
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
