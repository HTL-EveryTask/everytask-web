<script lang="ts" setup>
import TaskCard from "@/components/TaskCard.vue";
import { useMockStore } from "@/stores/mock";
import { onMounted, ref } from "vue";
import router from "@/router";
import ModalContainer from "@/components/ModalContainer.vue";

const mockStore = useMockStore();

const showModal = ref(false);

function openTask(id: number) {
  showModal.value = true;
  router.push({ name: "showTask", params: { id } });
}

function closeTask() {
  showModal.value = false;
  router.push({ name: "home" });
}

onMounted(() => {
  if (router.currentRoute.value.name === "showTask") {
    showModal.value = true;
    console.log("showing modal");
  }
});
</script>

<template>
  <main>
    <h1 class="text-2xl">This is the home</h1>
    <p>
      Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quae.
    </p>

    <div class="flex flex-col gap-4">
      <div v-for="task in mockStore.tasks" :key="task">
        <TaskCard :task="task" @click="openTask(task.id)" />
      </div>
    </div>
    <ModalContainer v-if="showModal" @close="closeTask">
      <RouterView @close="closeTask" />
    </ModalContainer>
  </main>
</template>
