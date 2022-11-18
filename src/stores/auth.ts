import { defineStore } from "pinia";
import { useApiStore } from "@/stores/api";
import { useUserStore } from "@/stores/user";
import router from "@/router";

export const useAuthenticateStore = defineStore("authenticate", () => {
  const api = useApiStore();
  const userStore = useUserStore();

  async function checkAuth() {
    const response = await api.callApi("token", "POST", null, false);
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
      userStore.setMe(data.user);
    }
    return response;
  }

  async function logout() {
    api.clearToken();
    await router.push({ name: "login" });
  }

  async function register(username: string, email: string, password: string) {
    return await api.callApi(
      "register_user",
      "PUT",
      {
        username: username,
        email: email,
        password: password,
        is_teacher: false,
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
