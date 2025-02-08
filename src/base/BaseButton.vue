<template>
  <button
    type="button"
    @click="$emit('click')"
    class="responsive-text rounded-lg border sm:px-4 py-2 px-1 text-base font-medium cursor-pointer duration-200 ease-in-out focus-visible:outline-2 focus:outline-offset-2 focus:outline-indigo-400"
    :class="style"
  >
    <slot />
  </button>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { ButtonVariant } from "../types/types";

const { variant = "primary" } = defineProps<{
  variant?: ButtonVariant;
}>();
defineEmits<{ (event: "click"): void }>();

const style = computed(() => {
  if (variant === "primary") {
    return "border-gray-300 w-full hover:opacity-50 transition-opacity";
  }

  if (variant === "ghost") {
    return "border-transparent hover:opacity-50 transition-opacity";
  }

  return "w-full rounded-xl transition border-transparent";
});
</script>
