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

  headless: {
    type: Boolean,
    default: false,
  },

  mobileFull: {
    type: Boolean,
    default: false,
  },

  relative: {
    type: Boolean,
    default: false,
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
  <div>
    <Transition name="overlay">
      <div
        v-if="show"
        :class="{
          'overlay-shadow': effect === 'shadow',
        }"
        class="fixed w-screen h-screen left-0 top-0 z-40"
        @click="$emit('close')"
      />
    </Transition>
    <Transition appear name="modal">
      <div
        v-if="show"
        :class="[
          $attrs.class,
          mobileFull ? 'sm:h-screen sm:w-screen' : '',
          relative ? 'absolute' : 'fixed',
        ]"
        class="left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded-xl shadow-lg shadow-yonder/10 z-50"
      >
        <div
          v-if="!headless"
          class="flex justify-between items-center p-4 px-6"
        >
          <h1 class="text-xl font-bold">{{ title }}</h1>
          <button class="text-2xl" @click="$emit('close')">×</button>
        </div>
        <div class="p-4 pt-0 max-h-[75vh] overflow-auto">
          <slot></slot>
        </div>
      </div>
    </Transition>
  </div>
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
