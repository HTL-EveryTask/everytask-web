<script lang="ts" setup>
import TaskCard from "@/components/TaskCard.vue";
import { onMounted, ref } from "vue";
import router from "@/router";
import ModalContainer from "@/components/ModalContainer.vue";
import { gsap } from "gsap";
import { useAuthenticateStore } from "@/stores/auth";

const authenticateStore = useAuthenticateStore();

const showModal = ref(false);
let modalTitle = ref("");

function closeModal() {
  showModal.value = false;
  router.push({ name: "home" });
}

function openTask(id: string) {
  showModal.value = true;
  modalTitle.value = "Edit Task";
  router.push({ name: "showTask", params: { id } });
}

function openAddTaskModal() {
  showModal.value = true;
  modalTitle.value = "Add Task";
  router.push({ name: "addTask" });
}

onMounted(async () => {
  await authenticateStore.fetchTasks();

  if (router.currentRoute.value.name !== "home") {
    showModal.value = true;
    modalTitle.value =
      router.currentRoute.value.name === "addTask" ? "Add Task" : "Edit Task";
  }
});

function onEnter(el: any, done: () => void) {
  const index: number = el.dataset.index ? parseInt(el.dataset.index) : 0;
  gsap.fromTo(
    el,
    {
      opacity: 0,
      transform: "translateX(-30px)",
    },
    {
      opacity: 1,
      transform: "translateX(0px)",
      duration: 0.5,
      ease: "power2.out",
      delay: index * 0.1,
      onComplete: done,
    }
  );
  done();
}

function onLeave(el: any, done: () => void) {
  const index: number = el.dataset.index ? parseInt(el.dataset.index) : 0;

  gsap.fromTo(
    el,
    {
      opacity: 1,
      transform: "translateX(0px)",
    },
    {
      opacity: 0,
      transform: "translateX(30px)",
      duration: 0.5,
      ease: "power2.out",
      delay: index * 0.1,
      onComplete: done,
    }
  );
}
</script>

<template>
  <main class="mx-auto">
    <h1 class="text-2xl">This is the Task View</h1>
    <p>
      Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quae.
    </p>

    <button class="btn-primary" @click="openAddTaskModal">Add task</button>

    <div class="flex flex-col gap-4">
      <TransitionGroup appear name="list" tag="div">
        <TaskCard
          v-for="(task, index) in authenticateStore.tasks"
          :key="task.id"
          :data-index="index"
          :task="task"
          class="my-4"
          @click="openTask(task.id)"
        />
      </TransitionGroup>
    </div>

    <ModalContainer
      :show="showModal"
      :title="modalTitle"
      effect="shadow"
      @close="closeModal"
    >
      <RouterView @close="closeModal" />
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
