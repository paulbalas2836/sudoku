import { CellPositionWithValue } from "../types/types";

export class ListNode {
  value: CellPositionWithValue;
  next?: ListNode;
  prev?: ListNode;

  constructor(
    value: CellPositionWithValue = {
      value: 0,
      column: -1,
      row: -1,
      draftValue: 0,
      draft: false,
      prevValue: 0,
      prevDraft: 0,
    },
    next?: ListNode,
    prev?: ListNode
  ) {
    this.value = value;
    this.next = next;
    this.prev = prev;
  }
}

export class GameHistory {
  current: ListNode;
  length: number;
  currentPosition: number;

  constructor() {
    this.current = new ListNode();
    this.length = 0;
    this.currentPosition = 0;
  }

  /**
   * Adds new entry to the undo functionality
   * @param {number} value - new inserted value
   * @param {number} row - row position inside the sudoku board
   * @param {number} column - column position inside the sudoku board
   */
  addNode(
    value: number,
    row: number,
    column: number,
    draftValue: number,
    draft: boolean,
    prevValue: number,
    prevDraft: number
  ): void {
    this.length++;
    this.currentPosition = this.length;

    //Free the memory by removing the link between old nodes
    if (this.current.next) {
      this.current.next.prev = undefined;
    }

    const newNode = new ListNode({
      value,
      row,
      column,
      draftValue,
      draft,
      prevValue,
      prevDraft,
    });
    this.current.next = newNode;
    newNode.prev = this.current;

    this.current = this.current.next;
  }

  /**
   * Moves the `current` pointer back to the previous node, undoing the last action.
   * If there is no previous node, the function returns `undefined`, indicating no undo is possible.
   *
   * @returns {CellPositionWithValue | undefined} - The cell position and value of the undone element,
   * or `undefined` if there is no previous action to undo.
   */
  undo(): CellPositionWithValue | undefined {
    // No value to undo
    if (!this.current.prev) {
      return;
    }

    this.currentPosition--;

    const undoData = this.current.value;
    this.current = this.current.prev;

    return undoData;
  }

  /**
   * Moves the `current` pointer back to the next node, redoing the last undo action.
   * If there is no next node, the function returns `undefined`, indicating no redo is possible.
   *
   * @returns {CellPositionWithValue | undefined} - The cell position and value of the redo element,
   * or `undefined` if there is no last action to redo.
   */
  redo(): CellPositionWithValue | undefined {
    // No value to redo
    if (!this.current.next) {
      return;
    }

    this.currentPosition++;
    this.current = this.current.next;

    return this.current.value;
  }

  /**
   * Checks if there is an action available to undo.
   * @returns {boolean} - `true` if an undo action is available, otherwise `false`.
   */
  canUndo(): boolean {
    return this.currentPosition > 0;
  }

  /**
   * Checks if there is an action available to redo.
   * @returns {boolean} - `true` if a redo action is available, otherwise `false`.
   */
  canRedo(): boolean {
    return this.currentPosition < this.length;
  }
}
