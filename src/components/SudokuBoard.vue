<template>
  <div class="grid grid-cols-9 bg-white rounded-lg shadow-md">
    <div v-for="(row, indexRow) in board" :key="indexRow">
      <div
        v-for="(cell, indexColumn) in row"
        :key="indexColumn"
        class="border-r border-b border-gray-200 hover:bg-gray-200 transition-all ease-in-out duration-200 w-6 sm:w-10 md:w-14 aspect-square flex items-center justify-center focus:bg-indigo-200"
        :class="[
          getBorderStyle(indexRow + 1, indexColumn + 1),
          getBackgroundColor(indexRow, indexColumn, cell),
        ]"
        @keypress="(e) => fillCell(e, indexRow, indexColumn, cell)"
        :tabindex="cell.initial || cell.hint ? -1 : 0"
        ref="cells"
      >
        <span
          v-if="cell.value !== 0 || cell.draftValue !== 0"
          :class="{ italic: cell.value === 0 && cell.draftValue }"
          class="text-sm md:text-xl"
        >
          {{ cell.value !== 0 ? cell.value : cell.draftValue }}
        </span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, useTemplateRef, watch } from "vue";
import { AnimatedAreasType, Cell, CellPosition } from "../types/types";
import gsap from "gsap";

const { board, errorPositions, initialBoard } = defineProps<{
  board: Cell[][];
  initialBoard: Cell[][];
  errorPositions: Map<string, CellPosition>;
}>();
const emit = defineEmits<{
  (event: "update-board", row: number, column: number, value: number): void;
}>();

function getBackgroundColor(row: number, column: number, cell: Cell) {
  if (cell.hint) {
    return "bg-blue-200";
  }

  if (cell.initial) {
    return "bg-gray-100";
  }

  if (errorPositions.has(`${row}${column}`)) {
    return "bg-red-200";
  }
}

function getBorderStyle(row: number, column: number) {
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

const animatedAreas = computed(() => {
  const matches: AnimatedAreasType[] = [];

  for (let i = 0; i < board.length; ++i) {
    // Check line match
    const isLineMatching = board[i].every(
      (cell, j) => cell.value === initialBoard[i][j].value
    );

    // Check column match
    const isColumnMatching = board.every(
      (row, j) => row[i].value === initialBoard[j][i].value
    );

    if (isLineMatching) {
      matches.push({ key: "line", index: i });
    }

    if (isColumnMatching) {
      matches.push({ key: "column", index: i });
    }
  }

  // Check 3x3 squares
  for (let square = 0; square < 9; square++) {
    const startRow = Math.floor(square / 3) * 3;
    const startCol = (square % 3) * 3;
    let isSquareMatching = true;

    // Compare each cell in the 3x3 square
    for (let i = 0; i < 3 && isSquareMatching; i++) {
      for (let j = 0; j < 3 && isSquareMatching; j++) {
        const row = startRow + i;
        const col = startCol + j;
        if (board[row][col].value !== initialBoard[row][col].value) {
          isSquareMatching = false;
        }
      }
    }

    if (isSquareMatching) {
      matches.push({ key: "square", index: square });
    }
  }

  return matches;
});

// watch(
//   () => animatedAreas,
//   (newValue) => {
//     cells.value.forEach((cell, index) => {
//       timeline.to(cell, {
//         backgroundColor: "#3B82F6", // Tailwind blue-500
//         color: "white",
//         duration: 0.3,
//       });
//     });
//   },
//   { deep: true }
// );

const cells = ref([]);
// onMounted(() => {
//   console.log(cells.value);

//   // Add each cell to the timeline
//   cells.value.forEach((cell, index) => {
//     timeline.to(cell, {
//       backgroundColor: "#3B82F6", // Tailwind blue-500
//       color: "white",
//       duration: 0.3,
//     });
//   });

//   // Fade out all cells
//   timeline.to(cells.value, {
//     backgroundColor: "transparent",
//     color: "black",
//     duration: 0.5,
//   });
// });

function fillCell(e: KeyboardEvent, row: number, column: number, cell: Cell) {
  if (cell.initial) {
    return;
  }

  const parsedKey = Number(e.key);

  if (!parsedKey) {
    return;
  }

  emit("update-board", row, column, parsedKey);
}
</script>
