<script lang="ts" setup>
import type { Task } from "@/models/Task";
import { computed } from "vue";
import { useTaskStore } from "@/stores/task";
import IconCheck from "@/components/icons/IconCheck.vue";

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
  <div class="min-w-[12em] p-3 flex items-center rounded-full">
    <div
      :class="
        'w-8 h-8 rounded-full mr-4 relative border-2' +
        (task.is_done
          ? ' bg-rebecca/80 hover:bg-rebecca/50 border-raisin/50'
          : ' bg-raisin/5 hover:bg-cerulean/10 border-yonder/50')
      "
      @click.stop="toggleCompleted"
    >
      <div
        class="absolute bg-transparent w-10 h-10 rounded-full top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex items-center justify-center"
      >
        <IconCheck v-if="task.is_done" class="w-6 h-6 text-white" />
      </div>
    </div>
    <div class="flex flex-1 items-baseline flex-wrap gap-x-4 min-w-0">
      <span
        class="w-[40%] min-w-[200px] text-md whitespace-nowrap overflow-hidden overflow-ellipsis"
        >{{ task.title }}</span
      >
      <div
        class="box-border border-l-2 border-raisin/40 sm:border-none flex-1 text-sm text-gray-500 whitespace-nowrap pl-2"
      >
        <span
          >{{ formatDateTimeString }}
          <span class="text-[0.8em] relative top-[-0.3em] left-[-0.3em]">
            {{ dateDayEnding }}</span
          ></span
        >
      </div>
    </div>
    <div class="p-1 px-4 rounded-full flex items-center bg-ghost">
      <span class="text-xs text-gray-500">Fach</span>
    </div>
  </div>
</template>

<style scoped></style>
