<script lang="ts" setup>
import { maxLength, required } from "@vuelidate/validators";
import { onMounted, ref, watch } from "vue";
import useVuelidate from "@vuelidate/core";
import type { Task } from "@/models/Task";
import InputField from "@/components/InputField.vue";
import IconPlus from "@/components/icons/IconPlus.vue";
import IconSpinner from "@/components/icons/IconSpinner.vue";
import { useTaskStore } from "@/stores/task";
import IconChevron from "@/components/icons/IconChevron.vue";

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

function unExpand() {
  expanded.value = false;
  expandedFull.value = false;
  emit("close");
}

const taskStore = useTaskStore();
const loading = ref(false);

const title = ref("");
const description = ref("test");

const due = ref(new Date().toJSON().slice(0, 16));

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
    id: 0,
    title: title.value,
    description: description.value,
    due_time: due.value,
    is_done: false,
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
  <Transition name="overlay">
    <div
      v-if="expanded"
      :class="{ 'backdrop-blur-sm bg-raisin/5': expandedFull }"
      class="fixed w-screen h-screen left-0 top-0 z-10"
      @click="unExpand"
    />
  </Transition>

  <div
    :class="[$attrs.class, expandedFull ? expandedClass : '']"
    class="relative z-20"
    @click="expanded = true"
  >
    <Transition name="expand">
      <div v-if="expanded" class="h-3 text-raisin/50 flex justify-center">
        <div
          class="px-5 hover:text-raisin"
          @click="expandedFull = !expandedFull"
        >
          <IconChevron
            :class="{ 'transform rotate-180': expandedFull }"
            class="h-4 w-4"
          />
        </div>
      </div>
    </Transition>
    <form class="w-full" @submit.prevent="onSubmit">
      <Transition name="expand">
        <div v-if="expanded && expandedFull" class="h-96 overflow-auto">
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
          :class="{ 'text-raisin/70': !expanded }"
          :disabled="v$.$invalid || loading"
          class="flex items-center justify-center grow mr-4 transition-colors duration-300 hover:shadow-yonder/20 hover:shadow-lg transition-shadow rounded-md p-2 border-2 border-raisin/40 disabled:opacity-50 disabled:border-transparent"
          type="submit"
          @click.stop
        >
          <IconPlus v-if="!loading" />
          <IconSpinner v-else />
        </button>
        <input
          v-model="title"
          class="w-full border-b-2 border-raisin/50 bg-transparent placeholder-raisin/70 caret-raisin/70 focus:outline-none focus:placeholder-raisin/100 focus:border-raisin/100 transition-colors duration-300"
          placeholder="Add a task"
          type="text"
        />
        <select
          class="box-content h-6 mx-4 bg-transparent border-raisin/50 border-b-2 caret-raisin/70 focus:outline-none focus:border-raisin/100 transition-colors duration-300"
        >
          <option value="1">Fach</option>
          <option value="2">2</option>
          <option value="3">3</option>
        </select>
      </div>
    </form>
  </div>
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

.overlay-enter-active,
.overlay-leave-active {
  transition: all 0.4s ease-in-out;
}

.overlay-enter-from,
.overlay-leave-to {
  opacity: 0;
}
</style>
