<template>
  <Modal>
    <template #header>
      <h2 className="text-3xl font-bold text-gray-900">Game Paused</h2>
      <p className="text-gray-500">Take a break or start fresh</p>
    </template>

    <template #body>
      <div class="flex flex-col gap-4">
        <BaseButton
          @click="$emit('resume-play')"
          variant="secondary"
          class="text-white font-medium bg-emerald-500 hover:bg-emerald-600 transition-colors shadow-emerald-500/20"
        >
          <span>Resume Game</span>
        </BaseButton>
        <BaseButton
          @click="$emit('start-new')"
          variant="secondary"
          class="text-gray-700 font-medium bg-gray-100 hover:bg-gray-200 transition-colors"
        >
          <span>Start new game</span>
        </BaseButton>
      </div>
    </template>
  </Modal>
</template>

<script setup lang="ts">
import BaseButton from "../base/BaseButton.vue";
import Modal from "../base/Modal.vue";
defineEmits<{
  (event: "start-new"): void;
  (event: "resume-play"): void;
}>();
</script>
