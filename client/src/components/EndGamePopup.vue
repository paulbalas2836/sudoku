<template>
  <Modal>
    <template #header>
      <div class="flex items-center justify-center gap-3">
        <TrophyIcon class="w-10 h-10 text-yellow-500" />
        <h2
          class="text-3xl font-bold bg-gradient-to-r from-green-600 to-green-700 bg-clip-text text-transparent"
        >
          Congratulations!
        </h2>
      </div>
    </template>

    <template #body>
      <div class="flex flex-col items-center p-6 gap-6 w-full">
        <div class="flex flex-col items-center">
          <span class="text-gray-600 text-lg">Your Score:</span>
          <span class="text-5xl font-bold text-gray-800">{{ score }}</span>
        </div>

        <div class="w-full">
          <input
            type="text"
            v-model="username"
            @input="validateUsername"
            placeholder="Enter your name"
            class="w-full border border-gray-300 rounded-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm transition duration-300"
          />
          <div v-show="showUserError" class="text-red-500 font-bold mt-2">
            Choose a name in order to submit the result!
          </div>
        </div>

        <div class="flex flex-col gap-3 w-full">
          <BaseButton
            @click="submitScore"
            variant="secondary"
            class="w-full text-white font-medium bg-green-600 hover:bg-green-700 py-3 rounded-md transition-colors"
            :disabled="showUserError"
          >
            Submit score
          </BaseButton>
          <BaseButton
            @click="$emit('start-new')"
            variant="secondary"
            class="w-full text-gray-700 font-medium bg-gray-100 hover:bg-gray-200 py-3 rounded-md transition-colors"
          >
            Start game without submitting
          </BaseButton>
        </div>
      </div>
    </template>
  </Modal>
</template>

<script setup lang="ts">
import Modal from "../base/Modal.vue";
import BaseButton from "../base/BaseButton.vue";
import TrophyIcon from "../icons/TrophyIcon.vue";
import { ref } from "vue";
import { DifficultyName, LeaderboardType, TopUserType } from "../types/types";

const { score, difficulty } = defineProps<{
  score: number;
  difficulty: DifficultyName | null;
}>();
const emit = defineEmits<{
  (event: "start-new"): void;
}>();

const username = ref<string>("");
const showUserError = ref<boolean>(false);

/**
 * Displays an error if the username is empty
 */
function validateUsername(): void {
  showUserError.value = username.value.trim() === "";
}

/**
 * Adds a user's score to the leaderboard stored in localStorage.
 * Updates the leaderboard for a specific difficulty level, only the top 3 scores are stored.
 *
 * @param {TopUserType} data - The new user's data.
 * @param {DifficultyName} difficulty - The difficulty level to update.
 */
function addToStorage(data: TopUserType, difficulty: DifficultyName): void {
  const prevLeaderboard = localStorage.getItem("leaderboard");
  const parsedLeaderboard: LeaderboardType[] = prevLeaderboard
    ? JSON.parse(prevLeaderboard)
    : [];

  const subList = parsedLeaderboard.find((el) => el.key === difficulty);

  if (subList) {
    subList.list.push(data);
    subList.list.sort((a, b) => b.score - a.score);
    subList.list = subList.list.slice(0, 3);

    localStorage.setItem("leaderboard", JSON.stringify(parsedLeaderboard));
  } else {
    const newSection: LeaderboardType = {
      key: difficulty,
      list: [data],
    };
    console.log(newSection);
    parsedLeaderboard.push(newSection);

    localStorage.setItem("leaderboard", JSON.stringify(parsedLeaderboard));
  }
}

/**
 * Sends a server request to the BE to store the game information
 */
async function submitScore(): Promise<void> {
  if (!difficulty) {
    return;
  }

  if (!username.value) {
    showUserError.value = true;
    return;
  }

  try {
    const data: TopUserType = {
      name: username.value,
      score,
      difficulty,
    };

    addToStorage(data, difficulty);

    const response = await fetch(
      `http://localhost:${import.meta.env.VITE_POSTGRES_PORT}/api/add-user`,
      {
        method: "Post",
        body: JSON.stringify(data),
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }
  } catch (e) {
    console.error("Error fetching leaderboard data:", e);
  } finally {
    emit("start-new");
  }
}
</script>
