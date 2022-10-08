<script lang="ts" setup>
import type { Task } from "@/models/Task";

defineProps<{
  task: Task;
}>();
</script>

<template>
  <div
    class="bg-gray-100 max-w-[32em] min-w-[12em] p-4 flex items-center rounded-lg"
  >
    <div
      :class="
        'w-4 h-4 rounded-full mr-4' +
        (task.completed ? ' bg-green-500' : ' bg-gray-300')
      "
    ></div>
    <div>
      <p class="text-sm">{{ task.title }}</p>
      <p class="text-xs text-gray-500">{{ task.due }}</p>
    </div>
  </div>
</template>

<style scoped></style>
