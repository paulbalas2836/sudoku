<template>
  <div class="justify-center flex flex-col gap-4 md:gap-8">
    <div v-if="showEndGameModal" class="absolute top-0 left-1/2">
      <div
        v-confetti="{ particleCount: 200, force: 0.3, duration: 5000 }"
      ></div>
    </div>
    <Topbar
      :remaining-hints="remainingHints"
      :score="score"
      :selected-level="selectedLevel"
      :timer="timer"
      @take-hint="takeHint"
      @pause-game="pauseGame"
    ></Topbar>

    <div class="flex gap-4">
      <BaseButton
        @click="undoAction"
        variant="primary"
        :disabled="!undoRedoLinkedList.canUndo()"
      >
        <span>Undo</span></BaseButton
      >
      <BaseButton
        @click="redoAction"
        variant="primary"
        :disabled="!undoRedoLinkedList.canRedo()"
        ><span>Redo</span></BaseButton
      >
      <BaseButton @click="toggleDraftMode" variant="primary">
        <span>Draft: {{ isDraft ? "On" : "Off" }}</span></BaseButton
      >
    </div>
    <div class="flex gap-2 sm:gap-8 sm:flex-row flex-col">
      <SudokuBoard
        :board="board"
        :initial-board="initialBoard"
        :error-positions="errorPositions"
        :completed-area="completedArea"
        :prev-completed-areas="prevCompletedAreas"
        :current-selected-cell="currentSelectedCell"
        @update-current-selected-cell="updateCurrentSelectedCell"
        @update-completed-area="updateCompletedArea"
        @update-prev-completed-areas="updatePrevCompletedAreas"
        @update-board="updateSudokuBoard"
      ></SudokuBoard>
      <div class="flex flex-col gap-2 sm:gap-4">
        <div class="hidden sm:block">
          <Leaderboard :leaderboard="leaderboard"></Leaderboard>
        </div>
      </div>
    </div>
    <AvailableDigits
      :board="board"
      :initial-board="initialBoard"
      @end-game="endGame"
    ></AvailableDigits>
    <div class="sm:hidden block">
      <Leaderboard :leaderboard="leaderboard"></Leaderboard>
    </div>
  </div>
  <div v-if="showSelectLevelModal">
    <StartGameModal @select="selectLevel"></StartGameModal>
  </div>

  <div v-if="showGamePausedModal">
    <PauseGameModal
      @resume-play="resumeGame"
      @start-new="startNewGame"
    ></PauseGameModal>
  </div>

  <div v-if="showEndGameModal">
    <EndGamePopup
      :score="score"
      :difficulty="selectedLevel"
      @start-new="startNewGame"
    ></EndGamePopup>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref } from "vue";
import AvailableDigits from "./components/AvailableDigits.vue";
import SudokuBoard from "./components/SudokuBoard.vue";
import Topbar from "./components/Topbar.vue";
import StartGameModal from "./components/StartGameModal.vue";
import { vConfetti } from "@neoconfetti/vue";
import {
  Cell,
  DifficultyName,
  CellPosition,
  CompletedAreaType,
  PrevCompletedAreasType,
  AreaType,
  LeaderboardType,
} from "./types/types";
import PauseGameModal from "./components/PauseGameModal.vue";
import Leaderboard from "./components/Leaderboard.vue";
import { Sudoku } from "./utility/sudokuGenerator";
import BaseButton from "./base/BaseButton.vue";
import { deepCopy, generateRandomNumber } from "./utility/utility";
import EndGamePopup from "./components/EndGamePopup.vue";
import { GameHistory } from "./utility/gameHistory";

const ONE_HOUR_IN_SECONDS: number = 3600;
const MAX_TIME_POINTS: number = 500;

const timer = ref<number>(0);
const showGamePausedModal = ref<boolean>(false);
const showSelectLevelModal = ref<boolean>(true);
const intervalReference = ref<ReturnType<typeof setInterval>>();

const DEFAULT_HINTS: number = 10;
const remainingHints = ref<number>(DEFAULT_HINTS);

const sudokuBoardInstance = new Sudoku();
const initialBoard = ref<Cell[][]>(sudokuBoardInstance.getInitialBoard());
const board = ref<Cell[][]>(sudokuBoardInstance.getInitialBoard());
const selectedLevel = ref<DifficultyName | null>(null);

const errorPositions = ref<Map<string, CellPosition>>(new Map());

const score = ref<number>(0);

