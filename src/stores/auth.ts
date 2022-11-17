import { defineStore } from "pinia";
import { useApiStore } from "@/stores/api";

export const useAuthenticateStore = defineStore("authenticate", () => {
  const api = useApiStore();

  async function checkAuth() {
    const response = await api.callApi("token", "GET", {}, false);
    return response.ok;
  }

  async function login(email: string, password: string) {
    const response = await api.callApi(
      "login_user",
      "POST",
      {
        email: email,
        password: password,
      },
      false
    );
    if (response.ok) {
      const data = await response.json();
      api.setToken(data.token);
      localStorage.setItem("token", data.token);
    }
    return response;
  }

  async function logout() {
    api.clearToken();
  }

  async function register(username: string, email: string, password: string) {
    return await api.callApi(
      "register_user",
      "POST",
      {
        username: username,
        email: email,
        password: password,
      },
      false
    );
  }

  return {
    checkAuth,
    register,
    login,
    logout,
  };
});
