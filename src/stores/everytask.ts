import { ref } from "vue";
import { defineStore } from "pinia";
import type { Task } from "@/models/Task";

export const useEveryTaskStore = defineStore("everytask", () => {
  const tasks = ref<Task[]>([]);

  async function getAllTasks() {}

  return { tasks, getAllTasks };
});
