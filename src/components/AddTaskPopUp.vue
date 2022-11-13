<script lang="ts" setup>
import { maxLength, required } from "@vuelidate/validators";
import { ref } from "vue";
import useVuelidate from "@vuelidate/core";
import type { Task } from "@/models/Task";
import InputField from "@/components/InputField.vue";
import { useAuthenticateStore } from "@/stores/auth";
import router from "@/router";
import IconPlus from "@/components/icons/IconPlus.vue";
import IconSpinner from "@/components/icons/IconSpinner.vue";

const authenticateStore = useAuthenticateStore();
const loading = ref(false);

const title = ref("Test");
const description = ref("test");
const due = ref("2022-09-27 23:02:00");

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
  console.log("submit");
  const newTask: Task = {
    id: "0",
    title: title.value,
    description: description.value,
    due_time: due.value,
    is_done: false,
  };

  loading.value = true;
  await authenticateStore.createTask(newTask);
  await authenticateStore.fetchTasks();
  loading.value = false;
  await router.push({ name: "tasks" });
}
</script>

<template>
  <form class="w-full" @submit.prevent="onSubmit">
    <Transition name="expand">
      <div v-if="$route.name === 'addTask'" class="h-96 overflow-auto">
        <div class="w-full p-4">
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
              <span class="text-sm"> {{ description.length }}/300 </span>
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
        </div>
      </div>
    </Transition>
    <div class="flex items-center">
      <button
        :class="{ 'text-ghost/70': $route.name !== 'addTask' }"
        :disabled="v$.$invalid"
        class="flex items-center justify-center grow mr-4 transition-colors duration-300 hover:shadow-ghost hover:shadow-sm rounded-md p-2 border-2 border-ghost/40 disabled:opacity-50 disabled:border-transparent"
        type="submit"
      >
        <IconPlus v-if="!loading" />
        <IconSpinner v-else />
      </button>
      <input
        v-model="title"
        class="w-full border-b-2 border-ghost/70 bg-transparent p-0 placeholder-ghost/70 caret-ghost/70 focus:outline-none focus:placeholder-ghost/100 focus:border-ghost/100 transition-colors duration-300"
        placeholder="Add a task"
        type="text"
        @click="router.push({ name: 'addTask' })"
      />
      <select
        class="mx-4 bg-transparent border-ghost/70 border-b-2 p-0 caret-ghost/70 focus:outline-none focus:border-ghost/100 transition-colors duration-300"
      >
        <option value="1">Fach</option>
        <option value="2">2</option>
        <option value="3">3</option>
      </select>
    </div>
  </form>
</template>

<!--suppress CssUnusedSymbol -->
<style scoped>
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
</style>
