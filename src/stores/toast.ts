import { ref } from "vue";
import { defineStore } from "pinia";
import type { Toast } from "@/models/Toast";

export const useToastStore = defineStore("toast", () => {
  const toasts = ref<Toast[]>([]);

  function addToast(toast: Toast) {
    if (
      toasts.value.find(
        (t) => t.message === toast.message && t.title === toast.title
      )
    ) {
      return;
    }
    if (!toast.type) {
      toast.type = "default";
    }

    toast.id = Math.random().toString(16).slice(2);
    toasts.value.push(toast);
  }

  function removeToast(toast: Toast) {
    const index = toasts.value.findIndex((t) => t.id === toast.id);
    toasts.value.splice(index, 1);
  }

  return {
    toasts,
    addToast,
    removeToast,
  };
});
