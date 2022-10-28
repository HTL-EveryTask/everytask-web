<script lang="ts" setup>
import { maxLength, required } from "@vuelidate/validators";
import { ref } from "vue";
import useVuelidate from "@vuelidate/core";
import { useMockStore } from "@/stores/mock";
import ModalContainer from "@/components/ModalContainer.vue";
import type { Task } from "@/models/Task";

const emit = defineEmits(["close"]);
const props = defineProps<{
  taskId?: number;
}>();

const mockStore = useMockStore();
const task = ref(mockStore.tasks.find((t) => t.id === props.taskId));

const title = ref(task.value?.title ?? "");
const description = ref(task.value?.description ?? "");
const due = ref(task.value?.due ?? "");

let showDeleteModal = ref(false);

const rules = {
  title: {
    required,
    maxLength: maxLength(32),
    $autoDirty: true,
  },
  description: {
    maxLength: maxLength(300),
    $autoDirty: true,
  },
  due: {
    required,
    $autoDirty: true,
  },
};

const v$ = useVuelidate(rules, { title, description, due });

function onSubmit() {
  const newTask: Task = {
    id: task.value?.id ?? mockStore.tasks.length + 1,
    title: title.value,
    description: description.value,
    due: due.value,
    completed: false,
  };

  if (task.value) {
    mockStore.updateTask(newTask);
  } else {
    mockStore.addTask(newTask);
  }

  emit("close");
}

function deleteTask() {
  if (task.value) {
    mockStore.deleteTask(task.value.id);
    console.log(mockStore.tasks);
  }
  showDeleteModal.value = false;
  emit("close");
}
</script>

<template>
  <div>
    <form class="w-96" @submit.prevent="onSubmit">
      <div>
        <label for="title">Title</label>
        <input id="title" v-model="title" type="text" />
        <span class="input-error" v-if="v$.title.$error">{{
          v$.title.$errors[0].$message
        }}</span>
      </div>

      <div>
        <label for="description">Description</label>
        <textarea id="description" v-model="description" />
        <span v-if="v$.description.$error" class="input-error">{{
          v$.description.$errors[0].$message
        }}</span>
      </div>

      <div>
        <label for="due">Due</label>
        <input id="due" v-model="due" type="datetime-local" />
        <span v-if="v$.due.$error" class="input-error">{{
          v$.due.$errors[0].$message
        }}</span>
      </div>

      <button class="btn-primary mt-4" type="submit" :disabled="v$.$invalid">
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