const undoRedoLinkedList = ref<GameHistory>(new GameHistory());

const isDraft = ref<boolean>(false);

const showEndGameModal = ref<boolean>(false);
const currentSelectedCell = ref<CellPosition | null>(null);

const completedArea = ref<CompletedAreaType>({
  column: -1,
  line: -1,
  square: -1,
});

const prevCompletedAreas = ref<PrevCompletedAreasType>({
  column: [],
  line: [],
  square: [],
});

const leaderboard = ref<LeaderboardType[]>([]);

/**
 * Updates the current completed area.
 *
 * @param {AreaType} area - The area type to update.
 * @param {number} value - The value to set for the specified area.
 */
function updateCompletedArea(area: AreaType, value: number): void {
  completedArea.value[area] = value;
}

/**
 * Updates the previous completed areas
 *
 * @param {AreaType} area - The area type to update.
 * @param {number} value - The value to append to the specified area's array.
 */
function updatePrevCompletedAreas(area: AreaType, value: number): void {
  prevCompletedAreas.value[area].push(value);
}

/**
 * Starts the game timer.
 * - Increments `timer.value` every second.
 * - Stops when reaching `ONE_HOUR_IN_SECONDS` and displays a modal.
 */
function start(): void {
  intervalReference.value = setInterval(() => {
    if (timer.value < ONE_HOUR_IN_SECONDS) {
      timer.value++;
    } else {
      clearInterval(intervalReference.value);
      showSelectLevelModal.value = true;
    }
  }, 1000);
}

/**
 * Pauses the game by stopping the timer and display the pause game modal.
 */
function pauseGame(): void {
  showGamePausedModal.value = true;

  //stop the timer
  clearInterval(intervalReference.value);
}

/**
 * Handles visibility changes of the document.
 * - Pauses the game if the document becomes hidden.
 */
function handleVisibilityChange(): void {
  if (document.hidden && !showSelectLevelModal.value) {
    pauseGame();
  }
}

/**
 * Gets the leaderboard data from the backend.
 * If there is an error retrieving data from the server, it will try to get last data stored in localstorage.
 */
async function getLeaderboard(): Promise<void> {
  try {
    const response = await fetch(
      `http://localhost:${import.meta.env.VITE_POSTGRES_PORT}/api/top3`,
      {
        method: "GET",
      }
    );

    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }

    const data = await response.json();
    leaderboard.value = data;
  } catch (e) {
    console.error("Error fetching leaderboard data:", e);

    const storedLeaderboard = localStorage.getItem("leaderboard");
    leaderboard.value = storedLeaderboard ? JSON.parse(storedLeaderboard) : [];
  }
}

onMounted(() => {
  getLeaderboard();

  document.addEventListener("visibilitychange", handleVisibilityChange);
});

onUnmounted(() => {
  document.removeEventListener("visibilitychange", handleVisibilityChange);

  if (intervalReference.value) {
    clearInterval(intervalReference.value);
  }
});

/**
 * Resumes the game by closing the pause modal and restarting the timer.
 */
function resumeGame(): void {
  showGamePausedModal.value = false;

  //create a new timer
  start();
}

/**
 * Starts a new Sudoku game by resetting relevant game states.
 */
function startNewGame(): void {
  showSelectLevelModal.value = true;
  showEndGameModal.value = false;

  //reset data
  showGamePausedModal.value = false;
  timer.value = 0;
  remainingHints.value = DEFAULT_HINTS;
  prevCompletedAreas.value = {
    column: [],
    line: [],
    square: [],
  };
  completedArea.value = {
    column: -1,
    line: -1,
    square: -1,
  };
  isDraft.value = false;
  score.value = 0;
  errorPositions.value.clear();
  undoRedoLinkedList.value = new GameHistory();

  getLeaderboard();
}

/**
 * Updates the currently selected cell position.
 *
 * @param {CellPosition | null} value - The new cell position to set, or null to deselect.
 */
function updateCurrentSelectedCell(value: CellPosition | null): void {
  currentSelectedCell.value = value;
}

/**
 * Uses a hint to reveal a correct number in the Sudoku board.
 * If a cell is selected, it attempts to correct it; otherwise, it takes a random hint.
 * Reduces the number of available hints and updates the score.
 */
