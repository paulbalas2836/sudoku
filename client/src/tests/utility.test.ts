import { describe, expect, it } from "vitest";
import {
  createBoard,
  deepCopy,
  generateRandomNumber,
} from "../utility/utility";

describe("createBoard", () => {
  it("should create a new empty board", () => {
    const generatedBaoard = createBoard();
    expect(generatedBaoard).toEqual(defaultBoard);
  });
});

describe("generateRandomNumber", () => {
  it("should generate a random number between 10 and 20", () => {
    const randomNumber = generateRandomNumber(10, 20);
    expect(randomNumber).toBeGreaterThanOrEqual(10);
    expect(randomNumber).toBeLessThanOrEqual(20);
  });

  it("should return -1 if max value is smaller than min value", () => {
    const randomNumber = generateRandomNumber(25, 20);
    expect(randomNumber).toBe(-1);
  });
});

describe("deepCopy", () => {
  it("should return a deep copy of an object", () => {
    const dummyObj = { value: 1, obj: { value: 2 } };

    const deepObject = deepCopy(dummyObj);
    deepObject.obj.value = 3;

    expect(deepObject).toEqual({ value: 1, obj: { value: 3 } });
    expect(dummyObj).toEqual({ value: 1, obj: { value: 2 } });
  });
});

const defaultBoard = [
  [
    {
      value: 0,
      initial: true,
      hint: false,
      draftValue: 0,
      filled: false,
    },
    {
      value: 0,
      initial: true,
      hint: false,
      draftValue: 0,
      filled: false,
    },
    {
      value: 0,
      initial: true,
      hint: false,
      draftValue: 0,
      filled: false,
    },
    {
      value: 0,
      initial: true,
      hint: false,
      draftValue: 0,
      filled: false,
    },
    {
      value: 0,
      initial: true,
      hint: false,
      draftValue: 0,
      filled: false,
    },
    {
      value: 0,
      initial: true,
      hint: false,
      draftValue: 0,
      filled: false,
    },
    {
      value: 0,
      initial: true,
      hint: false,
      draftValue: 0,
      filled: false,
    },
    {
      value: 0,
      initial: true,
      hint: false,
      draftValue: 0,
      filled: false,
    },
    {
      value: 0,
      initial: true,
      hint: false,
      draftValue: 0,
      filled: false,
    },
  ],
  [
    {
      value: 0,
      initial: true,
      hint: false,
      draftValue: 0,
      filled: false,
    },
    {
      value: 0,
      initial: true,
      hint: false,
      draftValue: 0,
      filled: false,
    },
    {
      value: 0,
      initial: true,
      hint: false,
      draftValue: 0,
      filled: false,
    },
    {
      value: 0,
      initial: true,
      hint: false,
      draftValue: 0,
      filled: false,
    },
    {
      value: 0,
      initial: true,
      hint: false,
      draftValue: 0,
      filled: false,
    },
    {
      value: 0,
      initial: true,
      hint: false,
      draftValue: 0,
      filled: false,
    },
    {
      value: 0,
      initial: true,
      hint: false,
      draftValue: 0,
      filled: false,
    },
    {
      value: 0,
      initial: true,
      hint: false,
      draftValue: 0,
      filled: false,
    },
    {
      value: 0,
      initial: true,
      hint: false,
      draftValue: 0,
      filled: false,
    },
  ],
  [
    {
      value: 0,
      initial: true,
      hint: false,
      draftValue: 0,
      filled: false,
    },
    {
      value: 0,
      initial: true,
      hint: false,
      draftValue: 0,
      filled: false,
    },
    {
      value: 0,
      initial: true,
      hint: false,
      draftValue: 0,
      filled: false,
    },
    {
      value: 0,
      initial: true,
      hint: false,
      draftValue: 0,
      filled: false,
    },
    {
      value: 0,
      initial: true,
      hint: false,
      draftValue: 0,
      filled: false,
    },
    {
      value: 0,
      initial: true,
      hint: false,
      draftValue: 0,
      filled: false,
    },
    {
      value: 0,
      initial: true,
      hint: false,
      draftValue: 0,
      filled: false,
    },
    {
      value: 0,
      initial: true,
      hint: false,
      draftValue: 0,
      filled: false,
    },
    {
      value: 0,
      initial: true,
      hint: false,
      draftValue: 0,
      filled: false,
    },
  ],
  [
    {
      value: 0,
      initial: true,
      hint: false,
      draftValue: 0,
      filled: false,
    },
    {
      value: 0,
      initial: true,
      hint: false,
      draftValue: 0,
      filled: false,
    },
    {
      value: 0,
      initial: true,
      hint: false,
      draftValue: 0,
      filled: false,
    },
    {
      value: 0,
      initial: true,
      hint: false,
      draftValue: 0,
      filled: false,
    },
    {
      value: 0,
      initial: true,
      hint: false,
      draftValue: 0,
      filled: false,
    },
    {
      value: 0,
      initial: true,
      hint: false,
      draftValue: 0,
      filled: false,
    },
    {
      value: 0,
      initial: true,
      hint: false,
      draftValue: 0,
      filled: false,
    },
    {
      value: 0,
      initial: true,
      hint: false,
      draftValue: 0,
      filled: false,
    },
    {
      value: 0,
      initial: true,
      hint: false,
      draftValue: 0,
      filled: false,
    },
  ],
  [
    {
      value: 0,
      initial: true,
      hint: false,
      draftValue: 0,
      filled: false,
    },
    {
      value: 0,
      initial: true,
      hint: false,
      draftValue: 0,
      filled: false,
    },
    {
      value: 0,
      initial: true,
      hint: false,
      draftValue: 0,
      filled: false,
    },
    {
      value: 0,
      initial: true,
      hint: false,
      draftValue: 0,
      filled: false,
    },
    {
      value: 0,
      initial: true,
      hint: false,
      draftValue: 0,
      filled: false,
    },
    {
      value: 0,
      initial: true,
      hint: false,
      draftValue: 0,
      filled: false,
    },
    {
      value: 0,
      initial: true,
      hint: false,
      draftValue: 0,
      filled: false,
    },
    {
      value: 0,
      initial: true,
      hint: false,
      draftValue: 0,
      filled: false,
    },
    {
      value: 0,
      initial: true,
      hint: false,
      draftValue: 0,
      filled: false,
    },
  ],
  [
    {
      value: 0,
      initial: true,
      hint: false,
      draftValue: 0,
      filled: false,
    },
    {
      value: 0,
      initial: true,
      hint: false,
      draftValue: 0,
      filled: false,
    },
    {
      value: 0,
      initial: true,
      hint: false,
      draftValue: 0,
      filled: false,
    },
    {
      value: 0,
      initial: true,
      hint: false,
      draftValue: 0,
      filled: false,
    },
    {
      value: 0,
      initial: true,
      hint: false,
      draftValue: 0,
      filled: false,
    },
    {
      value: 0,
      initial: true,
      hint: false,
      draftValue: 0,
      filled: false,
    },
    {
      value: 0,
      initial: true,
      hint: false,
      draftValue: 0,
      filled: false,
    },
    {
      value: 0,
      initial: true,
      hint: false,
      draftValue: 0,
      filled: false,
    },
    {
      value: 0,
      initial: true,
      hint: false,
      draftValue: 0,
      filled: false,
    },
  ],
  [
    {
      value: 0,
      initial: true,
      hint: false,
      draftValue: 0,
      filled: false,
    },
    {
      value: 0,
      initial: true,
      hint: false,
      draftValue: 0,
      filled: false,
    },
    {
      value: 0,
      initial: true,
      hint: false,
      draftValue: 0,
      filled: false,
    },
    {
      value: 0,
      initial: true,
      hint: false,
      draftValue: 0,
      filled: false,
    },
    {
      value: 0,
      initial: true,
      hint: false,
      draftValue: 0,
      filled: false,
    },
    {
      value: 0,
      initial: true,
      hint: false,
      draftValue: 0,
      filled: false,
    },
    {
      value: 0,
      initial: true,
      hint: false,
      draftValue: 0,
      filled: false,
    },
    {
      value: 0,
      initial: true,
      hint: false,
      draftValue: 0,
      filled: false,
    },
    {
      value: 0,
      initial: true,
      hint: false,
      draftValue: 0,
      filled: false,
    },
  ],
  [
    {
      value: 0,
      initial: true,
      hint: false,
      draftValue: 0,
      filled: false,
    },
    {
      value: 0,
      initial: true,
      hint: false,
      draftValue: 0,
      filled: false,
    },
    {
      value: 0,
      initial: true,
      hint: false,
      draftValue: 0,
      filled: false,
    },
    {
      value: 0,
      initial: true,
      hint: false,
      draftValue: 0,
      filled: false,
    },
    {
      value: 0,
      initial: true,
      hint: false,
      draftValue: 0,
      filled: false,
    },
    {
      value: 0,
      initial: true,
      hint: false,
      draftValue: 0,
      filled: false,
    },
    {
      value: 0,
      initial: true,
      hint: false,
      draftValue: 0,
      filled: false,
    },
    {
      value: 0,
      initial: true,
      hint: false,
      draftValue: 0,
      filled: false,
    },
    {
      value: 0,
      initial: true,
      hint: false,
      draftValue: 0,
      filled: false,
    },
  ],
  [
    {
      value: 0,
      initial: true,
      hint: false,
      draftValue: 0,
      filled: false,
    },
    {
      value: 0,
      initial: true,
      hint: false,
      draftValue: 0,
      filled: false,
    },
    {
      value: 0,
      initial: true,
      hint: false,
      draftValue: 0,
      filled: false,
    },
    {
      value: 0,
      initial: true,
      hint: false,
      draftValue: 0,
      filled: false,
    },
    {
      value: 0,
      initial: true,
      hint: false,
      draftValue: 0,
      filled: false,
    },
    {
      value: 0,
      initial: true,
      hint: false,
      draftValue: 0,
      filled: false,
    },
    {
      value: 0,
      initial: true,
      hint: false,
      draftValue: 0,
      filled: false,
    },
    {
      value: 0,
      initial: true,
      hint: false,
      draftValue: 0,
      filled: false,
    },
    {
      value: 0,
      initial: true,
      hint: false,
      draftValue: 0,
      filled: false,
    },
  ],
];
