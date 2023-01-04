<script lang="ts" setup>
import type { Task } from "@/models/Task";
import { computed } from "vue";
import { useTaskStore } from "@/stores/task";
import IconCheck from "@/components/icons/IconCheck.vue";
import IconLock from "@/components/icons/IconLock.vue";
import IconSun from "@/components/icons/IconSun.vue";
import IconGroup from "@/components/icons/IconGroup.vue";
import SubjectChip from "@/components/SubjectChip.vue";

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
  <div class="min-w-[12em] p-2 flex items-center rounded-full">
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
    <div
      class="flex flex-1 sm:w-[10em] items-baseline flex-wrap gap-x-4 min-w-0"
    >
      <span
        class="w-[50%] sm:w-[100%] sm:mr-2 min-w-[12em] sm:min-w-[10em] text-md whitespace-nowrap overflow-hidden overflow-ellipsis"
        >{{ task.title }}</span
      >
      <div
        class="flex items-center box-border border-l-[1px] border-raisin/40 sm:border-none text-sm text-gray-500 whitespace-nowrap pl-2 sm:pl-0"
      >
        <span class="flex items-center"
          >{{ formatDateTimeString }}
          <span class="text-[0.8em] relative top-[-0.3em]">
            {{ dateDayEnding }}</span
          ></span
        >
      </div>
    </div>
    <div class="w-16 flex items-center justify-end">
      <SubjectChip v-if="task?.subject" :subject="task?.subject" />
    </div>
    <div class="ml-4 border-[1px] border-raisin/20 p-2 rounded-full">
      <IconLock
        v-if="task.type.find((t) => t === 'private_task')"
        class="w-4 h-4"
        @click.stop
      />
      <IconGroup v-else class="w-4 h-4" />
    </div>
    <div
      class="rounded-full hover:bg-cerulean/10 ml-4 p-1 sm:hidden"
      @click.stop
    >
      <IconSun class="w-6 h-6" />
    </div>
  </div>
</template>

<style scoped></style>