function takeHint(): void {
  if (remainingHints.value <= 0) {
    return;
  }

  remainingHints.value--;

  // update score
  score.value -= DEFAULT_HINTS - remainingHints.value + 2;

  // Get the current selected cell as hint otherwise, if no cell is selected take a random hint.
  if (currentSelectedCell.value) {
    const row = currentSelectedCell.value.row;
    const col = currentSelectedCell.value.column;
    const key = `${row}${col}`;
    const hasError = key ? !!errorPositions.value.has(key) : false;

    //If the board already has a value and the value is not an error get the hint. Otherwise get a random hint.
    if (!board.value[row][col].value || hasError) {
      board.value[row][col].value = initialBoard.value[row][col].value;
      board.value[row][col].hint = true;

      if (hasError && key) {
        errorPositions.value.delete(key);
      }
      return;
    }
  }

  takeRandomHint();
}

/**
 * Takes a random hint by selecting a random cell and attempting to correct it.
 */
function takeRandomHint(): void {
  //take a random cell position and search for the next/previous open or wrong cell and correct it
  const randomRow = generateRandomNumber(0, 8);
  const randomCol = generateRandomNumber(0, 8);

  // Try correcting the next available cell (forward search)
  if (!correctNextCell(randomRow, randomCol, true)) {
    // If nothing found, try correcting in the reverse direction
    correctNextCell(randomRow, randomCol, false);
  }
}

/**
 * Find the next or previous open/wrong cell and correct it.
 * @param {number} startRow - The row index to start searching from.
 * @param {number} startCol - The column index to start searching from.
 * @param {boolean} forward - Whether to search forward (true) or backward (false).
 * @returns {boolean} - Returns true if a correction was made, false otherwise.
 */
function correctNextCell(
  startRow: number,
  startCol: number,
  forward = true
): boolean {
  if (!board.value) return true;
  const rowStep = forward ? 1 : -1;
  const colStep = forward ? 1 : -1;

  for (let i = startRow; i >= 0 && i < 9; i += rowStep) {
    for (let j = startCol; j >= 0 && j < 9; j += colStep) {
      const key = `${i}${j}`;
      const hasError = errorPositions.value.has(key);
      if (board.value[i][j].value === 0 || hasError) {
        board.value[i][j].value = initialBoard.value[i][j].value;
        board.value[i][j].hint = true;

        if (hasError) {
          errorPositions.value.delete(key);
        }

        return true;
      }
    }
  }
  return false;
}

/**
 * Selects the difficulty level for the game, generates a new Sudoku board,
 * resets the timer, and starts a new game.
 * @param {DifficultyName} level - The selected difficulty level for the Sudoku game.
 */
function selectLevel(level: DifficultyName): void {
  selectedLevel.value = level;

  // generate a new sudoku board based on the selected level
  sudokuBoardInstance.generateSudokuBoard(level);
  initialBoard.value = deepCopy(sudokuBoardInstance.getInitialBoard());
  board.value = deepCopy(sudokuBoardInstance.getBoard());

  //reset time and create a new timer
  timer.value = 0;
  start();

  showSelectLevelModal.value = false;
}

/**
 * Adds an error to the errorPositions map if the value is incorrect.
 * @param {number} value - The value entered in the cell.
 * @param {number} row - The row index of the cell.
 * @param {number} column - The column index of the cell.
 */
function addError(value: number, row: number, column: number): void {
  if (value === 0) {
    return;
  }

  if (value !== initialBoard.value[row][column].value) {
    const key = `${row}${column}`;
    errorPositions.value.set(key, { row, column });
  }
}

/**
 * Clears an error from the errorPositions map for the specified cell.
 * @param {number} row - The row index of the cell.
 * @param {number} column - The column index of the cell.
 */
function clearError(row: number, column: number): void {
  const key = `${row}${column}`;
  if (errorPositions.value.has(key)) {
    errorPositions.value.delete(key);
  }
}

/**
 * Updates the Sudoku board with a new value, and manages draft and undo/redo operations.
 * Also updates the score based on whether the entered value is correct or not.
 * @param {number} row - The row index of the cell.
 * @param {number} column - The column index of the cell.
 * @param {number} value - The value to be inserted into the cell.
 */
