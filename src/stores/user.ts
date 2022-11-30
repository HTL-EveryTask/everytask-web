import { defineStore } from "pinia";
import { useApiStore } from "@/stores/api";
import type { User } from "@/models/User";
import { ref } from "vue";

export const useUserStore = defineStore("user", () => {
  const api = useApiStore();

  const ME = ref<User | null>(null);

  async function getMe() {
    const response = await api.callApi("user", "GET");
    if (response.ok) {
      ME.value = await response.json().then((data) => data.user);
    }
    return response;
  }

  async function setMe(user: User) {
    ME.value = user;
  }

  async function changeUsername(username: string) {
    const response = await api.callApi("user", "PATCH", {
      username,
    });
    if (response.ok) {
      ME.value = await response.json().then((data) => data.user);
    }
    return response;
  }

  async function changePassword(oldPassword: string, newPassword: string) {
    return await api.callApi("password", "PATCH", {
      oldPassword,
      newPassword,
    });
  }

  return {
    ME,
    getMe,
    setMe,
    changeUsername,
    changePassword,
  };
});
