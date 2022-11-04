<script lang="ts" setup>
import TaskCard from "@/components/TaskCard.vue";
import { onMounted } from "vue";
import router from "@/router";
import ModalContainer from "@/components/ModalContainer.vue";
import { useAuthenticateStore } from "@/stores/auth";

const authenticateStore = useAuthenticateStore();

onMounted(async () => {
  await authenticateStore.fetchTasks();
});
</script>

<template>
  <main class="mx-auto">
    <h1 class="text-2xl">This is the Task View</h1>
    <p>
      Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quae.
    </p>

    <button class="btn-primary" @click="router.push({ name: 'addTask' })">
      Add Task
    </button>

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

    <ModalContainer
      :show="$route.name === 'showTask' || $route.name === 'addTask'"
      :title="$route.meta.modalTitle"
      effect="shadow"
      @close="router.push({ name: 'home' })"
    >
      <RouterView @close="router.push({ name: 'home' })" />
    </ModalContainer>
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
