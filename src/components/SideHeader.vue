<script lang="ts" setup>
import IconArrow from "@/components/icons/IconArrow.vue";

const emit = defineEmits(["close"]);

defineProps<{
  title: string;
}>();
</script>

<template>
  <header class="flex items-center p-4 shadow-md shadow-yonder/10">
    <button class="text-2xl text-rebecca p-2 mr-4" @click="emit('close')">
      <IconArrow
        class="h-6 w-6 transform rotate-180 hover:font-bold transition-colors duration-300"
      />
    </button>
    <h1 class="text-2xl font-bold">{{ title }}</h1>
    <div class="ml-auto">
      <slot name="right" />
    </div>
  </header>
</template>

<style scoped></style>
