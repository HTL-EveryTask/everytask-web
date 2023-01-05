import { defineStore } from "pinia";
import { useApiStore } from "@/stores/api";

export const useConnectionStore = defineStore("connection", () => {
  const api = useApiStore();

  async function checkConnections() {
    return await api.callApi("connections", "GET");
  }

  async function authenticateTeams(code: string) {
    return await api.callApi("teams/authorize", "POST", { code: code });
  }

  return {
    checkConnections,
    authenticateTeams,
  };
});
