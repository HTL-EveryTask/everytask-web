<script lang="ts" setup>
import { maxLength, required } from "@vuelidate/validators";
import { onMounted, ref, watch } from "vue";
import useVuelidate from "@vuelidate/core";
import type { Task } from "@/models/Task";
import InputField from "@/components/InputField.vue";
import { useTaskStore } from "@/stores/task";
import GroupUserSelector from "@/components/GroupUserSelector.vue";

defineProps<{
  expandedClass: string;
}>();

const expanded = ref(false);
const expandedFull = ref(false);

const emit = defineEmits<{
  (e: "close"): void;
  (e: "expand"): void;
  (e: "expandFull"): void;
}>();

onMounted(() => {
  watch(expanded, (value) => {
    if (value) {
      emit("expand");
    } else {
      emit("close");
    }
  });
  watch(expandedFull, (value) => {
    if (value) {
      emit("expandFull");
    }
  });
});

const taskStore = useTaskStore();
const loading = ref(false);

const title = ref("");
const description = ref("test");
const due = ref(new Date().toJSON().slice(0, 16));
const assigned = ref([]);

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
  assigned: {
    maxArrayLength: maxLength(5),
  },
};

const v$ = useVuelidate(
  rules,
  { title, description, due, assigned },
  { $autoDirty: true }
);

async function onSubmit() {
  console.log("submit");

  const assignedUsers = assigned.value
    .filter((item) => item["type"] === "user")
    .map((item) => item["id"]);

  const assignedGroups = assigned.value
    .filter((item) => item["type"] === "group")
    .map((item) => item["id"]);

  console.log(assignedUsers);
  console.log(assignedGroups);

  const newTask: Task = {
    id: 0,
    title: title.value,
    description: description.value,
    due_time: due.value,
    tags: [],
    is_done: false,
    assigned_users: assignedUsers,
    assigned_groups: assignedGroups,
    type: [],
  };

  loading.value = true;
  await taskStore.createTask(newTask);
  await taskStore.getTasks();
  loading.value = false;
  title.value = "";
  description.value = "";
  due.value = new Date().toJSON().slice(0, 16);
  emit("close");
}
</script>

<template>
  <form @submit.prevent="onSubmit">
    <div v-if="expanded && expandedFull" class="h-[36rem] overflow-auto px-4">
      <div class="w-full p-4">
        <h1 class="text-2xl mb-4">{{ title ? title : "New Task" }}</h1>
        <InputField
          id="description"
          :validation="v$.description"
          label="Description"
        >
          <textarea id="description" v-model="description" rows="3"></textarea>
          <template v-slot:right>
            <span class="text-sm"> {{ description.length }}/300 </span>
          </template>
        </InputField>

        <InputField id="due" :validation="v$.due" label="Due">
          <input id="due" v-model="due" type="datetime-local" />
        </InputField>

        <InputField id="assigned" :validation="v$.assigned" label="Assigned">
          <GroupUserSelector id="assigned" v-model="assigned" />
        </InputField>
      </div>
    </div>
  </form>
</template>

<!--suppress CssUnusedSymbol -->
<style scoped>
.quick-input {
  @apply border-b-[1px] border-raisin/50 bg-transparent placeholder-raisin/70 caret-raisin/50 focus:outline-none focus:placeholder-raisin/80 focus:border-raisin/70 transition-colors duration-300;
}

.expand-enter-active,
.expand-leave-active {
  transition: all 0.5s ease;
}

.expand-enter-from,
.expand-leave-to {
  opacity: 0;
  height: 0;
}

.expand-leave-active {
  overflow: hidden;
}

.overlay-enter-active,
.overlay-leave-active {
  transition: all 0.4s ease-in-out;
}

.overlay-enter-from,
.overlay-leave-to {
  opacity: 0;
}
</style>
