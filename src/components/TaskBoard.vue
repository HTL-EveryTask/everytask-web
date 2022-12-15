<script lang="ts" setup>
import IconSpinner from "@/components/icons/IconSpinner.vue";
import TaskCard from "@/components/TaskCard.vue";
import router from "@/router";
import { computed, ref } from "vue";
import type { Task } from "@/models/Task";
import IconSearch from "@/components/icons/IconSearch.vue";

const props = defineProps<{
  tasks: Task[];
  title: string;
  loading?: boolean;
}>();

const error = ref("");
const query = ref("");

const filteredTasks = computed(() => {
  return props.tasks.filter((task) => {
    return (
      task.title.toLowerCase().includes(query.value.toLowerCase()) ||
      task.description.toLowerCase().includes(query.value.toLowerCase())
    );
  });
});

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
    <header class="text-3xl p-8 border-b-2 border-yonder/60 flex items-center">
      <h1 class="font-semibold">{{ title }}</h1>
      <div
        class="h-10 rounded-full flex bg-white items-center p-4 mx-8 border-[1px] border-yonder/20"
      >
        <input
          type="text"
          class="text-sm"
          placeholder="Search..."
          v-model="query"
        />
        <div class="ml-auto">
          <IconSearch class="h-4 w-4" />
        </div>
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
            v-for="(task, index) in filteredTasks"
            :key="task.id"
            :class="[
              Number(router.currentRoute.value.params.id) === task.id
                ? 'border-cerulean/50 border-2'
                : 'border-transparent border-2',
            ]"
            :data-index="index"
            :task="task"
            class="bg-white shadow-md shadow-yonder/10 hover:bg-blue-50 hover:shadow-yonder/20 transition-all duration-300"
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
