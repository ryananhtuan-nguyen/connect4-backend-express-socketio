import { BoardItem } from './constants';

type Point = {
  x: number;
  y: number;
};

const checkWin = ({ x, y }: Point, currentBoard: BoardItem[][]) => {
  let turn = currentBoard[x][y].value;
  const topLeft = [
    [x - 3, y - 3],
    [x - 2, y - 2],
    [x - 1, y - 1],
  ];
  const topRight = [
    [x + 3, y - 3],
    [x + 2, y - 2],
    [x + 1, y - 1],
  ];
  const bottomLeft = [
    [x - 3, y + 3],
    [x - 2, y + 2],
    [x - 1, y + 1],
  ];
  const bottomRight = [
    [x + 1, y + 1],
    [x + 2, y + 2],
    [x + 3, y + 3],
  ];
  const top = [
    [x, y - 3],
    [x, y - 2],
    [x, y - 1],
  ];
  const bottom = [
    [x, y + 1],
    [x, y + 2],
    [x, y + 3],
  ];
  const left = [
    [x - 3, y],
    [x - 2, y],
    [x - 1, y],
  ];
  const right = [
    [x + 1, y],
    [x + 2, y],
    [x + 3, y],
  ];

  const checkLineWin = (line: number[][]) => {
    return line.every(([x, y]) => currentBoard[x][y].value == turn);
  };

  const winningLines = [
    topLeft,
    top,
    topRight,
    left,
    right,
    bottomLeft,
    bottom,
    bottomRight,
  ];

  return winningLines.some((line) => checkLineWin(line));
};
