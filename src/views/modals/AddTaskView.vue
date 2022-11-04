<script lang="ts" setup>
import { maxLength, required } from "@vuelidate/validators";
import { ref } from "vue";
import useVuelidate from "@vuelidate/core";
import ModalContainer from "@/components/ModalContainer.vue";
import type { Task } from "@/models/Task";
import InputField from "@/components/InputField.vue";
import { useAuthenticateStore } from "@/stores/auth";
import router from "@/router";

const emit = defineEmits(["close"]);
const props = defineProps<{
  id?: string;
}>();

const authenticateStore = useAuthenticateStore();

const task = ref<Task | undefined>(
  props.id ? authenticateStore.tasks.find((t) => t.id === props.id) : undefined
);

if (!task.value) {
  router.push({ name: "addTask" });
}

const title = ref(task.value?.title ?? "Test");
const description = ref(task.value?.description ?? "test");
const due = ref(task.value?.due_time ?? "2022-09-27 23:02:00");

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

async function onSubmit() {
  const newTask: Task = {
    id: task.value?.id ?? "0",
    title: title.value,
    description: description.value,
    due_time: due.value,
    is_done: false,
  };

  if (task.value) {
    await authenticateStore.updateTask(newTask);
  } else {
    await authenticateStore.createTask(newTask);
  }
  await authenticateStore.fetchTasks();

  emit("close");
}

async function deleteTask() {
  await authenticateStore.deleteTask(task.value?.id ?? "");
  await authenticateStore.fetchTasks();

  showDeleteModal.value = false;
  emit("close");
}
</script>

<template>
  <div>
    <form class="sm:w-96 w-full" @submit.prevent="onSubmit">
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

    <ModalContainer
      :show="showDeleteModal"
      headless
      @close="showDeleteModal = false"
    >
      <div class="flex flex-col items-center">
        <p class="whitespace-nowrap text-center my-2 font-bold px-4">
          Are you sure you want to delete this task?
        </p>
        <div class="flex w-full gap-4 justify-center">
          <button class="btn-red" @click="deleteTask">Delete</button>
          <button class="btn-primary" @click="showDeleteModal = false">
            Cancel
          </button>
        </div>
      </div>
    </ModalContainer>
  </div>
</template>
<style scoped></style>
