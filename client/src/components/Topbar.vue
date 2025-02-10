<template>
  <div
    class="w-full py-4 flex justify-between border-y border-y-gray-200 items-center sm:px-8 px-2 gap-x-2"
  >
    <p class="responsive-text font-semibold text-gray-700">
      Level: {{ selectedLevel ?? "-" }}
    </p>
    <p class="responsive-text font-semibold text-gray-700">
      Score: {{ score }}
    </p>
    <div class="flex items-center sm:gap-x-4 gap-x-2">
      <p class="responsive-text font-semibold text-gray-700">
        Time Spent: {{ formatTimer }}
      </p>
      <BaseButton
        aria-label="pause game"
        variant="ghost"
        @click="$emit('pause-game')"
        ><span> <PauseIcon></PauseIcon> </span
      ></BaseButton>
    </div>

    <BaseButton variant="ghost" @click="$emit('take-hint')">
      <span class="flex sm:gap-x-2 gap-x-1 responsive-text items-center"
        ><LightBuldIcon></LightBuldIcon> Hint ({{ remainingHints }})</span
      >
    </BaseButton>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { DifficultyName } from "../types/types";
import BaseButton from "../base/BaseButton.vue";
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

const formatTimer = computed<string>(() => {
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
