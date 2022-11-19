import { ref } from "vue";
import { defineStore } from "pinia";
import { useApiStore } from "@/stores/api";
import type { Task } from "@/models/Task";

export const useTaskStore = defineStore("task", () => {
  const api = useApiStore();

  const tasks = ref<Task[]>([]);

  async function getTasks() {
    const response = await api.callApi("tasks", "GET");
    if (response.ok) {
      tasks.value = await response.json().then((data) => data.tasks);
    }
    return response;
  }

  async function getTask(id: number) {
    const response = await api.callApi(`task/${id}`, "GET");
    if (response.ok) {
      return await response.json().then((data) => data.task);
    }
    return null;
  }

  async function createTask(task: Task) {
    const response = await api.callApi("task", "PUT", task);
    if (response.ok) {
      // tasks.value.push(await response.json().then((data) => data.task));
    }
    return response;
  }

  async function updateTask(task: Task) {
    const response = await api.callApi("task", "PATCH", task);
    if (response.ok) {
      const updatedTask = await response.json();
      const index = tasks.value.findIndex((t) => t.id === updatedTask.id);
      tasks.value[index] = updatedTask;
    }
    return response;
  }

  async function deleteTask(id: number) {
    const response = await api.callApi(`task/${id}`, "DELETE");
    if (response.ok) {
      const index = tasks.value.findIndex((t) => t.id === id);
      tasks.value.splice(index, 1);
    }
    return response;
  }

  async function setTaskDone(id: number, isDone: boolean) {
    const response = await api.callApi(`task/${id}/done`, "PATCH", {
      is_done: isDone,
    });
    console.log(response);
    if (response.ok) {
      const index = tasks.value.findIndex((t) => t.id === id);
      tasks.value[index].is_done = isDone;
    }
    return response;
  }

  return {
    tasks,
    getTasks,
    getTask,
    createTask,
    updateTask,
    deleteTask,
    setTaskDone,
  };
});
