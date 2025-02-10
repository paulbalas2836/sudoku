export class ListNode {
    value;
    next;
    prev;
    constructor(value = {
        value: 0,
        column: -1,
        row: -1,
        draftValue: 0,
        draft: false,
        prevValue: 0,
        prevDraft: 0,
    }, next, prev) {
        this.value = value;
        this.next = next;
        this.prev = prev;
    }
}
export class GameHistory {
    current;
    length;
    currentPosition;
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
    addNode(value, row, column, draftValue, draft, prevValue, prevDraft) {
        this.length++;
        this.currentPosition = this.length;
        //we will free the memory by removing the link between old nodes
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
     * Moves the `current` pointer back to the previous node, effectively undoing the last action.
     * If there is no previous node, the function returns `undefined`, indicating no undo is possible.
     *
     * @returns {CellPositionWithValue | undefined} - The cell position and value of the undone element,
     * or `undefined` if there is no previous action to undo.
     */
    undo() {
        // we have no value to undo
        if (!this.current.prev) {
            return;
        }
        this.currentPosition--;
        const undoData = this.current.value;
        this.current = this.current.prev;
        return undoData;
    }
    /**
     * Moves the `current` pointer back to the next node, effectively redoing the last undo action.
     * If there is no next node, the function returns `undefined`, indicating no redo is possible.
     *
     * @returns {CellPositionWithValue | undefined} - The cell position and value of the redo element,
     * or `undefined` if there is no last action to redo.
     */
    redo() {
        // we have no value to redo
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
    canUndo() {
        return this.currentPosition > 0;
    }
    /**
     * Checks if there is an action available to redo.
     * @returns {boolean} - `true` if a redo action is available, otherwise `false`.
     */
    canRedo() {
        return this.currentPosition < this.length;
    }
}
//# sourceMappingURL=gameHistory.js.map