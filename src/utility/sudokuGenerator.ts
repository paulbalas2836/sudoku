import { DifficultyName, Cell } from "../types/types";
import { createBoard, deepCopy, generateRandomNumber } from "./utility";

export class Sudoku {
  private board: Cell[][];
  private initialBoard: Cell[][];

  constructor() {
    this.initialBoard = createBoard();
    this.board = createBoard();
  }

  private shuffle(array: number[]): number[] {
    return array.sort(() => Math.random() - 0.5);
  }

  private isValid(
    board: Cell[][],
    row: number,
    column: number,
    value: number
  ): boolean {
    for (let i = 0; i < 9; i++) {
      if (board[row][i].value === value || board[i][column].value === value) {
        return false;
      }
    }

    const top = Math.floor(row / 3) * 3;
    const left = Math.floor(column / 3) * 3;

    for (let i = top; i < top + 3; ++i) {
      for (let j = left; j < left + 3; ++j) {
        if (board[i][j].value === value) {
          return false;
        }
      }
    }

    return true;
  }

  private fillSudoku(
    board: Cell[][],
    row: number = 0,
    column: number = 0
  ): boolean {
    if (row === 9) return true;

    if (board[row][column].value !== 0)
      return this.fillSudoku(
        board,
        column === 8 ? row + 1 : row,
        (column + 1) % 9
      );

    const numbers = this.shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9]);
    for (const num of numbers) {
      if (this.isValid(board, row, column, num)) {
        board[row][column].value = num;
        if (
          this.fillSudoku(board, column === 8 ? row + 1 : row, (column + 1) % 9)
        ) {
          return true;
        }
        board[row][column].value = 0;
      }
    }
    return false;
  }

  private getHiddenNumbersCount(level: DifficultyName): number {
    switch (level) {
      case "Beginner":
        return 81 - generateRandomNumber(36, 40);
      case "Intermediate":
        return 81 - generateRandomNumber(32, 36);
      case "Hard":
        return 81 - generateRandomNumber(28, 32);
      case "Expert":
        return 81 - generateRandomNumber(24, 28);
      default:
        return 0;
    }
  }

  private countSolutions(
    board: Cell[][],
    row: number = 0,
    column: number = 0
  ): number {
    if (row === 9) return 1;

    if (board[row][column].value !== 0) {
      return this.countSolutions(
        board,
        column === 8 ? row + 1 : row,
        (column + 1) % 9
      );
    }

    let count = 0;
    for (let i = 1; i <= 9; ++i) {
      if (this.isValid(board, row, column, i)) {
        board[row][column].value = i;
        count += this.countSolutions(
          board,
          column === 8 ? row + 1 : row,
          (column + 1) % 9
        );
        if (count > 1) break;
        board[row][column].value = 0;
      }
    }
    return count;
  }

  private removeNumbers(board: Cell[][], difficulty: number): void {
    this.board = deepCopy(board);
    let attempts = difficulty;

    while (attempts > 0) {
      const row = Math.floor(Math.random() * 9);
      const col = Math.floor(Math.random() * 9);

      if (this.board[row][col].value === 0) continue;

      const temp = this.board[row][col].value;
      this.board[row][col].value = 0;

      const boardCopy = deepCopy(this.board);
      if (this.countSolutions(boardCopy) !== 1) {
        this.board[row][col].value = temp;

        this.board[row][col].initial = true;
      } else {
        attempts--;
        this.board[row][col].initial = false;
      }
    }
  }

  generateSudokuBoard(level: DifficultyName) {
    this.initialBoard = createBoard();
    this.fillSudoku(this.initialBoard);
    const hiddenNumbersCount = this.getHiddenNumbersCount(level);
    this.removeNumbers(this.initialBoard, hiddenNumbersCount);
  }

  getInitialBoard() {
    return this.initialBoard;
  }

  getBoard() {
    return this.board;
  }
}
