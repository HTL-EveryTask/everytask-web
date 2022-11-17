<script lang="ts" setup>
import { onMounted } from "vue";
import GroupCard from "@/components/GroupCard.vue";
import IconPlus from "@/components/icons/IconPlus.vue";
import ModalContainer from "@/components/ModalContainer.vue";

const mockGroups = [
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
  <div class="flex h-full">
    <div class="min-h-0 flex flex-1 flex-col z-[5] bg-ghost">
      <div class="flex flex-col gap-4 overflow-y-auto p-4 w-[40vw] mx-auto">
        <GroupCard
          v-for="group in mockGroups"
          :key="group.id"
          :group="group"
          class="bg-white"
        />
        <button
          class="sticky bottom-0 m-4 p-4 px-24 pr-[6.5rem] mx-auto flex items-center justify-center bg-ghost border-2 border-yonder/30 hover:bg-yonder/10 rounded-lg shadow-lg font-bold text-xl"
          @click="$router.push({ name: 'createGroup' })"
        >
          <IconPlus class="w-[2rem] h-[2rem] mr-2" />
          Create Group
        </button>
      </div>
    </div>

    <ModalContainer
      :show="$route.name === 'createGroup'"
      class="bg-white w-[40vw] h-[40em]"
      title="Create Group"
      effect="shadow"
      @close="$router.push({ name: 'groups' })"
    >
      <RouterView class="px-8" @close="$router.push({ name: 'groups' })" />
    </ModalContainer>
  </div>
</template>

<!--suppress CssUnusedSymbol -->
<style scoped></style>
