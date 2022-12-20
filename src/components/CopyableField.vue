<script lang="ts" setup>
import { computed } from "vue";
import IconCopy from "@/components/icons/IconCopy.vue";
import { useToastStore } from "@/stores/toast";

const props = defineProps(["modelValue", "message"]);

const emit = defineEmits(["update:modelValue"]);

const value = computed<any>({
  get() {
    return props.modelValue;
  },
  set(value) {
    emit("update:modelValue", value);
  },
});

function copyValue() {
  navigator.clipboard.writeText(value.value);
  useToastStore().addToast({
    title: props.message || "Copied value to clipboard",
    type: "info",
    message: "",
  });
}
</script>

<template>
  <div class="flex items-center w-full my-4">
    <slot />
    <button
      :disabled="!value"
      class="ml-2 p-2 rounded-xl hover:bg-gray-200"
      title="Copy"
      type="button"
      @click="copyValue"
    >
      <IconCopy class="w-5 h-5" />
    </button>
  </div>
</template>

<style scoped></style>
