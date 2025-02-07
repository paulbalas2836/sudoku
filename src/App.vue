<template>
  <div class="justify-center items-center flex flex-col gap-8">
    <Topbar
      :remainingHints="remainingHints"
      :score="score"
      :selectedLevel="selectedLevel"
      :timer="timer"
      @take-hint="takeHint"
      @pause-game="pauseGame"
    ></Topbar>
    <div class="flex gap-8">
      <SudokuBoard
        :board="board"
        :errorPositions="errorPositions"
        @update-board="updateSudokuBoard"
      ></SudokuBoard>
      <Leaderboard></Leaderboard>
    </div>
    <AvailableDigits :board="board"></AvailableDigits>
  </div>
  <div v-if="showModal">
    <StartGameModal @select="SelectLevel"></StartGameModal>
  </div>

  <div v-if="gamePaused">
    <PauseGameModal
      @resume-play="resumeGame"
      @start-new="startNewGame"
    ></PauseGameModal>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref } from "vue";
import AvailableDigits from "./components/AvailableDigits.vue";
import SudokuBoard from "./components/SudokuBoard.vue";
import Topbar from "./components/Topbar.vue";
import StartGameModal from "./components/StartGameModal.vue";
import { Cell, DifficultyName, ErrorPositon } from "./types/types";
import PauseGameModal from "./components/PauseGameModal.vue";
import Leaderboard from "./components/Leaderboard.vue";
import { Sudoku } from "./sudokuGenerator";
import { createBoard, deepCopy, generateRandomNumber } from "./utility";

const ONE_HOUR_IN_SECONDS = 3600;
const gamePaused = ref(false);
const timer = ref(0);
const intervalReference = ref<ReturnType<typeof setInterval>>();

function start() {
  intervalReference.value = setInterval(() => {
    if (timer.value < ONE_HOUR_IN_SECONDS) {
      timer.value++;
    } else {
      clearInterval(intervalReference.value);
      showModal.value = true;
    }
  }, 1000);
}

function pauseGame() {
  gamePaused.value = true;

  //stop the timer
  clearInterval(intervalReference.value);
}

function handleVisibilityChange() {
  if (document.hidden && !showModal.value) {
    pauseGame();
  }
}

onMounted(() => {
  document.addEventListener("visibilitychange", handleVisibilityChange);
});

onUnmounted(() => {
  document.removeEventListener("visibilitychange", handleVisibilityChange);
});

function resumeGame() {
  gamePaused.value = false;

  //create a new timer
  start();
}

const showModal = ref(true);

function closeModal() {
  showModal.value = false;
}

function startNewGame() {
  showModal.value = true;

  //reset data
  gamePaused.value = false;
  timer.value = 0;
  remainingHints.value = DEFAULT_HINTS;
}

const DEFAULT_HINTS = 10;
const remainingHints = ref(DEFAULT_HINTS);

function takeHint() {
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

const sudokuBoardInstance = new Sudoku();
const initialBoard = ref<Cell[][]>(createBoard());
const board = ref<Cell[][]>();
const selectedLevel = ref<DifficultyName | null>(null);

function SelectLevel(level: DifficultyName) {
  selectedLevel.value = level;

  // generate a new sudoku board based on the selected level
  sudokuBoardInstance.generateSudokuBoard(level);
  initialBoard.value = deepCopy(sudokuBoardInstance.getInitialBoard());
  board.value = deepCopy(sudokuBoardInstance.getBoard());

  //reset time and create a new timer
  timer.value = 0;
  start();

  closeModal();
}

const errorPositions = ref<Map<string, ErrorPositon>>(new Map());
const score = ref(0);
function updateSudokuBoard(row: number, column: number, value: number) {
  if (!board.value) {
    return;
  }

  board.value[row][column].value = value;

  const mapKey = `${row}${column}`;
  if (value === initialBoard.value[row][column].value) {
    // 5 points / right guess
    score.value += 5;

    //clear error map if any error
    if (errorPositions.value.has(mapKey)) {
      errorPositions.value.delete(mapKey);
    }
    return;
  }

  // add error if any mistake has been found
  errorPositions.value.set(`${row}${column}`, { row, column });

  // -1 point / mistake
  score.value--;
}
</script>
