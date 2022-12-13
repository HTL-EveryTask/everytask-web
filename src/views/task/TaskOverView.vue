<script lang="ts" setup>
import { computed } from "vue";
import router from "@/router";
import AddTaskPopUp from "@/components/AddTaskPopUp.vue";
import { useTaskStore } from "@/stores/task";
import SideViewContainer from "@/components/SideViewContainer.vue";
import TaskBoard from "@/components/icons/TaskBoard.vue";

const taskStore = useTaskStore();

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
</script>

<template>
  <div
    class="flex bg-gradient-to-tr from-cerulean/30 to-rebecca/30 h-full relative"
  >
    <main class="flex-1 flex flex-col relative">
      <div class="flex-1 overflow-y-auto">
        <div class="mx-4">
          <TaskBoard title="All" :tasks="orderedTasks" />
        </div>
      </div>

      <div class="absolute bottom-0 left-0 right-0 px-8 sm:px-2 z-10">
        <AddTaskPopUp
          class="my-4 max-w-[52em] sm:w-full rounded-3xl text-raisin mx-auto shadow-lg shadow-yonder/50 transition-colors bg-ghost"
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
