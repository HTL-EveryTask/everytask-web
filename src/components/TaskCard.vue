<script lang="ts" setup>
import type { Task } from "@/models/Task";
import { computed } from "vue";
import { useTaskStore } from "@/stores/task";

const taskStore = useTaskStore();

const props = defineProps<{
  task: Task;
}>();

async function toggleCompleted() {
  await taskStore.setTaskDone(props.task.id, !props.task.is_done);
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
        'w-8 h-8 rounded-full mr-4 relative border-2' +
        (task.is_done
          ? ' bg-rebecca/30 hover:bg-rebecca/50 border-yonder/50'
          : ' bg-raisin/5 hover:bg-cerulean/10 border-yonder/50')
      "
      @click.stop="toggleCompleted"
    >
      <div
        class="absolute bg-transparent w-10 h-10 rounded-full top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
      ></div>
    </div>
    <div class="flex flex-1 items-baseline gap-8">
      <span class="max-w-[50%] text-md font-bold">{{ task.title }}</span>
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
