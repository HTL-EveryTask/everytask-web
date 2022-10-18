<script lang="ts" setup>
import TaskCard from "@/components/TaskCard.vue";
import { useMockStore } from "@/stores/mock";
import { onMounted, ref } from "vue";
import router from "@/router";
import ModalContainer from "@/components/ModalContainer.vue";
import { gsap } from "gsap";

const mockStore = useMockStore();

const showModal = ref(false);
let modalTitle = ref("");

function closeModal() {
  showModal.value = false;
  router.push({ name: "home" });
}

function openTask(id: number) {
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
});

function onEnter(el: HTMLElement, done: () => void) {
  const index: number = el.dataset.index ? parseInt(el.dataset.index) : 0;

  // entrance animation with transformX and opacity and bobbing effect
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
}

function onLeave(el: HTMLElement, done: () => void) {
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
          v-for="(task, index) in mockStore.tasks"
          :key="task.id"
          :data-index="index"
          :task="task"
          class="my-4"
          @click="openTask(task.id)"
        />
      </TransitionGroup>
    </div>

    <button class="btn-primary" @click="openAddTaskModal">Add task</button>

    <ModalContainer
      v-if="showModal"
      :title="modalTitle"
      effect="shadow"
      @close="closeModal"
    >
      <RouterView @close="closeModal" />
    </ModalContainer>
  </main>
</template>

<style scoped></style>
