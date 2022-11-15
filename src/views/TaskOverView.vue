<script lang="ts" setup>
import TaskCard from "@/components/TaskCard.vue";
import { onMounted, ref } from "vue";
import router from "@/router";
import { useAuthenticateStore } from "@/stores/auth";
import HomeIcon from "@/components/icons/HomeIcon.vue";
import AddTaskPopUp from "@/components/AddTaskPopUp.vue";
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

const addPopUpExpanded = ref(false);

// const addTaskPopUp = ref();
// useClickOutside(addTaskPopUp, () => {
//   addPopUpExpanded.value = false;
// });

function deleteAllTasks() {
  authenticateStore.tasks.forEach((task) =>
    authenticateStore.deleteTask(task.id).then(() => {
      authenticateStore.fetchTasks();
    })
  );
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
  <div
    class="flex bg-gradient-to-tr from-cerulean/50 to-rebecca/50 h-full relative"
  >
    <nav class="w-44 h-full shadow-lg text-sm bg-ghost">
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

    <main class="flex-1 flex flex-col relative">
      <div class="flex-1">
        <div class="mx-16 my-8 p-4 flex flex-col bg-white rounded-xl h-[80vh]">
          <header class="text-3xl font-bold p-4 border-b-2 border-yonder/60">
            <h1>All</h1>
            <div class="text-sm flex gap-2">
              <span>{{ authenticateStore.tasks.length }}</span>
              <button class="text-red-500" @click="deleteAllTasks">
                Delete all
              </button>
            </div>
          </header>
          <div class="p-8 overflow-y-auto w-full bg-ghost h-full">
            <TransitionGroup
              appear
              class="flex flex-col gap-4"
              name="list"
              tag="div"
              @before-leave="beforeTaskLeave"
            >
              <TaskCard
                v-for="(task, index) in authenticateStore.tasks"
                :key="task.id"
                :class="{
                  'border-cerulean border-2':
                    router.currentRoute.value.params.id === task.id,
                }"
                :data-index="index"
                :task="task"
                class="bg-white shadow-md shadow-yonder/10"
                @click="
                  router.currentRoute.value.params.id === task.id
                    ? router.push({ name: 'tasks' })
                    : router.replace({
                        name: 'showTask',
                        params: { id: task.id },
                      })
                "
              />
            </TransitionGroup>
          </div>
        </div>
      </div>

      <!--    <ModalContainer-->
      <!--      :show="$route.name === 'showTask'"-->
      <!--      :title="$route.meta.modalTitle"-->
      <!--      effect="shadow"-->
      <!--      @close="router.push({ name: 'tasks' })"-->
      <!--    >-->
      <!--      <RouterView @close="router.push({ name: 'tasks' })" />-->
      <!--    </ModalContainer>-->

      <!--    <div-->
      <!--      v-if="$route.name === 'addTask'"-->
      <!--      class="absolute h-full w-full left-0 top-0 backdrop-blur-sm"-->
      <!--      @click="$router.push({ name: 'tasks' })"-->
      <!--    />-->

      <Transition name="overlay">
        <div
          v-if="addPopUpExpanded"
          class="fixed w-screen h-screen left-0 top-0 backdrop-blur-sm bg-raisin/5 z-20"
          @click="addPopUpExpanded = false"
        />
      </Transition>

      <div class="absolute bottom-0 left-0 right-0 px-8">
        <div
          ref="addTaskPopUp"
          class="my-4 max-w-[48em] p-2 rounded-lg text-raisin mx-auto bg-white shadow-lg shadow-yonder/50 z-30 relative"
          @click="
            addPopUpExpanded = true;
            router.push({ name: 'tasks' });
          "
        >
          <AddTaskPopUp
            :expanded="addPopUpExpanded"
            @close="addPopUpExpanded = false"
          />
        </div>
      </div>
    </main>

    <!--    <div class="w-[30vw]" />-->
    <aside class="h-full right-0 overflow-hidden">
      <Transition name="side">
        <div
          v-if="$route.name === 'showTask'"
          class="w-[30vw] h-full effect-glass bg-ghost/70 rounded-l-xl"
          @close="router.push({ name: 'tasks' })"
        >
          <div class="p-8">
            <RouterView @close="router.push({ name: 'tasks' })" />
          </div>
        </div>
      </Transition>
    </aside>
  </div>
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
  width: 0;
}

.side-leave-active {
  overflow: hidden;
}

.effect-glass {
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(5px);
  -webkit-backdrop-filter: blur(5px);
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