function updateSudokuBoard(row: number, column: number, value: number): void {
  // no need to add draft value if the board already has a value
  if (board.value[row][column].value !== 0 && isDraft.value) {
    return;
  }

  const draftValue = isDraft.value ? value : 0;
  const actualValue = isDraft.value ? 0 : value;

  // Add the cell to the undo linked list
  undoRedoLinkedList.value.addNode(
    actualValue,
    row,
    column,
    draftValue,
    isDraft.value,
    board.value[row][column].value,
    board.value[row][column].draftValue
  );

  updateBoard(actualValue, row, column, draftValue, isDraft.value);

  // Score and errors list don't change if it's in draft mode
  if (isDraft.value) {
    return;
  }

  if (value === initialBoard.value[row][column].value) {
    // 5 points / right guess - works only the first time you select the correct value
    if (!board.value[row][column].filled) {
      board.value[row][column].filled = true;
      score.value += 5;
    }

    //clear error map if any error
    clearError(row, column);
    return;
  }

  // add error if any mistake has been found
  addError(value, row, column);

  // -1 point / mistake - works as long as the correct value hasn't been found
  if (!board.value[row][column].filled) {
    score.value--;
  }
}

/**
 * Updates the value of a cell on the board.
 * @param {number} value - The new value to be set in the cell.
 * @param {number} row - The row index of the cell.
 * @param {number} column - The column index of the cell.
 * @param {number} draftValue - The value to be set if in draft mode.
 * @param {boolean} draft - Indicates if the value is a draft.
 */
function updateBoard(
  value: number,
  row: number,
  column: number,
  draftValue: number,
  draft: boolean
): void {
  board.value[row][column].value = value;

  if (draft) {
    board.value[row][column].draftValue = draftValue;
  }
}

/**
 * Removes a completed area (row, column, or square) after an undo operation.
 *
 * @param {number} row - The row index of the undone action.
 * @param {number} column - The column index of the undone action.
 */
function removeCompletedAreaAfterUndo(row: number, column: number) {
  const completedLineIndex = prevCompletedAreas.value.line.findIndex(
    (el) => el === column
  );

  if (completedLineIndex !== -1) {
    prevCompletedAreas.value.line.splice(completedLineIndex, 1);
    completedArea.value.line = -1;
  }
  const completedColumnIndex = prevCompletedAreas.value.column.findIndex(
    (el) => el === row
  );

  if (completedColumnIndex !== -1) {
    prevCompletedAreas.value.column.splice(completedColumnIndex, 1);
    completedArea.value.column = -1;
  }

  const squarePosition = Math.floor(row / 3) * 3 + Math.floor(column / 3);
  const completedSquareIndex = prevCompletedAreas.value.square.findIndex(
    (el) => el === squarePosition
  );
  if (completedSquareIndex !== -1) {
    prevCompletedAreas.value.square.splice(completedSquareIndex, 1);
    completedArea.value.square = -1;
  }
}

/**
 * Undoes the last action by reverting the board to its previous state.
 * If there is no action to undo, the function does nothing.
 */
function undoAction() {
  if (!undoRedoLinkedList.value.canUndo()) {
    return;
  }

  const prevNode = undoRedoLinkedList.value.undo();
  if (!prevNode) {
    return;
  }

  const { row, column, draft, prevValue, prevDraft } = prevNode;
  //Clear the board, in case it's a draft it will clear the draft value too, it always clear the actual value since you cannot add a draft value over it.
  updateBoard(prevValue, row, column, prevDraft, draft);
  removeCompletedAreaAfterUndo(row, column);

  // Clear the error if there is any on that position.
  clearError(row, column);

  if (prevValue !== 0) {
    addError(prevValue, row, column);
  }
}

/**
 * Redoes the last undone action by restoring the board to its next state.
 * If there is no action to redo, the function does nothing.
 */
function redoAction(): void {
  if (!undoRedoLinkedList.value.canRedo()) {
    return;
  }

  const nextValue = undoRedoLinkedList.value.redo();

  if (!nextValue) {
    return;
  }

  const { value, row, column, draftValue, draft } = nextValue;

  const actualValue = draft ? 0 : value;
  const newDraftValue = draft ? draftValue : 0;
  updateBoard(actualValue, row, column, newDraftValue, draft);

  clearError(row, column);

  // Display error from the redo value if any.
  addError(value, row, column);
}

/**
 * Toggles between draft and regular modes for editing the board.
 */
function toggleDraftMode(): void {
  isDraft.value = !isDraft.value;
}

/**
 * Ends the current game and displays the end game modal with the final score.
 */
function endGame(): void {
  showEndGameModal.value = true;

  score.value += MAX_TIME_POINTS - timer.value;

  //stop the timer
  clearInterval(intervalReference.value);
}
</script>
