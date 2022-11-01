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

  async function authenticate() {
    if (!token.value) {
      return false;
    }

    const response = await fetch(`${API_URL}/token/${token.value}`);

    if (response.status !== 200) {
      token.value = null;
      return false;
    }
    return true;
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

    console.log(response);
    return response;
  }

  async function logout() {
    token.value = null;
    localStorage.removeItem("token");
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
    } else {
      tasks.value = [];
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
          pk_task_id: Task.id,
          title: Task.title,
          description: Task.description,
          due_time: Task.due_time,
        }),
      {
        method: "POST",
      }
    ).then((response) => response.json());
  }

  async function deleteTask(id: string) {
    if (!token.value) {
      return [];
    }

    return await fetch(
      `${API_URL}/task/remove/${id}?` +
        new URLSearchParams({
          token: token.value,
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
    logout,
    authenticate,
    token,
    fetchTasks,
    createTask,
    updateTask,
    deleteTask,
    tasks,
  };
});
