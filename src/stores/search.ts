import { defineStore } from "pinia";
import { useApiStore } from "@/stores/api";

export const useSearchStore = defineStore("search", () => {
  const api = useApiStore();

  async function getAllUsers() {
    const response = await api.callApi("search/groupMembers/Me", "GET");
    if (response.ok) {
      return await response.json().then((data) => data.users);
    }
    return [];
  }

  return {
    getAllUsers,
  };
});
