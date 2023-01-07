<script lang="ts" setup>
import type { Task } from "@/models/Task";
import { ref } from "vue";
import SubTaskCard from "@/components/SubTaskCard.vue";
import IconPlus from "@/components/icons/IconPlus.vue";
import { maxLength, required } from "@vuelidate/validators";
import useVuelidate from "@vuelidate/core";
import InputField from "@/components/InputField.vue";
import { useTaskStore } from "@/stores/task";
import IconSpinner from "@/components/icons/IconSpinner.vue";

const props = defineProps<{
  task: Task;
}>();
const emit = defineEmits<{
  (e: "update"): void;
}>();

const taskStore = useTaskStore();
const loading = ref(false);

const newSubTaskTitle = ref("");

const rules = {
  newSubTaskTitle: {
    required,
    maxLength: maxLength(32),
  },
};

const v$ = useVuelidate(rules, { newSubTaskTitle }, { $autoDirty: true });

async function addSubTask() {
  loading.value = true;
  await taskStore.addSubTask(props.task.id, newSubTaskTitle.value);
  loading.value = false;
  newSubTaskTitle.value = "";
  emit("update");
}

function beforeTaskLeave(el: any) {
  const { marginLeft, marginTop, width, height } = window.getComputedStyle(el);
  el.style.left = `${el.offsetLeft - parseFloat(marginLeft)}px`;
  el.style.top = `${el.offsetTop - parseFloat(marginTop)}px`;
  el.style.width = width;
  el.style.height = height;
}
</script>

<template>
  <div>
    <div>
      <form class="flex items-center" @submit.prevent="addSubTask">
        <InputField
          id="new-sub-task"
          v-model="newSubTaskTitle"
          class="w-full flex gap-2 items-center"
        >
          <div class="flex-1 flex items-center input-field relative gap-2">
            <input
              v-model="newSubTaskTitle"
              class="w-full pr-14"
              placeholder="Add a subtask.."
              type="text"
            />

            <span
              :class="[
                { 'opacity-0': newSubTaskTitle.length === 0 },
                { 'text-red-500': v$.newSubTaskTitle.$error },
              ]"
              class="text-raisin/50 text-sm absolute right-0 m-2 transition-opacity"
            >
              {{ newSubTaskTitle.length }}/32
            </span>
          </div>
          <button
            class="flex items-center justify-center btn-primary p-2 rounded-full"
            type="submit"
          >
            <IconPlus class="w-6 h-6" v-if="!loading" />
            <IconSpinner class="w-6 h-6" v-else />
          </button>
        </InputField>
      </form>
    </div>
    <div class="my-4 border-b-2 border-raisin/10">
      <div
        v-if="task.subtasks && task.subtasks.length > 0"
        class="flex flex-col gap-2 p-4 pt-2"
      >
        <TransitionGroup
          appear
          class="flex flex-col gap-4"
          name="list"
          tag="div"
          @before-leave="beforeTaskLeave"
        >
          <SubTaskCard
            v-for="subTask in task.subtasks"
            :key="subTask.id"
            :subTask="subTask"
            class="bg-white"
            @update="emit('update')"
          />
        </TransitionGroup>
      </div>
      <div
        v-else
        class="w-full h-full text-center min-h-[6rem] flex justify-center items-center"
      >
        <span class="text-gray-500">No Subtasks</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.list-move,
.list-enter-active,
.list-leave-active {
  transition: all 0.5s ease;
}

.list-enter-from {
  opacity: 0;
  transform: translateX(-30px);
}

.list-leave-to {
  opacity: 0;
  transform: translateX(-30px);
}

.list-leave-active {
  position: absolute;
  width: 100%;
}
</style>
