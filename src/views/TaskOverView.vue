<script lang="ts" setup>
import TaskCard from "@/components/TaskCard.vue";
import { computed, onMounted, ref } from "vue";
import router from "@/router";
import HomeIcon from "@/components/icons/HomeIcon.vue";
import AddTaskPopUp from "@/components/AddTaskPopUp.vue";
import { useTaskStore } from "@/stores/task";
import { useGroupStore } from "@/stores/group";
import IconSpinner from "@/components/icons/IconSpinner.vue";
import IconSun from "@/components/icons/IconSun.vue";
import IconDot from "@/components/icons/IconDot.vue";
import IconArrow from "@/components/icons/IconArrow.vue";

const taskStore = useTaskStore();
const groupStore = useGroupStore();

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

const loading = ref(false);
const error = ref("");

const selectedGroupId = ref();

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

const addPopUpExpanded = ref(false);

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
  <div
    class="flex bg-gradient-to-tr from-cerulean/50 to-rebecca/50 h-full relative"
  >
    <nav class="w-44 h-full shadow-lg text-sm bg-ghost sm:hidden">
      <ul class="py-4">
        <li
          :class="{
            'bg-rebecca/10 text-rebecca': selectedGroupId === 'all',
            'bg-ghost': selectedGroupId !== 'all',
          }"
          class="transition-colors duration-300 hover:bg-rebecca/5"
          @click="selectedGroupId = 'all'"
        >
          <div class="flex gap-2 px-4 py-2 items-center">
            <IconDot />
            <span>All</span>
          </div>
        </li>
        <li
          :class="{
            'bg-rebecca/10 text-rebecca': selectedGroupId === 'today',
            'bg-ghost': selectedGroupId !== 'today',
          }"
          class="transition-colors duration-300 hover:bg-rebecca/5"
          @click="selectedGroupId = 'today'"
        >
          <div class="flex gap-2 px-4 py-2 items-center">
            <IconSun />
            <span>Today</span>
          </div>
        </li>
        <li
          :class="{
            'bg-rebecca/10 text-rebecca': selectedGroupId === 'private',
            'bg-ghost': selectedGroupId !== 'private',
          }"
          class="transition-colors duration-300 hover:bg-rebecca/5"
          @click="selectedGroupId = 'private'"
        >
          <div class="flex gap-2 px-4 py-2 items-center">
            <HomeIcon />
            <span>Private</span>
          </div>
        </li>
      </ul>

      <div class="border-t-2 border-yonder" />

      <ul class="py-4">
        <li
          v-for="group in groupStore.groups"
          :key="group.id"
          :class="{
            'bg-rebecca/10 text-rebecca': selectedGroupId === group.id,
            'bg-ghost': selectedGroupId !== group.id,
          }"
          class="transition-colors duration-300 hover:bg-rebecca/5"
          @click="selectedGroupId = group.id"
        >
          <div class="flex gap-2 px-4 py-2 items-center">
            <IconDot class="flex-none" />
            <span class="overflow-ellipsis overflow-hidden">{{
              group.name
            }}</span>
          </div>
        </li>
      </ul>
    </nav>

    <main class="flex-1 flex flex-col relative">
      <div class="flex-1">
        <div
          class="mx-8 my-8 p-4 sm:m-2 sm:p-0 flex flex-col bg-white rounded-xl h-[80vh]"
        >
          <header class="text-3xl font-bold p-4 border-b-2 border-yonder/60">
            <h1>All</h1>
            <div class="text-sm flex gap-2">
              <span>{{ taskStore.tasks.length }}</span>
              <button class="text-red-500" @click="deleteAllTasks">
                Delete all
              </button>
            </div>
          </header>
          <div class="p-8 sm:p-4 overflow-y-auto w-full bg-ghost h-full">
            <Transition appear mode="out-in" name="fade">
              <div
                v-if="loading"
                class="flex justify-center items-center h-full"
              >
                <IconSpinner />
              </div>
              <div
                v-else-if="error"
                class="flex justify-center items-center h-full"
              >
                <span>{{ error }}</span>
              </div>
              <div
                v-else-if="orderedTasks.length === 0"
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
                  v-for="(task, index) in orderedTasks"
                  :key="task.id"
                  :class="{
                    'border-cerulean border-2':
                      Number(router.currentRoute.value.params.id) === task.id,
                  }"
                  :data-index="index"
                  :task="task"
                  class="bg-white shadow-md shadow-yonder/10"
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
      </div>

      <div class="absolute bottom-0 left-0 right-0 px-8 sm:px-2 z-10">
        <AddTaskPopUp
          :expanded="addPopUpExpanded"
          class="my-4 max-w-[48em] p-2 rounded-lg text-raisin mx-auto shadow-lg shadow-yonder/50 bg-ghost transition-colors"
          expandedClass="bg-white"
          @close="addPopUpExpanded = false"
          @expandFull="
            addPopUpExpanded = true;
            router.push({ name: 'tasks' });
          "
        />
      </div>
    </main>

    <!--    <div class="w-[30vw]" />-->
    <Transition name="side">
      <aside
        v-if="$route.name === 'showTask'"
        class="h-full right-0 overflow-hidden w-[30vw] min-w sm:w-screen sm:fixed bg-ghost sm:rounded-none z-[15]"
        @close="router.push({ name: 'tasks' })"
      >
        <div class="min-w-[300px]">
          <header class="flex items-center border-yonder border-b-2 p-4">
            <button
              class="text-2xl text-rebecca p-2 mr-4"
              @click="router.push({ name: 'tasks' })"
            >
              <IconArrow
                class="h-6 w-6 transform rotate-180 hover:font-bold transition-colors duration-300"
              />
            </button>
            <h1 class="text-2xl font-bold">Edit Task</h1>
          </header>
          <div class="p-8">
            <RouterView @close="router.push({ name: 'tasks' })" />
          </div>
        </div>
      </aside>
    </Transition>
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

.fade-enter-active,
.fade-leave-active {
  transition: all 0.4s ease-in-out;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
