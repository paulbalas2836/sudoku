import { Cell } from "../types/types";

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

export function createBoard(): Cell[][] {
  return Array.from({ length: 9 }, () =>
    Array.from({ length: 9 }, () => ({
      value: 0,
      initial: true,
      hint: false,
      draftValue: 0,
    }))
  );
}

export function generateRandomNumber(min: number, max: number): number {
  if (max < min) {
    return -1;
  }

  return Math.floor(Math.random() * (max - min + 1)) + min;
}
