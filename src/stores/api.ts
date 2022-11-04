import { defineStore } from "pinia";
import { computed } from "vue";

export const useApiStore = defineStore("api", () => {
  const BASE_URL = "https://localhost:8000/api";
  let TOKEN = localStorage.getItem("token");

  const hasToken = computed(() => {
    return TOKEN !== null;
  });

  function callApi(path: string, method: string, body: any) {
    return fetch(`${BASE_URL}/${path}`, {
      method: method,
      headers: {
        Authorization: TOKEN ? `Bearer ${TOKEN}` : "",
        "Content-Type": "application/json",
      },
      body: body,
    });
  }

  async function checkAuth(): Promise<boolean> {
    if (!hasToken.value) {
      return false;
    }

    const response = await fetch(`${BASE_URL}/token/${TOKEN}`);

    return response.ok;
  }

  async function login(email: string, password: string) {
    const response = await fetch(`${BASE_URL}/login`, {
      method: "POST",
      headers: {},
      body: JSON.stringify({
        email: email,
        password: password,
      }),
    }).then((response) => response.json());

    if (response.token) {
      TOKEN = response.token;
      localStorage.setItem("token", response.token);
    }
  }

  return {
    hasToken,
    callApi,
    checkAuth,
    login,
  };
});
