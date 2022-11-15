<script lang="ts" setup>
import { maxLength, required } from "@vuelidate/validators";
import { ref } from "vue";
import useVuelidate from "@vuelidate/core";
import ModalContainer from "@/components/ModalContainer.vue";
import type { Task } from "@/models/Task";
import InputField from "@/components/InputField.vue";
import { useAuthenticateStore } from "@/stores/auth";
import router from "@/router";
import LoadingButton from "@/components/LoadingButton.vue";

const emit = defineEmits(["close"]);
const props = defineProps<{
  id?: string;
}>();

const authenticateStore = useAuthenticateStore();

const task = ref<Task | undefined>(
  props.id ? authenticateStore.tasks.find((t) => t.id === props.id) : undefined
);

// TODO: make reload work
if (!task.value) {
  router.push({ name: "tasks" });
}

const title = ref(task.value?.title ?? "Test");
const description = ref(task.value?.description ?? "test");
const due = ref(task.value?.due_time ?? "2022-09-27 23:02:00");

const loading = ref(false);
const loadingDelete = ref(false);

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

  loading.value = true;
  if (task.value) {
    await authenticateStore.updateTask(newTask);
  } else {
    await authenticateStore.createTask(newTask);
  }
  loading.value = false;
  await authenticateStore.fetchTasks();

  emit("close");
}

async function deleteTask() {
  loadingDelete.value = true;
  await authenticateStore.deleteTask(task.value?.id ?? "");
  await authenticateStore.fetchTasks();
  loadingDelete.value = false;
  showDeleteModal.value = false;
  emit("close");
}
</script>

<template>
  <div>
    <form class="w-full" @submit.prevent="onSubmit">
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

      <LoadingButton
        :disabled="v$.$invalid"
        :loading="loading"
        class="btn-primary mt-4"
        type="submit"
      >
        {{ task ? "Update" : "Add" }}
      </LoadingButton>
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
          <LoadingButton
            :loading="loadingDelete"
            class="btn-red"
            @click="deleteTask"
            >Delete
          </LoadingButton>
          <button class="btn-primary" @click="showDeleteModal = false">
            Cancel
          </button>
        </div>
      </div>
    </ModalContainer>
  </div>
</template>
<style scoped></style>
