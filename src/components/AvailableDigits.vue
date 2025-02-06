<template>
  <div class="flex flex-col gap-4 mt-auto">
    <p class="self-start text-gray-600">Available Digits:</p>
    <div class="flex gap-4 flex-wrap">
      <div
        v-for="i in 9"
        :key="i"
        class="p-4 border border-b-black bg-gray-100 w-16 aspect-square"
      >
        <p class="font-bold text-xl">
          {{ i }}
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts"></script>
