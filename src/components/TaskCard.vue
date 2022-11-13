<script lang="ts" setup>
import type { Task } from "@/models/Task";

const props = defineProps<{
  task: Task;
}>();

function toggleCompleted() {
  // TODO: toggle completed
}
</script>

<template>
  <div class="bg-ghost min-w-[12em] p-4 flex items-center rounded-lg">
    <div
      :class="
        'w-4 h-4 rounded-full mr-4' +
        (task.is_done
          ? ' bg-green-500 hover:bg-green-600'
          : ' bg-gray-300 hover:bg-gray-400')
      "
      @click.stop="toggleCompleted"
    ></div>
    <div>
      <p class="text-sm">{{ task.title }}</p>
      <p class="text-xs text-gray-500">{{ task.due_time }}</p>
    </div>
  </div>
</template>

<style scoped></style>
