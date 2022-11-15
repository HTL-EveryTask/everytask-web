<script lang="ts" setup>
import { useAuthenticateStore } from "@/stores/auth";
import type { Group } from "@/models/Group";
import { onMounted } from "vue";
import GroupCard from "@/components/GroupCard.vue";
import CreateGroupView from "@/views/modals/CreateGroupView.vue";

const authenticateStore = useAuthenticateStore();
const mockGroups: Group[] = [
  {
    id: "1",
    name: "Group 1",
    description: "This is a group",
    memberIds: ["1", "2", "3"],
  },
  {
    id: "2",
    name: "Group 2",
    description: "This is a group",
    memberIds: ["1", "2", "3"],
  },
  {
    id: "3",
    name: "Group 3",
    description: "This is a group",
    memberIds: ["1", "2", "3"],
  },
  {
    id: "4",
    name: "Group 4",
    description: "This is a group",
    memberIds: ["1", "2", "3"],
  },
  {
    id: "5",
    name: "Group 5",
    description: "This is a group",
    memberIds: ["1", "2", "3"],
  },
  {
    id: "6",
    name: "Group 6",
    description: "This is a group",
    memberIds: ["1", "2", "3"],
  },
  {
    id: "7",
    name: "Group 7",
    description: "This is a group",
    memberIds: ["1", "2", "3"],
  },
  {
    id: "8",
    name: "Group 8",
    description: "This is a group",
    memberIds: ["1", "2", "3"],
  },
  {
    id: "9",
    name: "Group 9",
    description: "This is a group",
    memberIds: ["1", "2", "3"],
  },
  {
    id: "10",
    name: "Group 10",
    description: "This is a group",
    memberIds: ["1", "2", "3"],
  },
  {
    id: "11",
    name: "Group 11",
    description: "This is a group",
    memberIds: ["1", "2", "3"],
  },
  {
    id: "12",
    name: "Group 12",
    description: "This is a group",
    memberIds: ["1", "2", "3"],
  },
  {
    id: "13",
    name: "Group 13",
    description: "This is a group",
    memberIds: ["1", "2", "3"],
  },
  {
    id: "14",
    name: "Group 14",
    description:
      "This is a group that has a long description that will have ellipsis at the end as to not overflow the card",
    memberIds: ["1", "2", "3"],
  },
];

onMounted(async () => {
  // await authenticateStore.fetchTasks();
});

// const addPopUpExpanded = ref(false);

// const addTaskPopUp = ref();
// useClickOutside(addTaskPopUp, () => {
//   addPopUpExpanded.value = false;
// });
</script>

<template>
  <div class="flex">
    <div class="p-4 h-screen overflow-y-scroll flex-1 z-10 bg-ghost">
      <div class="flex flex-col gap-4">
        <GroupCard
          v-for="group in mockGroups"
          :key="group.id"
          :group="group"
          class="bg-white shadow-md shadow-yonder/10"
        />
      </div>
    </div>
    <div class="w-[40vw] p-8 bg-white z-0">
      <CreateGroupView class="m-4 mx-auto" />
    </div>
  </div>
</template>

<!--suppress CssUnusedSymbol -->
<style scoped></style>
