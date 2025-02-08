<template>
  <div class="flex flex-col gap-4 mt-auto">
    <p class="self-start text-gray-600 font-medium">Available Digits:</p>
    <div class="flex gap-3 flex-wrap justify-between">
      <div
        v-for="(remaining, index) in availableDigits"
        :key="index"
        class="w-10 md:w-16 sm:w-14 aspect-square rounded-lg bg-white border border-gray-300 transition duration-200 flex items-center justify-center"
        :class="{ 'opacity-50 cursor-default': remaining === 0 }"
      >
        <span
          class="font-bold text-xl"
          :class="{
            'text-gray-400': remaining === 0,
            'text-gray-800': remaining > 0,
          }"
        >
          {{ index + 1 }}
        </span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, watch } from "vue";
import { Cell } from "../types/types";

const { board, initialBoard } = defineProps<{
  board: Cell[][];
  initialBoard: Cell[][];
}>();
const emit = defineEmits<{
  (event: "end-game"): void;
}>();

const availableDigits = computed<number[]>(() => {
  const list = new Array(9).fill(9);
  if (!board) return list;

  board.forEach((row, rowIndex) =>
    row.forEach((cell, columnIndex) => {
      if (
        cell.value !== 0 &&
        initialBoard[rowIndex][columnIndex].value === cell.value
      )
        list[cell.value - 1]--;
    })
  );

  return list;
});

watch(
  () => availableDigits,
  () => {
    if (availableDigits.value.every((el) => el === 0)) {
      emit("end-game");
    }
  },
  { deep: true }
);
</script>
