<script lang="ts" setup>
defineEmits(["close"]);

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
});
</script>

<template>
  <div
    class="absolute w-screen h-screen left-0 top-0"
    :class="{
      'overlay-shadow': effect === 'shadow',
    }"
    @click="$emit('close')"
  />
  <div
    class="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 bg-white rounded-lg shadow-lg z-10"
  >
    <div class="flex justify-between items-center p-4">
      <h1 class="text-xl font-bold">{{ title }}</h1>
      <button class="text-2xl" @click="$emit('close')">×</button>
    </div>
    <div class="p-4">
      <slot></slot>
    </div>
  </div>
</template>

<style scoped>
.overlay-shadow {
  @apply bg-slate-800 opacity-20;
}
</style>
