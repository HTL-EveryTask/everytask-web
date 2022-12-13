<script lang="ts" setup>
import IconSpinner from "@/components/icons/IconSpinner.vue";
import TaskCard from "@/components/TaskCard.vue";
import router from "@/router";
import { useTaskStore } from "@/stores/task";
import { useGroupStore } from "@/stores/group";
import { onMounted, ref } from "vue";
import type { Task } from "@/models/Task";

const taskStore = useTaskStore();
const groupStore = useGroupStore();

defineProps<{
  tasks: Task[];
}>();

const loading = ref(false);
const error = ref("");

onMounted(async () => {
  loading.value = true;
  try {
    const response = await taskStore.getTasks();
    if (!response.ok) {
      error.value = await response.json().then((data) => data.message);
    }
    await groupStore.getGroups();
  } catch (error: any) {
    error.value = "Connection to the server could not be established";
  } finally {
    loading.value = false;
  }
  console.log(taskStore.tasks);
});

function deleteAllTasks() {
  taskStore.tasks.forEach((task) => {
    taskStore.deleteTask(task.id);
  });
}

function beforeTaskLeave(el: any) {
  const { marginLeft, marginTop, width, height } = window.getComputedStyle(el);
  el.style.left = `${el.offsetLeft - parseFloat(marginLeft)}px`;
  el.style.top = `${el.offsetTop - parseFloat(marginTop)}px`;
  el.style.width = width;
  el.style.height = height;
}
</script>

<template>
  <div class="main-board flex flex-col">
    <header class="text-3xl font-bold p-4 border-b-2 border-yonder/60">
      <h1>All</h1>
      <div class="text-sm flex gap-2">
        <span>{{ taskStore.tasks.length }}</span>
        <button class="text-red-500" @click="deleteAllTasks">Delete all</button>
      </div>
    </header>
    <div class="p-8 sm:p-4 overflow-y-auto w-full h-full">
      <Transition appear mode="out-in" name="fade">
        <div v-if="loading" class="flex justify-center items-center h-full">
          <IconSpinner />
        </div>
        <div v-else-if="error" class="flex justify-center items-center h-full">
          <span>{{ error }}</span>
        </div>
        <div
          v-else-if="tasks.length === 0"
          class="flex justify-center items-center h-full"
        >
          <span>No tasks</span>
        </div>
        <TransitionGroup
          v-else
          appear
          class="flex flex-col gap-4"
          name="list"
          tag="div"
          @before-leave="beforeTaskLeave"
        >
          <TaskCard
            v-for="(task, index) in tasks"
            :key="task.id"
            :class="[
              Number(router.currentRoute.value.params.id) === task.id
                ? 'border-cerulean/50 border-2'
                : 'border-transparent border-2',
            ]"
            :data-index="index"
            :task="task"
            class="bg-white shadow-md shadow-yonder/10 hover:bg-cerulean/5 hover:shadow-yonder/20 transition-colors duration-300"
            @click="
              Number(router.currentRoute.value.params.id) === task.id
                ? router.push({ name: 'tasks' })
                : router.replace({
                    name: 'showTask',
                    params: { id: task.id },
                  })
            "
          />
        </TransitionGroup>
      </Transition>
    </div>
  </div>
</template>

<style scoped>
.list-move,
.list-enter-active,
.list-leave-active {
  transition: all 0.5s ease;
}

.list-enter-from {
  opacity: 0;
  transform: translateX(-30px);
}

.list-leave-to {
  opacity: 0;
}

.list-leave-active {
  position: absolute;
  width: 100%;
}

.side-enter-active,
.side-leave-active {
  transition: all 0.4s ease-in-out;
}

.side-enter-from,
.side-leave-to {
  opacity: 0;
  min-width: 0;
  width: 0;
}

.side-leave-active {
  overflow: hidden;
}

.fade-enter-active,
.fade-leave-active {
  transition: all 0.4s ease-in-out;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
