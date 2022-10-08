import { ref } from "vue";
import { defineStore } from "pinia";

export const useEveryTaskStore = defineStore("everytask", () => {
  const token = ref("");
  const profile = ref({});
  const tasks = ref([]);

  return { token, profile, tasks };
});
