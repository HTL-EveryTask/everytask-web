import { ref } from "vue";
import { defineStore } from "pinia";

export const useAuthenticateStore = defineStore("authenticate", () => {
  const API_URL = "https://localhost:8000/api";
  const token = ref<string | null>(null);

  function isAuthenticated() {
    return token.value !== null;
  }

  async function register(username: string, email: string, password: string) {
    // register with username, email, and password as url search params
    const response = await fetch(
      `${API_URL}/register_user?` +
        new URLSearchParams({
          username: username,
          email: email,
          password: password,
        })
    ).then((response) => response.json());

    // if response is successful, set token
    if (response.token) {
      token.value = response.token;
    }

    return response;
  }

  async function login(username: string, password: string) {
    const response = await fetch(`${API_URL}/login_user`, {
      method: "GET",
      headers: {
        username,
        password,
      },
    }).then((response) => response.json());

    token.value = response.token;
    return response;
  }

  return { isAuthenticated, register, login };
});
