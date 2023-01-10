<script lang="ts" setup>
import { helpers, maxLength, required } from "@vuelidate/validators";
import { computed, onMounted, ref, watch } from "vue";
import useVuelidate from "@vuelidate/core";
import ModalContainer from "@/components/ModalContainer.vue";
import type { Task } from "@/models/Task";
import InputField from "@/components/InputField.vue";
import LoadingButton from "@/components/LoadingButton.vue";
import { useTaskStore } from "@/stores/task";
import IconSpinner from "@/components/icons/IconSpinner.vue";
import GroupUserSelector from "@/components/GroupUserSelector.vue";
import SideHeader from "@/components/SideHeader.vue";
import IconSettings from "@/components/icons/IconSettings.vue";
import TagInput from "@/components/TagInput.vue";
import NoteCard from "@/components/NoteCard.vue";
import type { Subject } from "@/models/Subject";
import CustomDropDown from "@/components/SubjectSelector.vue";
import { useUntisStore } from "@/stores/untis";
import SubTaskView from "@/views/task/SubTaskView.vue";
import type { Tag } from "@/models/Tag";
import { useUserStore } from "@/stores/user";

const emit = defineEmits(["close"]);
const props = defineProps<{
  id: number;
}>();

const taskStore = useTaskStore();
const userStore = useUserStore();

const task = ref<Task | undefined>();
const subjects = ref<Subject[]>([]);

const title = ref("");
const description = ref("");
const due = ref("");
const assigned = ref<any[]>([]);
const tags = ref<string[]>([]);
const subject = ref<Subject>();

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

        // tags can either be a string[] or Tag[]
        const fetchedTags = task.value?.tags;
        if (fetchedTags) {
          if (typeof fetchedTags[0] === "string") {
            tags.value = fetchedTags as string[];
          } else {
            tags.value = (fetchedTags as Tag[]).map((tag) => tag.name);
          }
        }

        const assignedUsers = task.value?.assigned_users?.map((user) => ({
          ...user,
          type: "user",
        }));

        const assignedGroups = task.value?.assigned_groups?.map((group) => ({
          ...group,
          type: "group",
        }));

        assigned.value = [...assignedUsers, ...assignedGroups];

        subject.value = task.value?.subject;

        loading.value = false;
      } else {
        emit("close");
      }
    },
    { immediate: true }
  );

  await useUntisStore().getSubjects();
  subjects.value = useUntisStore().subjects;
});

const loading = ref(false);
const loadingDelete = ref(false);

let showDeleteModal = ref(false);

const maxTitleLength = computed(() => {
  return task.value?.origin === "teams" ? 100 : 32;
});

const rules = {
  title: {
    required,
    maxLength: maxLength(maxTitleLength),
  },
  description: {
    maxLength: maxLength(300),
  },
  due: {
    required,
  },
  tags: {
    maxLength: helpers.withMessage(
      "Only a maximum of 5 tags are allowed",
      (value: string[]) => value.length <= 5
    ),
    maxIndividualLength: helpers.withMessage(
      "Only a maximum of 32 characters are allowed",
      (value: string[]) => value.every((tag) => tag.length <= 32)
    ),
  },
};

const v$ = useVuelidate(
  rules,
  { title, description, due, tags },
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
    tags: tags.value,
    subject: subject.value,
    origin: "",
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

async function updateTask() {
  task.value = await taskStore.getTask(props.id);
}
</script>

<template>
  <div class="flex flex-col h-full">
    <SideHeader title="Edit Task" @close="emit('close')">
      <template v-slot:right>
        <IconSettings class="w-6 h-6" />
      </template>
    </SideHeader>
    <div class="flex-1 overflow-y-auto">
      <Transition mode="out-in" name="fade">
        <div v-if="!loading && task" class="relative h-full px-8 py-6">
          <form class="w-full" @submit.prevent="onSubmit">
            <InputField id="title" :validation="v$.title" label="Title">
              <input id="title" v-model="title" class="w-full" type="text" />
              <template v-slot:right>
                <span class="text-gray-500 text-sm">
                  {{ title.length }}/{{ maxTitleLength }}
                </span>
              </template>
            </InputField>

            <section class="my-4">
              <InputField id="tags" :validation="v$.tags" label="Tags">
                <TagInput v-model="tags" :max-chars="20" />
              </InputField>

              <InputField id="subject" label="Subject">
                <CustomDropDown
                  v-model="subject"
                  :subjects="subjects"
                  class="w-[7rem] my-2 input-field"
                  placeholder="Choose"
                />
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
                <input
                  id="due"
                  v-model="due"
                  class="w-full"
                  type="datetime-local"
                />
              </InputField>

              <InputField id="assigned" label="Assigned">
                <GroupUserSelector id="assigned" v-model="assigned" />
              </InputField>

              <LoadingButton
                :disabled="v$.$invalid"
                :loading="loading"
                class="btn-primary"
                type="submit"
              >
                Update
              </LoadingButton>
            </section>
          </form>

          <section class="my-4">
            <div>
              <h2 class="text-lg font-medium">Subtasks</h2>
            </div>
            <SubTaskView :task="task" @update="updateTask" />
          </section>

          <section class="my-4">
            <div class="flex gap-2 items-center mb-2">
              <h2 class="text-lg font-semibold">Notes</h2>
            </div>
            <div
              class="bg-yonder/10 rounded-lg p-4 mb-6 shadow-yonder/10 shadow-inner overflow-y-auto"
            >
              <NoteCard
                v-if="
                  task?.note &&
                  !task?.note.find((note) => note.user.id === userStore.ME?.id)
                "
                :task-id="task?.id"
                @update="updateTask"
              />
              <div
                v-if="task?.note && task?.note.length > 0"
                class="flex flex-col gap-2"
              >
                <NoteCard
                  v-for="note in task?.note"
                  :key="note.id"
                  :note="note"
                  :task-id="task?.id"
                  @update="updateTask"
                />
              </div>
              <div v-else>
                <p
                  class="mt-8 mb-6 text-gray-500 text-sm flex justify-center items-center"
                >
                  No notes have been added yet.
                </p>
              </div>
            </div>
          </section>

          <button
            v-if="task"
            class="btn-red"
            type="button"
            @click="showDeleteModal = true"
          >
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
                <button
                  class="btn-primary"
                  type="button"
                  @click="showDeleteModal = false"
                >
                  Cancel
                </button>
              </div>
            </div>
          </ModalContainer>
        </div>
        <div v-else class="h-full flex gap-4 items-center justify-center mt-16">
          <span class="text-gray-500">Loading...</span>
          <IconSpinner class="w-6 h-6 text-raisin/50" />
        </div>
      </Transition>
    </div>
  </div>
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
