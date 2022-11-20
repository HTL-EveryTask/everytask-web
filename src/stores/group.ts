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
    return await api.callApi("group", "PUT", {
      name: name,
      description: description,
    });
  }

  async function updateGroup(group: Group) {
    const response = await api.callApi("group", "PATCH", group);
    if (response.ok) {
      const updatedGroup = await response.json();
      const index = groups.value.findIndex((g) => g.id === updatedGroup.id);
      groups.value[index] = updatedGroup;
    }
    return response;
  }

  async function deleteGroup(id: number) {
    const response = await api.callApi(`group/${id}`, "DELETE");
    if (response.ok) {
      const index = groups.value.findIndex((g) => g.id === id);
      groups.value.splice(index, 1);
    }
    return response;
  }

  async function leaveGroup(id: number) {
    const response = await api.callApi(`group/${id}/leave`, "POST");
    if (response.ok) {
      const index = groups.value.findIndex((g) => g.id === id);
      groups.value.splice(index, 1);
    }
    return response;
  }

  async function addUserToGroup(groupId: number, userId: number) {
    const response = await api.callApi(
      `group/${groupId}/user/${userId}`,
      "PUT"
    );
    if (response.ok) {
      const group = await response.json();
      const index = groups.value.findIndex((g) => g.id === group.id);
      groups.value[index] = group;
    }
    return response;
  }

  async function requestInvite(groupId: number) {
    return await api.callApi(`group/${groupId}/invite`, "POST");
  }

  async function acceptInvite(code: string) {
    return await api.callApi(`group/invite/${code}`, "POST");
  }

  return {
    groups,
    getGroups,
    getGroup,
    createGroup,
    updateGroup,
    deleteGroup,
    leaveGroup,
    addUserToGroup,
    requestInvite,
    acceptInvite,
  };
});
