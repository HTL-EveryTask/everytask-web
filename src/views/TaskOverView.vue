<script lang="ts" setup>
import TaskCard from "@/components/TaskCard.vue";
import { onMounted } from "vue";
import router from "@/router";
import ModalContainer from "@/components/ModalContainer.vue";
import { useAuthenticateStore } from "@/stores/auth";
import HomeIcon from "@/components/icons/HomeIcon.vue";
import IconTooling from "@/components/icons/IconTooling.vue";

5;

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
</script>

<template class="flex flex-col h-full">
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
  <main class="flex-1 overflow-scroll">
    <div class="px-8 py-2">
      <div class="flex flex-col gap-4">
        <TransitionGroup appear name="list" tag="div">
          <TaskCard
            v-for="(task, index) in authenticateStore.tasks"
            :key="task.id"
            :data-index="index"
            :task="task"
            class="my-4"
            @click="router.push({ name: 'showTask', params: { id: task.id } })"
          />
        </TransitionGroup>
      </div>
    </div>

    <ModalContainer
      :show="$route.name === 'showTask' || $route.name === 'addTask'"
      :title="$route.meta.modalTitle"
      effect="shadow"
      @close="router.push({ name: 'tasks' })"
    >
      <RouterView @close="router.push({ name: 'tasks' })" />
    </ModalContainer>

    <div class="bg-blue-100 w-full sticky bottom-0 p-2">
      <div class="flex mx-24 p-2 rounded-xl items-center">
        <div class="p-2 m-2 rounded-full bg-blue-200">
          <IconTooling class="w-6 h-6" />
        </div>
        <input
          class="w-full bg-transparent focus:outline-none"
          placeholder="Add a task"
          type="text"
          @click="router.push({ name: 'addTask' })"
        />
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
</style>
