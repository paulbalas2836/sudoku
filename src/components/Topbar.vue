<template>
  <div
    class="w-full py-4 flex justify-between border-y border-y-gray-200 items-center px-8"
  >
    <p class="font-semibold text-gray-700">Level: {{ selectedLevel ?? "-" }}</p>
    <p class="font-semibold text-gray-700">Score: {{ score }}</p>
    <div class="flex items-center gap-4">
      <p class="font-semibold text-gray-700">Time Spent: {{ formatTimer }}</p>
      <Button aria-label="pause game" @click="$emit('pause-game')"
        ><span> <PauseIcon></PauseIcon> </span
      ></Button>
    </div>

    <Button class="py-2 flex gap-2" @click="$emit('take-hint')">
      <LightBuldIcon></LightBuldIcon>
      <span> Hint ({{ remainingHints }})</span>
    </Button>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { DifficultyName } from "../types/types";
import Button from "../base/Button.vue";
import PauseIcon from "../icons/PauseIcon.vue";
import LightBuldIcon from "../icons/LightBuldIcon.vue";

const { selectedLevel, timer, score, remainingHints } = defineProps<{
  selectedLevel: DifficultyName | null;
  timer: number;
  score: number;
  remainingHints: number;
}>();

defineEmits<{
  (event: "pause-game"): void;
  (event: "take-hint"): void;
}>();

const formatTimer = computed(() => {
  const minutes = Math.floor(timer / 60);
  const seconds = timer % 60;

  let formattedMinutes = `${minutes}`;
  if (minutes < 10) {
    formattedMinutes = `0${formattedMinutes}`;
  }

  let formattedSeconds = `${seconds}`;
  if (seconds < 10) {
    formattedSeconds = `0${seconds}`;
  }

  return `${formattedMinutes}:${formattedSeconds}`;
});
</script>
