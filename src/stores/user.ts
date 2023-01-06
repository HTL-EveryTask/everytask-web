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

  async function getAllProfilePictures() {
    const response = await api.callApi("user/pictures", "GET");
    if (response.ok) {
      return await response.json().then((data) => data.pictures);
    }
    return [];
  }

  async function changeProfilePicture(dataUrl: string) {
    const base64 = dataUrl.split(",")[1];
    const response = await api.callApi(`user/picture`, "PATCH", {
      picture: base64,
    });
    if (response.ok && ME.value) {
      ME.value = await response.json().then((data) => data.user);
      console.log(ME.value);
    }
    return response;
  }

  return {
    ME,
    getMe,
    setMe,
    changeUsername,
    getAllProfilePictures,
    changeProfilePicture,
  };
});
