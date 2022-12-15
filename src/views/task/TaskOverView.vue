<script lang="ts" setup>
import { computed, onMounted, ref, watch } from "vue";
import router from "@/router";
import AddTaskPopUp from "@/components/AddTaskPopUp.vue";
import { useTaskStore } from "@/stores/task";
import SideViewContainer from "@/components/SideViewContainer.vue";
import TaskBoard from "@/components/TaskBoard.vue";
import { useToastStore } from "@/stores/toast";
import { useGroupStore } from "@/stores/group";
import IconDot from "@/components/icons/IconDot.vue";

const taskStore = useTaskStore();
const groupStore = useGroupStore();
const loading = ref(false);

const type = ref(router.currentRoute.value.params.type);
const groupId = ref();

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

const filteredGroups = computed(() => {
  return groupStore.groups.filter(
    (storeGroups) =>
      orderedTasks.value.filter((task) =>
        task.assigned_groups.find((g) => g.id === storeGroups.id)
      ).length
  );
});

onMounted(async () => {
  groupStore.getGroups();
  if (!taskStore.tasks.length) {
    loading.value = true;
  }
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

  watch(
    () => router.currentRoute.value.params.type,
    (newType) => {
      type.value = newType;
    }
  );

  watch(
    () => groupId.value,
    (newGroupId) => {
      groupId.value = newGroupId;
      // scroll into view
      const element = document.getElementById(newGroupId);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }
  );
});
</script>

<template>
  <div class="flex h-full relative">
    <nav v-if="type === 'groups'" class="bg-ghost/70 effect-glass w-[12rem]">
      <h1 class="text-md text-center mb-4 mt-6 text-raisin/80 font-medium">
        Groups
      </h1>
      <ul class="text-raisin/80">
        <li v-for="group in filteredGroups" :key="group.id">
          <div
            :class="[
              group.id === parseInt(groupId)
                ? 'bg-white/70 shadow-md shadow-yonder/10 text-rebecca'
                : 'hover:bg-rebecca/5',
            ]"
            class="flex items-center p-3 my-1 mr-4 rounded-r-full pr-6 pl-4 transition-all duration-300"
            @click="groupId = group.id"
          >
            <IconDot class="h-5 w-5 mr-1" />
            {{ group.name }}
          </div>
        </li>
      </ul>
    </nav>
    <main class="flex-1 flex flex-col relative">
      <div class="flex-1 overflow-y-auto">
        <div class="mx-4">
          <TaskBoard
            v-if="type === 'private'"
            :tasks="
              orderedTasks.filter((task) =>
                task.type.find((t) => t === 'private_task')
              )
            "
            title="Private Tasks"
          />
          <TaskBoard
            v-for="group in filteredGroups"
            v-else-if="type === 'groups'"
            :id="group.id"
            :key="group.id"
            :tasks="
              orderedTasks.filter((task) =>
                task.assigned_groups.find((g) => g.id === group.id)
              )
            "
            :title="group.name"
            class="h-auto max-h-[70vh]"
          />
          <TaskBoard
            v-else
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
