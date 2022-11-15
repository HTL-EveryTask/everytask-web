<script lang="ts" setup>
import type { Task } from "@/models/Task";
import { computed } from "vue";

const props = defineProps<{
  task: Task;
}>();

function toggleCompleted() {
  // TODO: toggle completed
}

const formatDateTimeString = computed(() => {
  const dateObj = new Date(props.task.due_time);
  const monthShort = dateObj.toLocaleString("default", { month: "short" });
  const day = dateObj.getDate();

  return `Due ${monthShort} ${day}`;
});

const dateDayEnding = computed(() => {
  const dateObj = new Date(props.task.due_time);
  const day = dateObj.getDate();
  return day % 10 === 1
    ? "st"
    : day % 10 === 2
    ? "nd"
    : day % 10 === 3
    ? "rd"
    : "th";
});
</script>

<template>
  <div class="min-w-[12em] p-4 flex items-center rounded-xl">
    <div
      :class="
        'w-4 h-4 rounded-full mr-4' +
        (task.is_done
          ? ' bg-green-500 hover:bg-green-600'
          : ' bg-gray-300 hover:bg-gray-400')
      "
      @click.stop="toggleCompleted"
    ></div>
    <div class="flex flex-1 items-baseline">
      <span class="w-1/4 text-md font-bold">{{ task.title }}</span>
      <span class="flex-1 text-xs text-gray-500"
        >{{ formatDateTimeString }}
        <span class="text-[0.8em] relative top-[-0.2em] left-[-0.2em]">
          {{ dateDayEnding }}</span
        ></span
      >
      <div class="p-1 px-4 rounded-full flex items-center bg-ghost">
        <span class="text-xs text-gray-500">Fach</span>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
