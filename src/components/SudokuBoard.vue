<template>
  <div class="w-full h-full">
    <div class="grid grid-cols-9 bg-white rounded-lg shadow-md">
      <div v-for="i in 9" :key="i">
        <div
          v-for="j in 9"
          :key="j"
          class="p-4 border-r border-b border-gray-200 hover:bg-gray-200 w-16 aspect-square items-center justify-center"
          :class="getBorderStyle(i, j)"
        >
          {{ i }} {{ j }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
function getBorderStyle(i: number, j: number) {
  let dynamicClass = "";
  if (j === 1) {
    dynamicClass = `${dynamicClass} border-t-2 border-t-black`;
  }

  if (i === 9) {
    dynamicClass = `${dynamicClass} border-r-2 border-r-black`;
  }

  if (i === 1) {
    dynamicClass = `${dynamicClass} border-l-2 border-l-black`;
  }

  if (j === 9) {
    dynamicClass = `${dynamicClass} border-b-2 border-b-black`;
  }

  if (i === 3 || i === 6) {
    dynamicClass = `${dynamicClass} border-r-2 border-r-gray-400`;
  }

  if (j === 3 || j === 6) {
    dynamicClass = `${dynamicClass} border-b-2 border-b-gray-400`;
  }

  return dynamicClass;
}
</script>
