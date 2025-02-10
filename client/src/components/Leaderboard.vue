<template>
  <div class="flex flex-col gap-4 bg-gray-100 p-4 rounded-lg shadow-md">
    <div class="flex gap-2 flex-col items-center">
      <div class="flex">
        <TrophyIcon></TrophyIcon>
        <p class="underline responsive-text">Leaderboard:</p>
      </div>

      <div v-if="leaderboard.length">
        <div
          v-for="sections in leaderboard"
          :key="sections.key"
          class="flex flex-col"
        >
          <h3
            class="text-xs sm:text-sm md:text-base font-semibold text-gray-700 mb-2"
          >
            {{ sections.key }}:
          </h3>
          <div
            v-for="(top, index) in sections.list"
            :key="`${top.name}_${top.score}_${index}`"
            class="text-xs sm:text-sm md:text-base"
          >
            <span>{{ index + 1 }}. </span>
            <span>{{ top.name }} - </span>
            <span>{{ top.score }}</span>
          </div>
        </div>
      </div>
      <div v-else>No data.</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import TrophyIcon from "../icons/TrophyIcon.vue";
import { LeaderboardType } from "../types/types";

defineProps<{ leaderboard: LeaderboardType[] }>();
</script>
