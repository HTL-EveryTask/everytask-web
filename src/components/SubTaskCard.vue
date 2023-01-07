<script lang="ts" setup>
import { ref } from "vue";
import { useTaskStore } from "@/stores/task";
import IconCheck from "@/components/icons/IconCheck.vue";
import type { SubTask } from "@/models/SubTask";
import IconTrash from "@/components/icons/IconTrash.vue";
import IconSpinner from "@/components/icons/IconSpinner.vue";

const taskStore = useTaskStore();

const props = defineProps<{
  subTask: SubTask;
}>();

const titleInput = ref();

const title = ref(props.subTask.title);
const isDone = ref(props.subTask.is_done);

const loading = ref(false);

const emit = defineEmits<{
  (e: "update"): void;
}>();

async function toggleCompleted() {
  loading.value = true;
  isDone.value = !isDone.value;
  await taskStore.editSubTask(props.subTask.id, title.value, isDone.value);
  loading.value = false;
  emit("update");
}

async function editSubTask() {
  loading.value = true;
  await taskStore.editSubTask(props.subTask.id, title.value, isDone.value);
  loading.value = false;
  emit("update");
}

async function deleteSubTask() {
  loading.value = true;
  await taskStore.deleteSubTask(props.subTask.id);
  loading.value = false;
  emit("update");
}
</script>

<template>
  <div
    class="min-w-[12em] p-2 flex items-center rounded-full box-border border-yonder/40 border-[1px]"
  >
    <div
      :class="
        'w-6 h-6 rounded-full mr-4 relative border-[1px]' +
        (subTask.is_done
          ? ' bg-rebecca/80 hover:bg-rebecca/50 border-raisin/50'
          : ' bg-raisin/5 hover:bg-cerulean/10 border-yonder/50')
      "
      @click.stop="toggleCompleted"
    >
      <div
        class="absolute bg-transparent w-10 h-10 rounded-full top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex items-center justify-center"
      >
        <IconCheck v-if="subTask.is_done" class="w-4 h-4 text-white" />
      </div>
    </div>
    <div
      class="flex flex-1 sm:w-[10em] items-baseline flex-wrap gap-x-4 min-w-0"
    >
      <input
        v-model="title"
        ref="titleInput"
        class="bg-transparent w-[50%] sm:w-[100%] sm:mr-2 min-w-[12em] sm:min-w-[10em] text-md whitespace-nowrap overflow-hidden overflow-ellipsis"
        @keydown.enter="editSubTask"
        @keydown.esc="
          title = subTask.title;
          titleInput.blur();
        "
      />
    </div>
    <div
      class="ml-auto rounded-full hover:bg-yonder/10 p-1 active:bg-yonder/20 text-raisin/50 hover:text-red-500 duration-200 cursor-pointer"
      @click.stop="deleteSubTask"
    >
      <IconTrash v-if="!loading" class="w-5 h-5" />
      <IconSpinner v-else class="w-5 h-5" />
    </div>
  </div>
</template>

<style scoped></style>
