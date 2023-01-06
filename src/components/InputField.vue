<script lang="ts" setup>
import { computed, ref, watch } from "vue";

const props = defineProps<{
  label?: string;
  id: string;
  validation?: any;
  input?: any;
}>();

defineExpose({
  createError,
});

const createdError = ref<string | null>(null);

const error = computed(() => {
  if (!props.validation) return null;
  return props.validation.$error;
});

function createError(message: string) {
  createdError.value = message;
  console.log(createdError.value);
}

watch(
  () => [props.input, error.value],
  () => {
    createdError.value = null;
  }
);
</script>

<template>
  <div :class="{ 'input-error': error || createdError }" class="input-field">
    <label v-if="label" :for="id">{{ label }}</label>
    <slot />
    <div class="flex text-sm min-h-[1.5em]">
      <div>
        <span v-if="error || createdError" class="text-red-500 text-sm block">
          {{
            createdError ? createdError : props.validation.$errors[0].$message
          }}
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
