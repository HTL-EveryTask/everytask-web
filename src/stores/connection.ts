import { defineStore } from "pinia";
import { useApiStore } from "@/stores/api";

export const useConnectionStore = defineStore("connection", () => {
  const api = useApiStore();

  async function authenticateTeams(code: string) {
    return await api.callApi("teams/authenticate", "POST", { code: code });
  }

  return {
    authenticateTeams,
  };
});
