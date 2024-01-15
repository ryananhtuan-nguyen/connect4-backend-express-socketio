import { BoardItem } from './constants';

type Point = {
  x: number;
  y: number;
};

export const checkWinner = ({ x, y }: Point, currentBoard: BoardItem[][]) => {
  const turn = currentBoard[x][y].value;
  console.log(turn, 'LINE 10');
  console.log('CURRENTBOARD', currentBoard);
  const horizontal = [
    [x - 3, y],
    [x - 2, y],
    [x - 1, y],
    [x, y],
    [x + 1, y],
    [x + 2, y],
    [x + 3, y],
  ];

  const vertical = [
    [x, y - 3],
    [x, y - 2],
    [x, y - 1],
    [x, y],
    [x, y + 1],
    [x, y + 2],
    [x, y + 3],
  ];

  const diag1 = [
    [x - 3, y - 3],
    [x - 2, y - 2],
    [x - 1, y - 1],
    [x, y],
    [x + 1, y + 1],
    [x + 2, y + 2],
    [x + 3, y + 3],
  ];

  const diag2 = [
    [x + 3, y - 3],
    [x + 2, y - 2],
    [x + 1, y - 1],
    [x, y],
    [x - 1, y + 1],
    [x - 2, y + 2],
    [x - 3, y + 3],
  ];

  const slidingWindow = (line: number[][]) => {
    const points = line.map((numArr) => {
      const [x, y] = numArr;
      if (
        x < 0 ||
        y < 0 ||
        x > currentBoard.length - 1 ||
        y > currentBoard[0].length - 1
      ) {
        return 0;
      }
      const current = currentBoard[x][y].value;
      return current == turn ? 1 : 0;
    });

    let max = 0;
    for (let i = 0; i < 4; i++) {
      max += points[i];
    }

    if (max === 4) return true;

    for (let i = 4; i < line.length - 1; i++) {
      max = max - points[i - 4] + points[i];
      if (max === 4) return true;
    }

    return false;
  };

  const horizontalWin = slidingWindow(horizontal);
  console.log('HOR');
  const verticalWin = slidingWindow(vertical);
  console.log('ver');
  const diag1Win = slidingWindow(diag1);
  console.log('diag1');
  const diag2Win = slidingWindow(diag2);
  console.log('diag2');

  return horizontalWin || verticalWin || diag1Win || diag2Win;
};
