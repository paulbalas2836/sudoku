<template>
  <Modal>
    <template #header>
      <h2 class="text-xl font-semibold text-gray-800">Choose your level</h2>
    </template>
    <template #body>
      <div class="space-y-3">
        <BaseButton
          v-for="level in difficultyLevels"
          :key="level.name"
          @click="selectLevel(level.name)"
          variant="secondary"
          class="group hover:scale-[1.02] transition-transform"
        >
          <div
            class="flex items-center p-4 rounded-xl transition-colors"
            :class="level.classes"
          >
            <component
              :is="level.icon"
              class="w-6 h-6 mr-3"
              :class="level.iconClass"
            />
            <span
              class="flex-grow text-left font-medium"
              :class="level.textClass"
            >
              {{ level.name }}
            </span>
            <span
              class="opacity-0 group-hover:opacity-100 transition-opacity"
              :class="level.arrowClass"
            >
              →
            </span>
          </div>
        </BaseButton>
      </div>
    </template>
  </Modal>
</template>

<script setup lang="ts">
import BabyIcon from "../icons/BabyIcon.vue";
import BrainIcon from "../icons/BrainIcon.vue";
import FlameIcon from "../icons/FlameIcon.vue";
import StartIcon from "../icons/StartIcon.vue";
import { DifficultyLevel, DifficultyName } from "../types/types";
import Modal from "../base/Modal.vue";
import BaseButton from "../base/BaseButton.vue";

const emit = defineEmits<{
  (event: "select", difficulty: DifficultyName): void;
}>();

const difficultyLevels: DifficultyLevel[] = [
  {
    name: "Beginner",
    classes: "bg-emerald-50 border-2 border-emerald-200 hover:bg-emerald-100",
    icon: BabyIcon,
    iconClass: "text-emerald-600",
    textClass: "text-emerald-700",
    arrowClass: "text-emerald-600",
  },
  {
    name: "Intermediate",
    classes: "bg-amber-50 border-2 border-amber-200 hover:bg-amber-100",
    icon: BrainIcon,
    iconClass: "text-amber-600",
    textClass: "text-amber-700",
    arrowClass: "text-amber-600",
  },
  {
    name: "Hard",
    classes: "bg-rose-50 border-2 border-rose-200 hover:bg-rose-100",
    icon: FlameIcon,
    iconClass: "text-rose-600",
    textClass: "text-rose-700",
    arrowClass: "text-rose-600",
  },
  {
    name: "Expert",
    classes: "bg-purple-50 border-2 border-purple-200 hover:bg-purple-100",
    icon: StartIcon,
    iconClass: "text-purple-600",
    textClass: "text-purple-700",
    arrowClass: "text-purple-600",
  },
] as const;

function selectLevel(level: DifficultyName) {
  emit("select", level);
}
</script>
