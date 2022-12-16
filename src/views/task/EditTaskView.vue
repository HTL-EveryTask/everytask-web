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
import GroupUserSelector from "@/components/GroupUserSelector.vue";

const emit = defineEmits(["close"]);
const props = defineProps<{
  id?: number;
}>();

const taskStore = useTaskStore();

const task = ref<Task | undefined>();

const title = ref("");
const description = ref("");
const due = ref("");
const assigned = ref<any[]>([]);

onMounted(async () => {
  watch(
    () => props.id,
    async (id) => {
      if (id) {
        loading.value = true;
        task.value = await taskStore.getTask(id);

        if (!task.value) {
          emit("close");
          return;
        }

        title.value = task.value?.title || "";
        description.value = task.value?.description || "";
        due.value = task.value?.due_time || "";

        const assignedUsers = task.value?.assigned_users?.map((user) => ({
          ...user,
          type: "user",
        }));

        const assignedGroups = task.value?.assigned_groups?.map((group) => ({
          ...group,
          type: "group",
        }));

        assigned.value = [...assignedUsers, ...assignedGroups];

        console.log(assigned.value);

        loading.value = false;
      } else {
        emit("close");
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
  const assignedUsers = assigned.value
    .filter((item) => item["type"] === "user")
    .map((item) => item["id"]);

  const assignedGroups = assigned.value
    .filter((item) => item["type"] === "group")
    .map((item) => item["id"]);

  const newTask: Task = {
    id: task.value?.id ?? 0,
    title: title.value,
    description: description.value,
    due_time: due.value,
    is_done: task.value?.is_done ?? false,
    assigned_users: assignedUsers,
    assigned_groups: assignedGroups,
    type: [],
  };

  loading.value = true;
  if (task.value) {
    await taskStore.updateTask(newTask);
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
    <div v-if="!loading" class="relative h-full">
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

        <InputField id="assigned" label="Assigned">
          <GroupUserSelector id="assigned" v-model="assigned" />
        </InputField>

        <LoadingButton
          :disabled="v$.$invalid"
          :loading="loading"
          class="btn-primary mt-4"
          type="submit"
        >
          Update
        </LoadingButton>
      </form>

      <button v-if="task" class="btn-red" @click="showDeleteModal = true">
        Delete Task
      </button>

      <ModalContainer
        :show="showDeleteModal"
        class="bg-ghost"
        headless
        relative
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
    <div v-else class="h-full flex items-center justify-center">
      <IconSpinner class="w-16 h-16 text-raisin/50" />
    </div>
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
