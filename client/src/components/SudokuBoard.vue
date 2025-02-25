<template>
  <div class="grid grid-cols-9 bg-white rounded-lg shadow-md">
    <div v-for="(row, indexRow) in board" :key="indexRow">
      <div
        v-for="(cell, indexColumn) in row"
        ref="cells"
        :key="`${indexColumn}-${indexRow}`"
        class="border-r border-b border-gray-200 hover:bg-gray-200 transition-all ease-in-out duration-200 min-w-6 sm:w-10 md:w-14 max-w-14 aspect-square flex items-center justify-center focus:border-2 focus:border-blue-500 focus:bg-blue-200"
        :class="[
          getBorderStyle(indexRow + 1, indexColumn + 1),
          getStyleBasedOnValueType(indexRow, indexColumn, cell),
        ]"
        @keypress="(e) => fillCell(e, indexRow, indexColumn, cell)"
        @focus="selectCell(indexRow, indexColumn, cell)"
        :tabindex="cell.initial || cell.hint ? -1 : 0"
      >
        <span
          v-if="cell.value !== 0 || cell.draftValue !== 0"
          :class="{ italic: cell.value === 0 && cell.draftValue }"
          class="text-sm md:text-xl text-center"
        >
          {{ cell.value !== 0 ? cell.value : cell.draftValue }}
        </span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import {
  AreaType,
  Cell,
  CellPosition,
  CompletedAreaType,
  PrevCompletedAreasType,
} from "../types/types";
import gsap from "gsap";

const {
  board,
  errorPositions,
  initialBoard,
  completedArea,
  prevCompletedAreas,
} = defineProps<{
  board: Cell[][];
  initialBoard: Cell[][];
  errorPositions: Map<string, CellPosition>;
  completedArea: CompletedAreaType;
  prevCompletedAreas: PrevCompletedAreasType;
}>();
const emit = defineEmits<{
  (event: "update-board", row: number, column: number, value: number): void;
  (event: "update-completed-area", area: AreaType, value: number): void;
  (event: "update-prev-completed-areas", area: AreaType, value: number): void;
  (event: "update-current-selected-cell", value: CellPosition | null): void;
}>();

/**
 * Determines the background color of a Sudoku cell based on its state.
 * @param {number} row - The row index of the cell.
 * @param {number} column - The column index of the cell.
 * @param {Cell} cell - The cell object containing its properties.
 * @returns {string} - A Tailwind CSS class representing the background color.
 */
function getStyleBasedOnValueType(
  row: number,
  column: number,
  cell: Cell
): string {
  if (cell.hint) {
    return "bg-blue-200 font-bold text-black";
  }

  if (cell.initial) {
    return "bg-gray-300 font-bold text-black";
  }

  if (errorPositions.has(`${row}${column}`)) {
    return "border border-red-500 !bg-red-300 font-medium text-gray-600";
  }

  return "font-medium text-gray-600";
}

/**
 * Determines the border style for a Sudoku cell based on its position.
 * @param {number} row - The row index of the cell.
 * @param {number} column - The column index of the cell.
 * @returns {string} - A Tailwind CSS class representing the border style.
 */
function getBorderStyle(row: number, column: number): string {
  let dynamicClass = "";
  if (column === 1) {
    dynamicClass = `${dynamicClass} border-t-2 border-t-black`;
  }

  if (row === 9) {
    dynamicClass = `${dynamicClass} border-r-2 border-r-black`;
  }

  if (row === 1) {
    dynamicClass = `${dynamicClass} border-l-2 border-l-black`;
  }

  if (column === 9) {
    dynamicClass = `${dynamicClass} border-b-2 border-b-black`;
  }

  if (row === 3 || row === 6) {
    dynamicClass = `${dynamicClass} border-r-2 border-r-gray-400`;
  }

  if (column === 3 || column === 6) {
    dynamicClass = `${dynamicClass} border-b-2 border-b-gray-400`;
  }

  return dynamicClass;
}

