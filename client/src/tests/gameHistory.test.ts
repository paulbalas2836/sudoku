import { describe, it, expect, beforeEach } from "vitest";
import { GameHistory, ListNode } from "../utility/gameHistory";

describe("GameHistory", () => {
  let gameHistory: GameHistory;

  beforeEach(() => {
    gameHistory = new GameHistory();
  });

  describe("ListNode", () => {
    it("should create a ListNode with default values", () => {
      const node = new ListNode();

      expect(node.value).toEqual({
        value: 0,
        column: -1,
        row: -1,
        draftValue: 0,
        draft: false,
        prevValue: 0,
        prevDraft: 0,
      });
      expect(node.next).toBeUndefined();
      expect(node.prev).toBeUndefined();
    });

    it("should create a ListNode with custom values", () => {
      const customValue = {
        value: 5,
        column: 3,
        row: 2,
        draftValue: 1,
        draft: true,
        prevValue: 0,
        prevDraft: 0,
      };
      const node = new ListNode(customValue);

      expect(node.value).toEqual(customValue);
      expect(node.next).toBeUndefined();
      expect(node.prev).toBeUndefined();
    });
  });

  describe("GameHistory", () => {
    it("should initialize with default values", () => {
      expect(gameHistory.length).toBe(0);
      expect(gameHistory.currentPosition).toBe(0);
      expect(gameHistory.current.value).toEqual({
        value: 0,
        column: -1,
        row: -1,
        draftValue: 0,
        draft: false,
        prevValue: 0,
        prevDraft: 0,
      });
    });

    it("should add a node and update history state", () => {
      gameHistory.addNode(5, 2, 3, 1, true, 0, 0);

      expect(gameHistory.length).toBe(1);
      expect(gameHistory.currentPosition).toBe(1);
      expect(gameHistory.current.value).toEqual({
        value: 5,
        row: 2,
        column: 3,
        draftValue: 1,
        draft: true,
        prevValue: 0,
        prevDraft: 0,
      });
    });

    it("should add multiple nodes and update the current pointer to the end of the list", () => {
      gameHistory.addNode(1, 0, 0, 0, false, 0, 0);
      gameHistory.addNode(2, 1, 1, 1, true, 0, 0);
      gameHistory.addNode(3, 2, 2, 0, false, 0, 0);

      expect(gameHistory.length).toBe(3);
      expect(gameHistory.currentPosition).toBe(3);

      const secondNode = gameHistory.current.prev;
      expect(secondNode?.value).toEqual({
        value: 2,
        row: 1,
        column: 1,
        draftValue: 1,
        draft: true,
        prevValue: 0,
        prevDraft: 0,
      });

      const firstNode = secondNode?.prev;
      expect(firstNode?.value).toEqual({
        value: 1,
        row: 0,
        column: 0,
        draftValue: 0,
        draft: false,
        prevValue: 0,
        prevDraft: 0,
      });
    });

    it("should undo the last action and return the undone value", () => {
      gameHistory.addNode(1, 0, 0, 0, false, 0, 0);
      gameHistory.addNode(2, 1, 1, 1, true, 0, 0);

      const undoValue = gameHistory.undo();
      expect(undoValue).toEqual({
        value: 2,
        row: 1,
        column: 1,
        draftValue: 1,
        draft: true,
        prevValue: 0,
        prevDraft: 0,
      });
      expect(gameHistory.currentPosition).toBe(1);

      const secondUndoValue = gameHistory.undo();
      expect(secondUndoValue).toEqual({
        value: 1,
        row: 0,
        column: 0,
        draftValue: 0,
        draft: false,
        prevValue: 0,
        prevDraft: 0,
      });
      expect(gameHistory.currentPosition).toBe(0);

      const noUndoValue = gameHistory.undo();
      expect(noUndoValue).toBeUndefined();
    });

    it("should redo the last undone action and return the redone value", () => {
      gameHistory.addNode(1, 0, 0, 0, false, 0, 0);
      gameHistory.addNode(2, 1, 1, 1, true, 0, 0);
      gameHistory.undo();
      gameHistory.undo();

      const redoValue = gameHistory.redo();
      expect(redoValue).toEqual({
        value: 1,
        row: 0,
        column: 0,
        draftValue: 0,
        draft: false,
        prevValue: 0,
        prevDraft: 0,
      });
      expect(gameHistory.currentPosition).toBe(1);

      const secondRedoValue = gameHistory.redo();
      expect(secondRedoValue).toEqual({
        value: 2,
        row: 1,
        column: 1,
        draftValue: 1,
        draft: true,
        prevValue: 0,
        prevDraft: 0,
      });
      expect(gameHistory.currentPosition).toBe(2);

      const noRedoValue = gameHistory.redo();
      expect(noRedoValue).toBeUndefined();
    });

    it("should correctly indicate if undo or redo is available", () => {
      expect(gameHistory.canUndo()).toBe(false);
      expect(gameHistory.canRedo()).toBe(false);

      gameHistory.addNode(1, 0, 0, 0, false, 1, 0);
      expect(gameHistory.canUndo()).toBe(true);
      expect(gameHistory.canRedo()).toBe(false);

      gameHistory.undo();
      expect(gameHistory.canUndo()).toBe(false);
      expect(gameHistory.canRedo()).toBe(true);

      gameHistory.redo();
      expect(gameHistory.canUndo()).toBe(true);
      expect(gameHistory.canRedo()).toBe(false);
    });

    it("should reset the list correctly", () => {
      gameHistory.addNode(1, 0, 0, 0, false, 1, 0);
      gameHistory.addNode(2, 1, 1, 1, true, 0, 0);

      gameHistory.resetList();

      expect(gameHistory.currentPosition).toBe(0);
      expect(gameHistory.length).toBe(0);
      expect(gameHistory.current).toBeInstanceOf(ListNode);
    });
  });
});
