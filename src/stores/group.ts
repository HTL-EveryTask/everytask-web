import { ref } from "vue";
import { defineStore } from "pinia";
import { useApiStore } from "@/stores/api";
import type { Group } from "@/models/Group";

export const useGroupStore = defineStore("group", () => {
  const api = useApiStore();

  const groups = ref<Group[]>([]);

  async function getGroups() {
    const response = await api.callApi("groups", "GET");
    if (response.ok) {
      groups.value = await response.json().then((data) => data.groups);
      console.log(groups.value);
    }
    return response;
  }

  async function getGroup(id: number) {
    const response = await api.callApi(`group/${id}`, "GET");
    if (response.ok) {
      return await response.json().then((data) => data.group);
    }
    return null;
  }

  async function createGroup(name: string, description: string) {
    const response = await api.callApi("group", "PUT", {
      name: name,
      description: description,
    });
    if (response.ok) {
      groups.value.push(await response.json().then((data) => data.group));
      console.log(response);
    }
    return response;
  }

  return {
    groups,
    getGroups,
    getGroup,
    createGroup,
  };
});
