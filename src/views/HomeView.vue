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

onMounted(() => {
  if (router.currentRoute.value.name !== "home") {
    showModal.value = true;
    // set the modal title based on the route name
    modalTitle.value =
      router.currentRoute.value.name === "addTask" ? "Add Task" : "Edit Task";
  }

  authenticateStore.fetchTasks();
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
    <h1 class="text-2xl">This is the home</h1>
    <p>
      Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quae.
    </p>
    <div class="flex flex-col gap-4">
      <TransitionGroup
        :css="false"
        appear
        tag="div"
        @enter="onEnter"
        @leave="onLeave"
      >
        <TaskCard
          v-for="(task, index) in authenticateStore.tasks"
          :key="task.pk_task_id"
          :data-index="index"
          :task="task"
          class="my-4"
          @click="openTask(task.pk_task_id)"
        />
      </TransitionGroup>
    </div>

    <button class="btn-primary" @click="openAddTaskModal">Add task</button>

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

<style scoped></style>
