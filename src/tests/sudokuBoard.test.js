import { Sudoku } from "../utility/sudokuGenerator";
import { describe, it, expect, beforeEach } from "vitest";
import { createBoard } from "../utility/utility";
describe("Sudoku Class", () => {
    let sudoku;
    beforeEach(() => {
        sudoku = new Sudoku();
    });
    it("should create an initial and current board", () => {
        expect(sudoku.getInitialBoard()).toEqual(createBoard());
        expect(sudoku.getBoard()).toEqual(createBoard());
    });
    describe("isValid", () => {
        it("should return true if a number is valid in a cell", () => {
            const board = createBoard();
            expect(sudoku.isValid(board, 0, 0, 1)).toBe(true);
        });
        it("should return false if a number is already in the row", () => {
            const board = createBoard();
            board[0][0].value = 1;
            expect(sudoku.isValid(board, 0, 1, 1)).toBe(false);
        });
        it("should return false if a number is already in the column", () => {
            const board = createBoard();
            board[0][0].value = 1;
            expect(sudoku.isValid(board, 1, 0, 1)).toBe(false);
        });
        it("should return false if a number is already in the 3x3 block", () => {
            const board = createBoard();
            board[0][0].value = 1;
            expect(sudoku.isValid(board, 1, 1, 1)).toBe(false);
        });
    });
    describe("fillSudoku", () => {
        it("should fill a valid Sudoku board", () => {
            const board = createBoard();
            const result = sudoku.fillSudoku(board);
            expect(result).toBe(true);
        });
    });
    describe("removeNumbers", () => {
        it("should remove numbers from the board", () => {
            const board = createBoard();
            sudoku.fillSudoku(board);
            const updatedBoard = sudoku.removeNumbers(board, 20);
            let count = 0;
            for (let i = 0; i < 9; i++) {
                for (let j = 0; j < 9; j++) {
                    if (updatedBoard[i][j].value === 0) {
                        count++;
                    }
                }
            }
            expect(count).toBeGreaterThan(0);
        });
    });
    describe("getHiddenNumbersCount", () => {
        it("should return a value between 41 and 45", () => {
            const hiddenCells = sudoku.getHiddenNumbersCount("Beginner");
            expect(hiddenCells).toBeGreaterThanOrEqual(41);
            expect(hiddenCells).toBeLessThanOrEqual(45);
        });
        it("should return a value between 45 and 49", () => {
            const hiddenCells = sudoku.getHiddenNumbersCount("Intermediate");
            expect(hiddenCells).toBeGreaterThanOrEqual(45);
            expect(hiddenCells).toBeLessThanOrEqual(49);
        });
        it("should return a value between 49 and 53", () => {
            const hiddenCells = sudoku.getHiddenNumbersCount("Hard");
            expect(hiddenCells).toBeGreaterThanOrEqual(49);
            expect(hiddenCells).toBeLessThanOrEqual(53);
        });
        it("should return a value between 53 and 57", () => {
            const hiddenCells = sudoku.getHiddenNumbersCount("Expert");
            expect(hiddenCells).toBeGreaterThanOrEqual(53);
            expect(hiddenCells).toBeLessThanOrEqual(57);
        });
    });
    describe("countSolutions", () => {
        const createBoard = (rows) => rows.map((row) => row.map((value) => ({
            value,
            initial: true,
            hint: false,
            draftValue: 0,
        })));
        it("should return 1 for a solved board", () => {
            const solvedBoard = createBoard([
                [5, 3, 4, 6, 7, 8, 9, 1, 2],
                [6, 7, 2, 1, 9, 5, 3, 4, 8],
                [1, 9, 8, 3, 4, 2, 5, 6, 7],
                [8, 5, 9, 7, 6, 1, 4, 2, 3],
                [4, 2, 6, 8, 5, 3, 7, 9, 1],
                [7, 1, 3, 9, 2, 4, 8, 5, 6],
                [9, 6, 1, 5, 3, 7, 2, 8, 4],
                [2, 8, 7, 4, 1, 9, 6, 3, 5],
                [3, 4, 5, 2, 8, 6, 1, 7, 9],
            ]);
            expect(sudoku.countSolutions(solvedBoard)).toBe(1);
        });
        it("should return 1 for a valid board with a unique solution", () => {
            const uniqueBoard = createBoard([
                [5, 3, 0, 6, 7, 8, 9, 1, 2],
                [6, 7, 2, 1, 9, 5, 3, 4, 8],
                [1, 9, 8, 3, 4, 2, 5, 6, 7],
                [8, 5, 9, 7, 6, 1, 4, 2, 3],
                [4, 2, 6, 8, 5, 3, 7, 9, 1],
                [7, 1, 3, 9, 2, 4, 8, 5, 6],
                [9, 6, 1, 5, 3, 7, 2, 8, 4],
                [2, 8, 7, 4, 1, 9, 6, 3, 5],
                [3, 4, 5, 2, 8, 6, 1, 7, 0],
            ]);
            expect(sudoku.countSolutions(uniqueBoard)).toBe(1);
        });
        it("should return more than 1 for a board with multiple solutions", () => {
            const multipleSolutionsBoard = createBoard([
                [0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0],
            ]);
            expect(sudoku.countSolutions(multipleSolutionsBoard)).toBeGreaterThan(1);
        });
    });
});
//# sourceMappingURL=sudokuBoard.test.js.map