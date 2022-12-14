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
import GroupUserSelector from "@/components/GroupUserSelector.vue";
import CustomDatePicker from "@/components/CustomDatePicker.vue";

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
const assigned = ref([]);

const date = ref("2022-11-11");

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
      class="fixed w-screen h-screen left-0 top-0 z-20"
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
          class="px-5 pt-2 hover:text-raisin"
          @click="expandedFull = !expandedFull"
        >
          <IconChevron
            :class="{ 'transform rotate-180': expandedFull }"
            class="h-4 w-4"
          />
        </div>
      </div>
    </Transition>
    <form @submit.prevent="onSubmit">
      <Transition name="expand">
        <div
          v-if="expanded && expandedFull"
          class="h-[36rem] overflow-auto px-4"
        >
          <div class="w-full p-4">
            <h1 class="text-2xl mb-4">{{ title ? title : "New Task" }}</h1>
            <InputField
              id="description"
              :validation="v$.description"
              label="Description"
            >
              <textarea
                id="description"
                v-model="description"
                rows="3"
              ></textarea>
              <template v-slot:right>
                <span class="text-sm"> {{ description.length }}/300 </span>
              </template>
            </InputField>

            <InputField id="due" :validation="v$.due" label="Due">
              <input id="due" v-model="due" type="datetime-local" />
            </InputField>

            <InputField
              id="assigned"
              :validation="v$.assigned"
              label="Assigned"
            >
              <GroupUserSelector id="assigned" v-model="assigned" />
            </InputField>
          </div>
        </div>
      </Transition>
      <div class="flex items-center rounded-full p-2 gap-4">
        <button
          :disabled="v$.$invalid || loading"
          class="flex items-center justify-center p-2 rounded-full disabled:opacity-50 text-yonder disabled:text-raisin border-2 border-yonder/50 disabled:border-transparent transition-all duration-200"
          type="submit"
          @click.stop
        >
          <IconPlus v-if="!loading" />
          <IconSpinner v-else />
        </button>
        <div class="flex-1 flex items-center relative max-w-[24em]">
          <input
            v-model="title"
            class="w-full quick-input"
            placeholder="Add a task"
            type="text"
          />
          <span
            :class="[
              { 'opacity-0': title.length === 0 },
              { 'text-red-500': v$.title.$error },
            ]"
            class="text-raisin/50 text-sm absolute right-0 m-2 transition-opacity"
          >
            {{ title.length }}/32
          </span>
        </div>

        <div>
          <CustomDatePicker class="bottom-14" v-model="date">
            <input class="quick-input" type="date" v-model="date" readonly />
          </CustomDatePicker>
        </div>

        <select class="mx-4 ml-auto quick-input">
          <option disabled selected value="1">Subject</option>
          <option value="2">2</option>
          <option value="3">3</option>
        </select>
      </div>
    </form>
  </div>
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
