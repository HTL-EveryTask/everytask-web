import { defineStore } from "pinia";
import { computed } from "vue";

export const useApiStore = defineStore("api", () => {
  const BASE_URL = "https://localhost:8000/api";
  let TOKEN = localStorage.getItem("token") || null;

  const hasToken = computed(() => {
    return TOKEN !== null;
  });

  async function callApi(
    endpoint: string,
    method: string,
    body: any = null,
    authorized: boolean = true
  ) {
    if (authorized && !hasToken.value) {
      throw new Error("Not authorized");
    }

    console.log("Calling API: " + endpoint + " with method " + method);
    console.log(body);

    return await fetch(`${BASE_URL}/${endpoint}`, {
      method: method,
      headers: {
        "Content-Type": "application/json",
        Authorization: `${TOKEN}`,
      },
      body: body ? JSON.stringify(body) : null,
    });
  }

  function setToken(token: string) {
    localStorage.setItem("token", token);
    TOKEN = token;
  }

  function clearToken() {
    localStorage.removeItem("token");
    TOKEN = null;
  }

  return {
    TOKEN,
    hasToken,
    callApi,
    setToken,
    clearToken,
  };
});
