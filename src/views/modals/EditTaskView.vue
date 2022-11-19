<script lang="ts" setup>
import { maxLength, required } from "@vuelidate/validators";
import { onMounted, ref, watch } from "vue";
import useVuelidate from "@vuelidate/core";
import ModalContainer from "@/components/ModalContainer.vue";
import type { Task } from "@/models/Task";
import InputField from "@/components/InputField.vue";
import LoadingButton from "@/components/LoadingButton.vue";
import { useTaskStore } from "@/stores/task";
import IconSpinner from "@/components/icons/IconSpinner.vue";

const emit = defineEmits(["close"]);
const props = defineProps<{
  id?: number;
}>();

const taskStore = useTaskStore();

const task = ref<Task | undefined>();

const title = ref("");
const description = ref("");
const due = ref("");

onMounted(async () => {
  watch(
    () => props.id,
    async (id) => {
      if (id) {
        loading.value = true;
        task.value = await taskStore.getTask(id);
        title.value = task.value?.title || "";
        description.value = task.value?.description || "";

        // TODO: fix this
        const dueString = task.value?.due_time.date;
        console.log(dueString);
        due.value = dueString.substring(0, dueString.length - 3);
        loading.value = false;
      }
    },
    { immediate: true }
  );
});

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
    id: task.value?.id ?? 0,
    title: title.value,
    description: description.value,
    due_time: due.value,
    is_done: false,
  };

  loading.value = true;
  if (task.value) {
    await taskStore.updateTask(newTask);
  } else {
    await taskStore.createTask(newTask);
  }
  loading.value = false;
  await taskStore.getTasks();

  emit("close");
}

async function deleteTask() {
  loadingDelete.value = true;
  if (task.value) {
    await taskStore.deleteTask(task.value.id);
    await taskStore.getTasks;
  }
  loadingDelete.value = false;
  showDeleteModal.value = false;
  emit("close");
}
</script>

<template>
  <Transition name="fade">
    <div v-if="!loading">
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
        class="bg-ghost"
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
    <IconSpinner
      v-else
      class="w-16 h-16 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-raisin/50"
    />
  </Transition>
</template>

<!--suppress CssUnusedSymbol -->
<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s;
}

.fade-enter,
.fade-leave-to {
  opacity: 0;
}
</style>
