<script lang="ts" setup>
import type { Task } from "@/models/Task";
import { useMockStore } from "@/stores/mock";

const props = defineProps<{
  task: Task;
}>();

const mockStore = useMockStore();

function toggleCompleted() {
  mockStore.updateTask({
    ...props.task,
    completed: !props.task.completed,
  });

  // check if it changed in the store
  console.log(mockStore.tasks.find((t) => t.id === props.task.id));
}
</script>

<template>
  <div
    class="bg-ghost max-w-[32em] min-w-[12em] p-4 flex items-center rounded-lg shadow-md"
  >
    <div
      :class="
        'w-4 h-4 rounded-full mr-4' +
        (task.completed
          ? ' bg-green-500 hover:bg-green-600'
          : ' bg-gray-300 hover:bg-gray-400')
      "
      @click.stop="toggleCompleted"
    ></div>
    <div>
      <p class="text-sm">{{ task.title }}</p>
      <p class="text-xs text-gray-500">{{ task.due }}</p>
    </div>
  </div>
</template>

<style scoped></style>
