<template>
  <Modal>
    <template #header>
      <div class="flex items-center justify-center gap-3">
        <TrophyIcon class="w-8 h-8 text-yellow-500" />
        <h2
          class="text-3xl font-bold bg-gradient-to-r from-green-600 to-green-700 bg-clip-text text-transparent"
        >
          Congratulations!
        </h2>
      </div>
    </template>

    <template #body>
      <div class="relative">
        <div class="flex flex-col items-center gap-6 py-4">
          <div class="flex flex-col items-center">
            <span class="text-gray-600 text-lg">Your Score:</span>
            <span class="text-4xl font-bold text-gray-800">{{ score }}</span>
          </div>
          <input
            type="text"
            v-model="username"
            placeholder="Enter your name"
            class="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm transition duration-300"
          />
          <BaseButton
            @click="$emit('start-new')"
            variant="secondary"
            class="text-white font-medium bg-green-600 hover:bg-green-700 transition-colors w-fit"
          >
            <span>Submit score</span>
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

defineProps<{ score: number }>();
defineEmits<{
  (event: "start-new"): void;
}>();

const username = ref<string>("");
</script>
