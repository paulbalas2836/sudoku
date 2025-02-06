<template>
  <button
    type="button"
    @click="$emit('click')"
    class="rounded-lg border border-transparent px-4 py-2 text-base font-medium cursor-pointer transition-opacity duration-200 ease-in-out hover:opacity-50 focus-visible:outline-2 focus:outline-offset-2 focus:outline-indigo-400"
  >
    <slot />
  </button>
</template>

<script setup lang="ts">
defineEmits<{ (event: "click"): void }>();
</script>
