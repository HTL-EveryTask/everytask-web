<script lang="ts" setup>
import { computed } from "vue";

const props = defineProps<{
  label: string;
  id: string;
  validation?: any;
}>();

const error = computed(() => {
  if (!props.validation) return null;
  return props.validation.$error;
});
</script>

<template>
  <div :class="{ 'input-error': error }">
    <label :for="id">{{ label }}</label>
    <slot />
    <div class="flex text-sm text-gray-500 min-h-[1.5em]">
      <div>
        <span v-if="error" class="text-red-500 text-sm block">
          {{ validation.$errors[0].$message }}
        </span>
        <slot v-else name="left" />
      </div>
      <div class="ml-auto">
        <slot name="right" />
      </div>
    </div>
  </div>
</template>

<style scoped></style>
