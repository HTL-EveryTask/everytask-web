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
      tasks.value = await response.json().then((data) => data.tasks ?? []);
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
    const response = await api.callApi(`task/${task.id}`, "PATCH", task);
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
    const index = tasks.value.findIndex((t) => t.id === id);
    tasks.value[index].is_done = isDone;
    return await api.callApi(`task/${id}/done`, "PATCH", {
      is_done: isDone,
    });
  }

  async function addSubTask(id: number, title: string) {
    const response = await api.callApi(`subtask/${id}`, "PUT", {
      title: title,
    });
    if (response.ok) {
      const index = tasks.value.findIndex((t) => t.id === id);
      const task = tasks.value[index];
      const subTask = await response.json().then((data) => data.subtask);

      if (task.subtasks) {
        task.subtasks.push(subTask);
      } else {
        task.subtasks = [subTask];
      }
    }
    return response;
  }

  async function deleteSubTask(subTaskId: number) {
    const response = await api.callApi(`subtask/${subTaskId}`, "DELETE");
    if (response.ok) {
      // find the task that contains the subtask with the given id
      const task = tasks.value.find((t) =>
        t.subtasks?.some((st) => st.id === subTaskId)
      );
      if (task) {
        const index = task.subtasks?.findIndex((st) => st.id === subTaskId);
        task.subtasks?.splice(index!, 1);
      }
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
    addSubTask,
    deleteSubTask,
  };
});
