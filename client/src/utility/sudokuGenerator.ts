import { DifficultyName, Cell } from "../types/types";
import { createBoard, deepCopy, generateRandomNumber } from "./utility";

export class Sudoku {
  #board: Cell[][];
  #initialBoard: Cell[][];

  constructor() {
    this.#initialBoard = createBoard();
    this.#board = createBoard();
  }

  /**
   * Shuffles an array of numbers randomly to generate a Sudoku board.
   * @param {number[]} array - The list of numbers to shuffle.
   * @returns {number[]} - A new shuffled array.
   */
  shuffle(array: number[]): number[] {
    return array.sort(() => Math.random() - 0.5);
  }

  /**
   * Checks if a given number can be placed in the specified cell without breaking Sudoku rules.
   * @param {Cell[][]} board - The current Sudoku board.
   * @param {number} row - The row index.
   * @param {number} column - The column index.
   * @param {number} value - The value to be placed.
   * @returns {boolean} - Returns true if the placement is valid, otherwise false.
   */
  isValid(
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

  /**
   * Recursively fills the Sudoku board with valid numbers.
   * @param {Cell[][]} board - The Sudoku board to fill.
   * @param {number} [row=0] - The starting row index.
   * @param {number} [column=0] - The starting column index.
   * @returns {boolean} - Returns true if the board is successfully filled.
   */
  fillSudoku(board: Cell[][], row: number = 0, column: number = 0): boolean {
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

  /**
   * Determines the number of cells to hide based on the difficulty level.
   * @param {DifficultyName} level - The difficulty level of the Sudoku game.
   * @returns {number} - The number of cells to hide.
   */
  getHiddenNumbersCount(level: DifficultyName): number {
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

  /**
   * Counts the number of valid Sudoku solutions for a given board state.
   * @param {Cell[][]} board - The Sudoku board.
   * @param {number} [row=0] - The starting row index.
   * @param {number} [column=0] - The starting column index.
   * @returns {number} - The number of valid solutions.
   */
  countSolutions(board: Cell[][], row: number = 0, column: number = 0): number {
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

  /**
   * Removes numbers from a fully filled Sudoku board to create a playable puzzle.
   * @param {Cell[][]} board - The completed Sudoku board.
   * @param {number} difficulty - The number of cells to remove based on difficulty.
   */
  removeNumbers(initialBoard: Cell[][], difficulty: number): Cell[][] {
    const board = deepCopy(initialBoard);
    let attempts = difficulty;

    while (attempts > 0) {
      const row = Math.floor(Math.random() * 9);
      const col = Math.floor(Math.random() * 9);

      if (board[row][col].value === 0) continue;

      const temp = board[row][col].value;
      board[row][col].value = 0;

      const boardCopy = deepCopy(board);
      if (this.countSolutions(boardCopy) !== 1) {
        board[row][col].value = temp;

        board[row][col].initial = true;
      } else {
        attempts--;
        board[row][col].initial = false;
      }
    }

    return board;
  }

  /**
   * Generates a new Sudoku board based on the given difficulty level.
   * @param {DifficultyName} level - The difficulty level.
   */
  generateSudokuBoard(level: DifficultyName) {
    this.#initialBoard = createBoard();
    this.fillSudoku(this.#initialBoard);
    const hiddenNumbersCount = this.getHiddenNumbersCount(level);
    this.#board = this.removeNumbers(this.#initialBoard, hiddenNumbersCount);
  }

  /**
   * Retrieves the initial Sudoku board.
   * @returns {Cell[][]} - The initial Sudoku board before any modifications.
   */
  getInitialBoard() {
    return this.#initialBoard;
  }

  /**
   * Retrieves the current state of the Sudoku board.
   * @returns {Cell[][]} - The current Sudoku board.
   */
  getBoard() {
    return this.#board;
  }
}
