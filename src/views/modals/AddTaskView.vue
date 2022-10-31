<script lang="ts" setup>
import { maxLength, required } from "@vuelidate/validators";
import { ref } from "vue";
import useVuelidate from "@vuelidate/core";
import { useMockStore } from "@/stores/mock";
import ModalContainer from "@/components/ModalContainer.vue";
import type { Task } from "@/models/Task";
import InputField from "@/components/InputField.vue";
import { useAuthenticateStore } from "@/stores/auth";

const emit = defineEmits(["close"]);
const props = defineProps<{
  taskId?: string;
}>();

const mockStore = useMockStore();
const authenticateStore = useAuthenticateStore();

console.log(authenticateStore.tasks, props.taskId);

const task = ref<Task | undefined>(
  props.taskId
    ? authenticateStore.tasks.find((t) => t.pk_task_id === props.taskId)
    : undefined
);

console.log(task.value);

const title = ref(task.value?.title ?? "");
const description = ref(task.value?.description ?? "");
const due = ref(task.value?.due_time ?? "");

let showDeleteModal = ref(false);

const rules = {
  title: {
    required,
    maxLength: maxLength(32),
  },
  description: {
    maxLength: maxLength(300),
  },
  due: {
    required,
  },
};

const v$ = useVuelidate(
  rules,
  { title, description, due },
  { $autoDirty: true }
);

function onSubmit() {
  const newTask: Task = {
    title: title.value,
    description: description.value,
    due_time: due.value,
    is_done: false,
    note: "hello",
  };

  if (task.value) {
    mockStore.updateTask(newTask);
  } else {
    authenticateStore.createTask(newTask);
    authenticateStore.fetchTasks();
  }

  emit("close");
}

function deleteTask() {
  // if (task.value) {
  //   mockStore.deleteTask(task.value.id);
  // }
  showDeleteModal.value = false;
  emit("close");
}
</script>

<template>
  <div>
    <form class="w-96" @submit.prevent="onSubmit">
      <InputField id="title" :validation="v$.title" label="Title">
        <input id="title" v-model="title" class="w-full" type="text" />
        <template v-slot:right>
          <span class="text-gray-500 text-sm"> {{ title.length }}/32 </span>
        </template>
      </InputField>

      <InputField
        id="description"
        :validation="v$.description"
        label="Description"
      >
        <textarea
          id="description"
          v-model="description"
          class="w-full"
          rows="3"
        ></textarea>
        <template v-slot:right>
          <span class="text-gray-500 text-sm">
            {{ description.length }}/300
          </span>
        </template>
      </InputField>

      <InputField id="due" :validation="v$.due" label="Due">
        <input id="due" v-model="due" class="w-full" type="datetime-local" />
      </InputField>

      <button :disabled="v$.$invalid" class="btn-primary mt-4" type="submit">
        {{ task ? "Update" : "Add" }}
      </button>
    </form>

    <button v-if="task" class="btn-red" @click="showDeleteModal = true">
      Delete Task
    </button>

    <ModalContainer :show="showDeleteModal" @close="showDeleteModal = false">
      <div>
        <button class="btn-red" @click="deleteTask">Delete</button>
        <button class="btn-primary" @click="showDeleteModal = false">
          Cancel
        </button>
      </div>
    </ModalContainer>
  </div>
</template>
<style scoped></style>
