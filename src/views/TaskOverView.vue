<script lang="ts" setup>
import TaskCard from "@/components/TaskCard.vue";
import { onMounted, ref } from "vue";
import router from "@/router";
import { useAuthenticateStore } from "@/stores/auth";
import HomeIcon from "@/components/icons/HomeIcon.vue";
import AddTaskPopUp from "@/components/AddTaskPopUp.vue";
import ModalContainer from "@/components/ModalContainer.vue";
import { useClickOutside } from "@/composables/useClickOutside";

const authenticateStore = useAuthenticateStore();
const mockGroups = [
  {
    id: 1,
    name: "Group 1",
    tasks: [
      {
        id: 1,
        name: "Task 1",
        description: "Description 1",
        dueDate: "2021-05-01",
        completed: false,
      },
      {
        id: 2,
        name: "Task 2",
        description: "Description 2",
        dueDate: "2021-05-02",
        completed: false,
      },
      {
        id: 3,
        name: "Task 3",
        description: "Description 3",
        dueDate: "2021-05-03",
        completed: false,
      },
    ],
  },
  {
    id: 2,
    name: "Group 2",
    tasks: [
      {
        id: 4,
        name: "Task 4",
        description: "Description 4",
        dueDate: "2021-05-04",
        completed: false,
      },
      {
        id: 5,
        name: "Task 5",
        description: "Description 5",
        dueDate: "2021-05-05",
        completed: false,
      },
      {
        id: 6,
        name: "Task 6",
        description: "Description 6",
        dueDate: "2021-05-06",
        completed: false,
      },
    ],
  },
  {
    id: 3,
    name: "Group 3",
    tasks: [
      {
        id: 7,
        name: "Task 7",
        description: "Description 7",
        dueDate: "2021-05-07",
        completed: false,
      },
      {
        id: 8,
        name: "Task 8",
        description: "Description 8",
        dueDate: "2021-05-08",
        completed: false,
      },
      {
        id: 9,
        name: "Task 9",
        description: "Description 9",
        dueDate: "2021-05-09",
        completed: false,
      },
    ],
  },
];

onMounted(async () => {
  await authenticateStore.fetchTasks();
});

const addTaskPopUp = ref();
useClickOutside(addTaskPopUp, () => {
  if (router.currentRoute.value.name === "addTask") {
    router.push({ name: "tasks" });
  }
});
</script>

<template>
  <nav class="w-44 h-screen shadow-lg text-sm">
    <ul class="py-4">
      <li>
        <div class="flex gap-2 px-4 py-2">
          <HomeIcon />
          <span>All</span>
        </div>
      </li>
      <li>
        <div class="flex gap-2 px-4 py-2">
          <HomeIcon />
          <span>Today</span>
        </div>
      </li>
      <li>
        <div class="flex gap-2 px-4 py-2">
          <HomeIcon />
          <span>Private</span>
        </div>
      </li>
    </ul>

    <div class="border-t-2 border-yonder" />

    <ul class="py-4">
      <li v-for="group in mockGroups" :key="group.id">
        <div class="flex gap-2 px-4 py-2">
          <HomeIcon />
          <span>{{ group.name }}</span>
        </div>
      </li>
    </ul>
  </nav>
  <main class="flex-1 overflow-y-scroll flex flex-col relative">
    <div class="px-8 py-2 flex-1 w-full">
      <div class="flex flex-col gap-4 max-w-[48em] mx-auto">
        <TransitionGroup appear name="list" tag="div">
          <TaskCard
            v-for="(task, index) in authenticateStore.tasks"
            :key="task.id"
            :data-index="index"
            :task="task"
            class="my-4 shadow-md shadow-yonder/10"
            @click="router.push({ name: 'showTask', params: { id: task.id } })"
          />
        </TransitionGroup>
      </div>
    </div>

    <ModalContainer
      :show="$route.name === 'showTask'"
      :title="$route.meta.modalTitle"
      effect="shadow"
      @close="router.push({ name: 'tasks' })"
    >
      <RouterView @close="router.push({ name: 'tasks' })" />
    </ModalContainer>

    <!--    <div-->
    <!--      v-if="$route.name === 'addTask'"-->
    <!--      class="absolute h-full w-full left-0 top-0 backdrop-blur-sm"-->
    <!--      @click="$router.push({ name: 'tasks' })"-->
    <!--    />-->

    <div class="sticky bottom-0">
      <div class="px-8">
        <div
          ref="addTaskPopUp"
          class="add-task-glass my-4 max-w-[48em] mx-auto p-2 bg-raisin/70 rounded-lg text-ghost"
        >
          <AddTaskPopUp />
        </div>
      </div>
    </div>
  </main>
</template>

<!--suppress CssUnusedSymbol -->
<style scoped>
.list-move, /* apply transition to moving elements */
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
  transform: translateX(30px) translateY(-15px);
}

.list-leave-active {
  position: absolute;
  width: 100%;
}

.add-task-glass {
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(5px);
  -webkit-backdrop-filter: blur(9px);
}
</style>
