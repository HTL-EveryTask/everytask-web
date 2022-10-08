<script lang="ts" setup></script>

<template>
  <div
    class="absolute w-screen h-screen left-0 top-0 bg-slate-800 opacity-20 z-0"
  ></div>
  <div
    class="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 bg-white rounded-lg shadow-lg z-10"
  >
    <div class="flex justify-between items-center p-4">
      <h1 class="text-xl font-bold">Modal</h1>
      <button class="text-2xl" @click="$emit('close')">×</button>
    </div>
    <div class="p-4">
      <slot></slot>
    </div>
  </div>
</template>

<style scoped></style>