const cells = ref<HTMLDivElement[]>([]);

watch(
  () => board,
  () => {
    for (let i = 0; i < board.length; ++i) {
      updateCompletedColumns(i);
      updateCompletedLines(i);
      updateCompletedSquares(i);
    }
  },
  { deep: true }
);

/**
 * Updates the completed columns in the Sudoku board.
 * @param {number} i - The column index to check for completion.
 */
function updateCompletedColumns(i: number): void {
  if (
    prevCompletedAreas.column.length &&
    prevCompletedAreas.column.includes(i)
  ) {
    return;
  }

  const columnList = board[i]
    .map((cell, j) =>
      cell.value === initialBoard[i][j].value ? i * 9 + j : null
    )
    .filter((value) => value !== null) as number[];

  if (columnList.length === 9) {
    emit("update-completed-area", "column", i);
  }
}

/**
 * Updates the completed rows in the Sudoku board.
 * @param {number} i - The row index to check for completion.
 */
function updateCompletedLines(i: number): void {
  if (prevCompletedAreas.line.length && prevCompletedAreas.line.includes(i)) {
    return;
  }

  const lineList = board
    .map((row, j) =>
      row[i].value === initialBoard[j][i].value ? j * 9 + i : null
    )
    .filter((value) => value !== null) as number[];

  if (lineList.length === 9) {
    emit("update-completed-area", "line", i);
  }
}

/**
 * Updates the completed 3x3 squares in the Sudoku board.
 * @param {number} i - The square index to check for completion (0-8).
 */
function updateCompletedSquares(i: number): void {
  if (
    prevCompletedAreas.square.length &&
    prevCompletedAreas.square.includes(i)
  ) {
    return;
  }

  const startRow = Math.floor(i / 3) * 3;
  const startCol = (i % 3) * 3;
  let isSquareMatching = true;

  // Compare each cell in the 3x3 square
  for (let j = 0; j < 3 && isSquareMatching; ++j) {
    for (let k = 0; k < 3 && isSquareMatching; ++k) {
      const row = startRow + j;
      const col = startCol + k;
      if (board[row][col].value !== initialBoard[row][col].value) {
        isSquareMatching = false;
      }
    }
  }

  if (isSquareMatching) {
    emit("update-completed-area", "square", i);
  }
}

/**
 * Animates the sudoku board in sequence upon line, column or square completion.
 *
 * @param {HTMLDivElement[]} list - The list of div elements to animate.
 * @param {AreaType} area - The area type associated with the animation.
 * @param {number} value - The value to emit with the event.
 * @fires update-prev-completed-areas - Emits the updated area and value.
 */
function animate(list: HTMLDivElement[], area: AreaType, value: number) {
  const timeline = gsap.timeline({ paused: true });

  list.forEach((cell) => {
    timeline.to(cell, {
      duration: 0.2,
      onStart: () => cell.classList.add("!bg-green-200", "text-green-800"),
    });
  });

  timeline.to(list, {
    onStart: () => {
      list.forEach((cell) => {
        cell.classList.remove("!bg-green-200", "text-green-800");
      });
    },
    duration: 0.5,
  });

  timeline.play();

  emit("update-prev-completed-areas", area, value);
}

/**
 * Gets the cell DOM elements from a completed row.
 * @param {number} completedLine - The index of the completed row.
 * @returns {HTMLDivElement[]} Array of cell DOM elements in the completed row.
 */
function getCellPositionsFromCompletedLine(
  completedLine: number
): HTMLDivElement[] {
  const filteredCells: HTMLDivElement[] = [];
  for (let i = completedLine; i < cells.value.length; i += 9) {
    filteredCells.push(cells.value[i]);
  }

  return filteredCells;
}

watch(
  () => completedArea.line,
  (newValue) => {
    if (newValue !== -1) {
      const filteredCells = getCellPositionsFromCompletedLine(newValue);
      animate(filteredCells, "line", newValue);
    }
  }
);

