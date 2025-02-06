<template>
  <div class="justify-center items-center flex flex-col gap-8">
    <Topbar
      :selectedLevel="selectedLevel"
      :timer="timer"
      @pause-game="pauseGame"
    ></Topbar>
    <div class="flex gap-8">
      <SudokuBoard></SudokuBoard>
      <Leaderboard></Leaderboard>
    </div>
    <AvailableDigits></AvailableDigits>
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
import { ref, watch } from "vue";
import AvailableDigits from "./components/AvailableDigits.vue";
import SudokuBoard from "./components/SudokuBoard.vue";
import Topbar from "./components/Topbar.vue";
import StartGameModal from "./components/StartGameModal.vue";
import { DifficultyName } from "./types/types";
import PauseGameModal from "./components/PauseGameModal.vue";
import Leaderboard from "./components/Leaderboard.vue";

const ONE_HOUR_IN_SECONDS = 3600;
const gamePaused = ref(false);
const timer = ref(0);

const intervalReference = ref<ReturnType<typeof setInterval> | undefined>();
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

  clearInterval(intervalReference.value);
}

function resumeGame() {
  gamePaused.value = false;

  start();
}

const showModal = ref(true);
const selectedLevel = ref<DifficultyName | null>(null);

function closeModal() {
  showModal.value = false;
}

function SelectLevel(level: DifficultyName) {
  selectedLevel.value = level;

  timer.value = 0;
  start();
  closeModal();
}

function startNewGame() {
  showModal.value = true;

  //reset all
  gamePaused.value = false;
  timer.value = 0;
}
</script>
