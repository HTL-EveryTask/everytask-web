<script lang="ts" setup>
import { onMounted } from "vue";

const emit = defineEmits(["close"]);

defineProps({
  title: {
    type: String,
    default: "Modal",
  },

  effect: {
    type: String,
    default: "none",
    validator: (value: string) => {
      return ["none", "shadow"].includes(value);
    },
  },

  show: {
    type: Boolean,
    required: true,
  },
});

onMounted(() => {
  // add event listener to close modal on escape key press
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      emit("close");
    }
  });
});
</script>

<template>
  <Transition name="overlay">
    <div
      v-if="show"
      :class="{
        'overlay-shadow': effect === 'shadow',
      }"
      class="fixed w-screen h-screen left-0 top-0"
      @click="$emit('close')"
    />
  </Transition>

  <Transition appear name="modal">
    <div
      v-if="show"
      class="fixed left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-ghost rounded-lg shadow-lg z-10"
    >
      <div class="flex justify-between items-center p-4">
        <h1 class="text-xl font-bold">{{ title }}</h1>
        <button class="text-2xl" @click="$emit('close')">×</button>
      </div>
      <div class="p-4 max-h-[75vh] overflow-auto">
        <slot></slot>
      </div>
    </div>
  </Transition>
</template>

<!--suppress CssUnusedSymbol -->
<style scoped>
.overlay-shadow {
  @apply bg-slate-800 bg-opacity-20 backdrop-blur-sm;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
  @apply scale-50;
}

.modal-enter-active,
.modal-leave-active {
  transition: transform 0.4s cubic-bezier(0.25, 0.25, 0, 1.21),
    opacity 0.2s ease;
}

.overlay-enter-from,
.overlay-leave-to {
  opacity: 0;
}

.overlay-enter-active,
.overlay-leave-active {
  transition: opacity 0.2s ease;
}
</style>
