import { ref } from "vue";
import { defineStore } from "pinia";
import { useApiStore } from "@/stores/api";
import type { Group } from "@/models/Group";

export const useGroupStore = defineStore("group", () => {
  const api = useApiStore();

  const groups = ref<Group[]>([]);

  function getAllUsers() {
    // flatmap the groups to get all users in one array but keep them unique
    return groups.value
      .flatMap((group) => group.users)
      .filter(
        (user, index, self) => self.findIndex((u) => u.id === user.id) === index
      );
  }

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
      const group = await response.json().then((data) => data.group);
      console.log(group);
      const index = groups.value.findIndex((g) => g.id === group.id);
      if (index !== -1) {
        groups.value[index] = group;
      } else {
        groups.value.push(group);
      }
      return group;
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
    const response = await api.callApi(`group/${group.id}`, "PATCH", group);
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

  async function addUsersToGroup(groupId: number, userIds: number[]) {
    const response = await api.callApi(`group/${groupId}`, "PATCH", {
      members: userIds,
    });
    if (response.ok) {
      const group = await response.json().then((data) => data.group);
      const index = groups.value.findIndex((g) => g.id === group.id);
      groups.value[index] = group;
    }
    return response;
  }

  async function requestInvite(groupId: number) {
    return await api.callApi(`group/${groupId}/invite`, "POST");
  }

  async function acceptInvite(code: string) {
    return await api.callApi(`group/invite/accept`, "POST", { key: code });
  }

  async function deleteInvite(groupId: number) {
    const response = await api.callApi(`group/${groupId}/key`, "DELETE");
    if (response.ok) {
      const index = groups.value.findIndex((g) => g.id === groupId);
      groups.value[index].key = undefined;
    }
  }

  async function makeAdmin(groupId: number, userId: number) {
    const response = await api.callApi(`group/${groupId}/admin`, "PUT", {
      id: userId,
    });
    if (response.ok) {
      // const group = await response.json();
      // const index = groups.value.findIndex((g) => g.id === group.id);
      // groups.value[index] = group;
    }
    return response;
  }

  async function removeAdmin(groupId: number, userId: number) {
    const response = await api.callApi(`group/${groupId}/admin`, "DELETE", {
      id: userId,
    });
    if (response.ok) {
      // const group = await response.json();
      // const index = groups.value.findIndex((g) => g.id === group.id);
      // groups.value[index] = group;
    }
    return response;
  }

  async function removeUserFromGroup(groupId: number, userId: number) {
    const response = await api.callApi(
      `group/${groupId}/user/${userId}`,
      "DELETE"
    );
    if (response.ok) {
      // const group = await response.json();
      // const index = groups.value.findIndex((g) => g.id === group.id);
      // groups.value[index] = group;
    }
    return response;
  }

  return {
    groups,
    getAllUsers,
    getGroups,
    getGroup,
    createGroup,
    updateGroup,
    deleteGroup,
    leaveGroup,
    addUserToGroup,
    addUsersToGroup,
    requestInvite,
    acceptInvite,
    deleteInvite,
    makeAdmin,
    removeAdmin,
    removeUserFromGroup,
  };
});
