<template>
  <div class="w-full h-full">
    <div class="grid grid-cols-9 bg-white rounded-lg shadow-md">
      <div v-for="(row, indexRow) in board" :key="indexRow">
        <div
          v-for="(cell, indexColumn) in row"
          :key="indexColumn"
          class="p-4 border-r border-b border-gray-200 hover:bg-gray-200 w-16 aspect-square items-center justify-center focus:border-black focus:border"
          :class="[
            getBorderStyle(indexRow + 1, indexColumn + 1),
            getBackgroundColor(indexRow, indexColumn, cell),
          ]"
          @keypress="(e) => fillCell(e, indexRow, indexColumn, cell)"
          :tabindex="cell.initial || cell.hint ? -1 : 0"
        >
          <span v-if="cell.value !== 0">
            {{ cell.value }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Cell, ErrorPositon } from "../types/types";

function getBackgroundColor(row: number, column: number, cell: Cell) {
  if (cell.hint) {
    return "bg-blue-200";
  }

  if (cell.initial) {
    return "bg-gray-100";
  }

  if (props.errorPositions.has(`${row}${column}`)) {
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

const props = defineProps<{
  board: Cell[][] | undefined;
  errorPositions: Map<string, ErrorPositon>;
}>();
const emit = defineEmits<{
  (event: "update-board", row: number, column: number, value: number): void;
}>();

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
