import { ref } from "vue";
import { defineStore } from "pinia";
import type { Task } from "@/models/Task";

export const API_URL = "https://localhost:8000/api";

export const useAuthenticateStore = defineStore("authenticate", () => {
  const token = ref<string | null>(null);

  const tasks = ref<Task[]>([]);

  function isAuthenticated() {
    return token.value !== null;
  }

  async function register(username: string, email: string, password: string) {
    const response = await fetch(
      `${API_URL}/register_user?` +
        new URLSearchParams({
          username: username,
          email: email,
          password: password,
        })
    ).then((response) => response.json());

    if (response.token) {
      token.value = response.token;
    }

    return response;
  }

  async function login(email: string, password: string) {
    const response = await fetch(
      `${API_URL}/login_user?` +
        new URLSearchParams({
          email: email,
          password: password,
        })
    ).then((response) => response.json());

    if (response.token) {
      token.value = response.token;
      localStorage.setItem("token", response.token);
    }
    return response;
  }

  async function fetchTasks() {
    if (!token.value) {
      return [];
    }

    const response = await fetch(
      `${API_URL}/task/get?` +
        new URLSearchParams({
          token: token.value,
        }),
      {
        method: "POST",
      }
    ).then((response) => response.json());

    if (response.data) {
      tasks.value = response.data as Task[];
    }
  }

  async function createTask(Task: Task) {
    if (!token.value) {
      return [];
    }

    return await fetch(
      `${API_URL}/task/add?` +
        new URLSearchParams({
          token: token.value,
          title: Task.title,
          description: Task.description,
          due_time: Task.due_time,
          note: Task.note,
        }),
      {
        method: "POST",
      }
    ).then((response) => response.json());
  }

  async function updateTask(Task: Task) {
    if (!token.value) {
      return [];
    }

    return await fetch(
      `${API_URL}/task/update?` +
        new URLSearchParams({
          token: token.value,
          pk_task_id: Task.pk_task_id,
          title: Task.title,
          description: Task.description,
          due_time: Task.due_time,
          note: Task.note,
        }),
      {
        method: "POST",
      }
    ).then((response) => response.json());
  }

  async function deleteTask(pk_task_id: string) {
    if (!token.value) {
      return [];
    }

    return await fetch(
      `${API_URL}/task/remove?` +
        new URLSearchParams({
          token: token.value,
          task_id: pk_task_id,
        }),
      {
        method: "POST",
      }
    ).then((response) => response.json());
  }

  return {
    isAuthenticated,
    register,
    login,
    token,
    fetchTasks,
    createTask,
    updateTask,
    deleteTask,
    tasks,
  };
});
