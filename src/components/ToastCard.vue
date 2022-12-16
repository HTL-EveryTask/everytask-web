<script lang="ts" setup>
import type { Toast } from "@/models/Toast";
import { useToastStore } from "@/stores/toast";
import { onMounted } from "vue";

const toastStore = useToastStore();

const props = defineProps<{
  toast: Toast;
}>();

onMounted(() => {
  setTimeout(() => {
    toastStore.removeToast(props.toast);
  }, 5000);
});

function closeToast() {
  console.log("close");
  toastStore.removeToast(props.toast);
}
</script>

<template>
  <div
    :class="{
      'bg-white': toast.type === 'default',
      'bg-blue-50': toast.type === 'info',
      'bg-green-50': toast.type === 'success',
      'bg-yellow-50': toast.type === 'warning',
      'bg-red-50': toast.type === 'error',
      'text-blue-500': toast.type === 'info',
      'text-green-500': toast.type === 'success',
      'text-yellow-500': toast.type === 'warning',
      'text-red-500': toast.type === 'error',
    }"
    class="rounded-lg shadow-lg p-4 min-w-[16em] max-w-[32em] flex gap-x-4"
  >
    <div
      :class="{
        'bg-green-500': toast.type === 'success',
        'bg-red-500': toast.type === 'error',
        'bg-yellow-500': toast.type === 'warning',
      }"
      class="w-2"
    />
    <div class="flex-1 min-w-0">
      <header class="flex items-center justify-between min-w-0">
        <h1
          class="text-lg font-bold mr-4 overflow-ellipsis overflow-hidden whitespace-nowrap"
        >
          {{ toast.title }}
        </h1>
        <button class="text-2xl" @click="closeToast">×</button>
      </header>
      <div class="max-h-[50px] overflow-y-auto mr-8 w-full">
        <p class="text-md wrap">{{ toast.message }}</p>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
