<script lang="ts" setup>
import { computed, onMounted, ref } from "vue";
import router from "@/router";
import AddTaskPopUp from "@/components/AddTaskPopUp.vue";
import { useTaskStore } from "@/stores/task";
import SideViewContainer from "@/components/SideViewContainer.vue";
import TaskBoard from "@/components/icons/TaskBoard.vue";
import { useToastStore } from "@/stores/toast";

const taskStore = useTaskStore();
const loading = ref(false);

const orderedTasks = computed(() => {
  const taskCopy = [...taskStore.tasks];
  return taskCopy.sort((a, b) => {
    if (a.is_done && !b.is_done) {
      return 1;
    } else if (!a.is_done && b.is_done) {
      return -1;
    } else {
      return a.due_time.localeCompare(b.due_time);
    }
  });
});

onMounted(async () => {
  loading.value = true;
  try {
    await taskStore.getTasks();
  } catch {
    useToastStore().addToast({
      title: "Error",
      message: "Error while loading tasks",
      type: "error",
    });
  } finally {
    loading.value = false;
  }
});
</script>

<template>
  <div class="flex h-full relative">
    <main class="flex-1 flex flex-col relative">
      <div class="flex-1 overflow-y-auto">
        <div class="mx-4">
          <TaskBoard
            :loading="loading"
            :tasks="orderedTasks"
            title="All Tasks"
          />
        </div>
      </div>

      <div class="absolute bottom-0 left-0 right-0 px-8 sm:px-2">
        <AddTaskPopUp
          class="my-4 max-w-[52em] sm:w-full rounded-3xl text-raisin mx-auto shadow-lg shadow-yonder/10 transition-colors bg-ghost"
          expandedClass="bg-white/100"
          @expandFull="router.push({ name: 'tasks' })"
        />
      </div>
    </main>

    <SideViewContainer
      :show="$route.name === 'showTask'"
      title="Edit task"
      @close="router.push({ name: 'tasks' })"
    >
      <RouterView @close="router.push({ name: 'tasks' })" />
    </SideViewContainer>
  </div>
</template>

<!--suppress CssUnusedSymbol -->
<style scoped></style>
