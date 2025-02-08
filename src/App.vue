<template>
  <div class="justify-center flex flex-col gap-8">
    <Topbar
      :remaining-hints="remainingHints"
      :score="score"
      :selected-level="selectedLevel"
      :timer="timer"
      @take-hint="takeHint"
      @pause-game="pauseGame"
    ></Topbar>
    <div class="flex gap-2 sm:gap-8 sm:flex-row flex-col">
      <SudokuBoard
        :board="board"
        :initial-board="initialBoard"
        :error-positions="errorPositions"
        @update-board="updateSudokuBoard"
      ></SudokuBoard>
      <div class="flex flex-col gap-2 sm:gap-4">
        <BaseButton @click="undoAction" variant="primary">
          <span>Undo</span></BaseButton
        >
        <BaseButton @click="redoAction" variant="primary"
          ><span>Redo</span></BaseButton
        >
        <BaseButton @click="toggleDraftMode" variant="primary">
          <span>Draft: {{ isDraft ? "On" : "Off" }}</span></BaseButton
        >
        <div class="hidden sm:block">
          <Leaderboard></Leaderboard>
        </div>
      </div>
    </div>
    <AvailableDigits
      :board="board"
      :initial-board="initialBoard"
      @end-game="endGame"
    ></AvailableDigits>
    <div class="sm:hidden block">
      <Leaderboard></Leaderboard>
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
    <EndGamePopup :score="score" @start-new="startNewGame"></EndGamePopup>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref } from "vue";
import AvailableDigits from "./components/AvailableDigits.vue";
import SudokuBoard from "./components/SudokuBoard.vue";
import Topbar from "./components/Topbar.vue";
import StartGameModal from "./components/StartGameModal.vue";
import { Cell, DifficultyName, CellPosition } from "./types/types";
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
const showSelectLevelModal = ref<boolean>(false);
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

const showEndGameModal = ref<boolean>(true);

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
 * - Pauses the game if the document becomes hidden (e.g., switching tabs).
 */
function handleVisibilityChange(): void {
  if (document.hidden && !showSelectLevelModal.value) {
    pauseGame();
  }
}

onMounted(() => {
  document.addEventListener("visibilitychange", handleVisibilityChange);
});

onUnmounted(() => {
  document.removeEventListener("visibilitychange", handleVisibilityChange);
});

/**
 * Resumes the game by closing the pause modal and restarting the timer.
 */
function resumeGame(): void {
  showGamePausedModal.value = false;

  //create a new timer
  start();
}

function startNewGame(): void {
  showSelectLevelModal.value = true;
  showEndGameModal.value = false;

  //reset data
  showGamePausedModal.value = false;
  timer.value = 0;
  remainingHints.value = DEFAULT_HINTS;
}

function takeHint(): void {
  if (remainingHints.value <= 0 || !board.value) {
    return;
  }

  remainingHints.value--;

  //take a random cell position and we search for the next/previous open or wrong cell and correct it
  const randomRow = generateRandomNumber(8, 0);
  const randomCol = generateRandomNumber(8, 0);

  // Try correcting the next available cell (forward search)
  if (!correctNextCell(randomRow, randomCol, true)) {
    // If nothing found, try correcting in the reverse direction
    correctNextCell(randomRow, randomCol, false);
  }

  // update score
  score.value -= DEFAULT_HINTS - remainingHints.value;
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

function addError(value: number, row: number, column: number): void {
  if (value === 0) {
    return;
  }

  if (value !== initialBoard.value[row][column].value) {
    const key = `${row}${column}`;
    errorPositions.value.set(key, { row, column });
  }
}

function clearError(row: number, column: number): void {
  const key = `${row}${column}`;
  if (errorPositions.value.has(key)) {
    errorPositions.value.delete(key);
  }
}

function updateSudokuBoard(row: number, column: number, value: number): void {
  // no need to add draft value if the board already has a value
  if (board.value[row][column].value !== 0 && isDraft.value) {
    return;
  }

  const draftValue = isDraft.value ? value : 0;
  const actualValue = isDraft.value ? 0 : value;

  updateBoard(actualValue, row, column, draftValue, isDraft.value);

  //we add the cell to the undo linked list
  undoRedoLinkedList.value.addNode(
    actualValue,
    row,
    column,
    draftValue,
    isDraft.value
  );

  // we don't want to change the score or add errors if it's in draft mode
  if (isDraft.value) {
    return;
  }

  if (value === initialBoard.value[row][column].value) {
    // 5 points / right guess
    score.value += 5;

    //clear error map if any error
    clearError(row, column);
    return;
  }

  // add error if any mistake has been found
  addError(value, row, column);

  // -1 point / mistake
  score.value--;
}

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

function undoAction() {
  if (!undoRedoLinkedList.value.canUndo()) {
    return;
  }

  const prevValue = undoRedoLinkedList.value.undo();
  if (!prevValue) {
    return;
  }

  const { row, column, draftValue, draft } = prevValue;
  //we clear the board, in case it's a draft we will clear the draft value too, we always clear the actual value since you cannot add a draft value over it.
  updateBoard(0, row, column, draft ? 0 : draftValue, draft);

  // we clear the error if we had any on that position
  clearError(row, column);
}

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

  //if the redo value was an error we should display it
  addError(value, row, column);
}

function toggleDraftMode(): void {
  isDraft.value = !isDraft.value;
}

function endGame(): void {
  showEndGameModal.value = true;

  score.value += MAX_TIME_POINTS - timer.value;
}
</script>
