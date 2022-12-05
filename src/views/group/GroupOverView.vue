<script lang="ts" setup>
import { onMounted, ref } from "vue";
import GroupCard from "@/components/GroupCard.vue";
import IconPlus from "@/components/icons/IconPlus.vue";
import ModalContainer from "@/components/ModalContainer.vue";
import { useGroupStore } from "@/stores/group";
import router from "@/router";
import SideViewContainer from "@/components/SideViewContainer.vue";

const groupStore = useGroupStore();
const error = ref("");

onMounted(async () => {
  try {
    await groupStore.getGroups();
    console.log(groupStore.groups);
  } catch {
    error.value = "Error while loading groups";
  }
});

// const addPopUpExpanded = ref(false);

// const addTaskPopUp = ref();
// useClickOutside(addTaskPopUp, () => {
//   addPopUpExpanded.value = false;
// });
</script>

<template>
  <div class="flex h-full relative">
    <div class="min-h-0 flex flex-1 flex-col z-[5] bg-ghost">
      <div class="flex flex-col gap-4 overflow-y-auto p-8 w-[48em] mx-auto">
        <TransitionGroup name="list">
          <GroupCard
            v-for="group in groupStore.groups"
            :key="group.id"
            :group="group"
            class="bg-white"
            @click="
              router.push({
                name: 'showGroup',
                params: { id: group.id },
              })
            "
          />
        </TransitionGroup>
        <button
          class="sticky bottom-0 m-4 p-4 px-24 pr-[6.5rem] mx-auto flex items-center justify-center bg-ghost border-2 border-yonder/30 hover:bg-yonder/10 rounded-xl shadow-md shadow-yonder/10 font-bold text-xl"
          @click="$router.push({ name: 'createGroup' })"
        >
          <IconPlus class="w-[2rem] h-[2rem] mr-2" />
          Create Group
        </button>
      </div>
    </div>

    <ModalContainer
      :show="$route.name === 'createGroup'"
      class="bg-white"
      effect="shadow"
      mobile-full
      title="Create Group"
      @close="$router.push({ name: 'groups' })"
    >
      <RouterView class="px-8" @close="$router.push({ name: 'groups' })" />
    </ModalContainer>

    <SideViewContainer
      :show="$route.name === 'showGroup'"
      title="Group"
      @close="$router.push({ name: 'groups' })"
    >
      <RouterView @close="$router.push({ name: 'groups' })" />
    </SideViewContainer>
  </div>
</template>

<!--suppress CssUnusedSymbol -->
<style scoped>
.list-move, /* apply transition to moving elements */
.list-enter-active,
.list-leave-active {
  transition: all 0.5s ease;
}

.list-enter-from {
  opacity: 0;
  transform: translateX(-30px);
}

.list-leave-to {
  opacity: 0;
}
</style>
