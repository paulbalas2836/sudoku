<template>
  <Modal>
    <template #header>
      <h2 className="text-3xl font-bold text-gray-900">Game Paused</h2>
      <p className="text-gray-500">Take a break or start fresh</p>
    </template>

    <template #body>
      <div class="flex flex-col gap-4">
        <Button
          @click="$emit('resume-play')"
          className="w-full px-4 py-3 cursor-pointer text-white font-medium bg-emerald-500 hover:bg-emerald-600 rounded-xl transition-colors shadow-lg shadow-emerald-500/20"
        >
          <span>Resume Game</span>
        </Button>
        <Button
          @click="$emit('start-new')"
          className="w-full px-4 py-3 text-gray-700 font-medium bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors cursor-pointer"
        >
          <span>Start new game</span>
        </Button>
      </div>
    </template>
  </Modal>
</template>

<script setup lang="ts">
import Button from "../base/Button.vue";
import Modal from "../base/Modal.vue";
defineEmits<{
  (event: "start-new"): void;
  (event: "resume-play"): void;
}>();
</script>
