import { Cell } from "../types/types";

/**
 * Creates a deep copy of a given value.
 * @param {T} value - The value to be deep-copied.
 * @returns {T} A new deep copy of the value.
 */
export function deepCopy<T>(value: T): T {
  if (Array.isArray(value)) {
    return value.map((item) => deepCopy(item)) as T;
  } else if (typeof value === "object" && value !== null) {
    return Object.keys(value).reduce((copy, key) => {
      (copy as any)[key] = deepCopy((value as any)[key]);
      return copy;
    }, {} as T);
  }
  return value;
}

/**
 * Creates a 9x9 Sudoku board with default cell values.
 * @returns {Cell[][]} A 2D array representing the Sudoku board.
 */
export function createBoard(): Cell[][] {
  return Array.from({ length: 9 }, () =>
    Array.from({ length: 9 }, () => ({
      value: 0,
      initial: true,
      hint: false,
      draftValue: 0,
      filled: false,
    }))
  );
}

/**
 * Generates a random integer between a given minimum and maximum.
 * @param {number} min - The minimum value (inclusive).
 * @param {number} max - The maximum value (inclusive).
 * @returns {number} A random number between min and max, or -1 if max < min.
 */
export function generateRandomNumber(min: number, max: number): number {
  if (max < min) {
    return -1;
  }

  return Math.floor(Math.random() * (max - min + 1)) + min;
}
