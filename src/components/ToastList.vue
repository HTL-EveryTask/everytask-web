<script lang="ts" setup>
import { useToastStore } from "@/stores/toast";
import ToastCard from "@/components/ToastCard.vue";

const toastStore = useToastStore();
</script>

<template>
  <TransitionGroup appear name="list" tag="div">
    <ToastCard
      v-for="toast in toastStore.toasts"
      :key="toast.id"
      :toast="toast"
      class="w-min ml-auto m-4"
    />
  </TransitionGroup>
</template>

<!--suppress CssUnusedSymbol -->
<style scoped>
.list-move,
.list-enter-active,
.list-leave-active {
  transition: all 0.5s ease-in-out;
}

.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateX(100%);
}

.list-leave-active {
  position: absolute;
}
</style>