/**
 * Gets the cell DOM elements from a completed column.
 * @param {number} completedColumn - The index of the completed column.
 * @returns {HTMLDivElement[]} Array of cell DOM elements in the completed column.
 */
function getCellPositionsFromCompletedColumn(
  completedColumn: number
): HTMLDivElement[] {
  const filteredCells: HTMLDivElement[] = [];

  for (let i = completedColumn * 9; i < completedColumn * 9 + 9; ++i) {
    filteredCells.push(cells.value[i]);
  }

  return filteredCells;
}
watch(
  () => completedArea.column,
  (newValue) => {
    if (newValue !== -1) {
      const filteredCells = getCellPositionsFromCompletedColumn(newValue);
      animate(filteredCells, "column", newValue);
    }
  }
);

/**
 * Gets the cell DOM elements from a completed 3x3 square.
 * @param {number} completedSquare - The index of the completed square (0-8).
 * @returns {HTMLDivElement[]} Array of cell DOM elements in the completed square.
 */
function getCellPositionsFromCompletedSquare(
  completedSquare: number
): HTMLDivElement[] {
  const filteredCells: HTMLDivElement[] = [];

  // Calculate the starting position of the 3x3 square
  const squareRow = Math.floor(completedSquare / 3);
  const squareCol = completedSquare % 3;
  const startingPoint = squareRow * 27 + squareCol * 3;

  // Iterate over the 3x3 square
  for (let row = 0; row < 3; row++) {
    for (let col = 0; col < 3; col++) {
      const cellIndex = startingPoint + row * 9 + col;
      if (cellIndex < cells.value.length) {
        filteredCells.push(cells.value[cellIndex]);
      }
    }
  }

  return filteredCells;
}

watch(
  () => completedArea.square,
  (newValue) => {
    if (newValue !== -1) {
      const filteredCells = getCellPositionsFromCompletedSquare(newValue);
      animate(filteredCells, "square", newValue);
    }
  }
);

/**
 * Selects a cell in a grid and updates the current selected cell.
 *
 * @param {number} row - The row index of the selected cell.
 * @param {number} column - The column index of the selected cell.
 * @param {Cell} cell - The cell object containing its properties.
 */
function selectCell(row: number, column: number, cell: Cell) {
  if (cell.initial || cell.hint) {
    return;
  }

  const cellPostion = { row, column };
  emit("update-current-selected-cell", cellPostion);
}

/**
 * Handles user input to fill a Sudoku cell with a number.
 * @param {KeyboardEvent} e - The keyboard event triggered by the user.
 * @param {number} row - The row index of the cell.
 * @param {number} column - The column index of the cell.
 * @param {Cell} cell - The cell object containing its properties.
 */
function fillCell(e: KeyboardEvent, row: number, column: number, cell: Cell) {
  if (cell.initial || cell.hint || isCellInCompletedArea(row, column)) {
    return;
  }

  const parsedKey = Number(e.key);

  if (!parsedKey) {
    return;
  }

  emit("update-board", row, column, parsedKey);
}

/**
 * Checks if a specific cell (identified by row and column) is part of any previously completed area.
 * Beacause of the way the grid layout works, the sudoku board in inverted and row will take the place of the column
 *
 * @param {number} row - The row index of the cell (0-8).
 * @param {number} col - The column index of the cell (0-8).
 * @returns {boolean} - True if the cell is part of any completed area, false otherwise.
 */
function isCellInCompletedArea(row: number, col: number): boolean {
  if (prevCompletedAreas.line.includes(col)) {
    return true;
  }

  if (prevCompletedAreas.column.includes(row)) {
    return true;
  }

  const squareIndex = Math.floor(row / 3) * 3 + Math.floor(col / 3);
  if (prevCompletedAreas.square.includes(squareIndex)) {
    return true;
  }

  return false;
}
</script>
