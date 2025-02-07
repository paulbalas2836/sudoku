<template>
  <div class="flex flex-col gap-4 mt-auto">
    <p class="self-start text-gray-600">Available Digits:</p>
    <div class="flex gap-4 flex-wrap">
      <div
        v-for="(remaining, index) in availableDigits"
        :key="index"
        class="p-4 border border-gray-300 bg-gray-100 w-16 aspect-square"
      >
        <p
          class="font-bold text-xl"
          :class="{ 'text-gray-300': remaining === 0 }"
        >
          {{ index + 1 }}
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { Cell } from "../types/types";

const { board } = defineProps<{ board?: Cell[][] }>();

const availableDigits = computed<number[]>(() => {
  const list = new Array(9).fill(8);
  if (!board) return list;

  board.forEach((row) =>
    row.forEach((cell) => {
      if (cell.value !== 0) list[cell.value - 1]--;
    })
  );

  return list;
});
</script>
