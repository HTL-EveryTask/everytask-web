import { defineStore } from "pinia";
import { computed } from "vue";
import { useToastStore } from "@/stores/toast";

export const useApiStore = defineStore("api", () => {
  const BASE_URL = "https://api.everytask.at/api";
  let TOKEN = localStorage.getItem("token") || null;

  const toastStore = useToastStore();

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

    try {
      return await fetch(`${BASE_URL}/${endpoint}`, {
        method: method,
        headers: {
          "Content-Type": "application/json",
          ...(authorized && { Authorization: `${TOKEN}` }),
        },
        body: body ? JSON.stringify(body) : null,
      });
    } catch (error: any) {
      toastStore.addToast({
        title: "Error",
        message: "Could not connect to the server",
        type: "error",
      });
      throw new Error(error);
    }
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
