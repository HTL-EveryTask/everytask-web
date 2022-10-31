import { ref } from "vue";
import { defineStore } from "pinia";

export const API_URL = "https://localhost:8000/api";

export const useAuthenticateStore = defineStore("authenticate", () => {
  const token = ref<string | null>(null);

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
    }
    return response;
  }

  return { isAuthenticated, register, login, token };
});
