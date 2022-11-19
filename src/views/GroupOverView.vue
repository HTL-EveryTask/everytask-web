<script lang="ts" setup>
import { onMounted, ref } from "vue";
import GroupCard from "@/components/GroupCard.vue";
import IconPlus from "@/components/icons/IconPlus.vue";
import ModalContainer from "@/components/ModalContainer.vue";
import { useGroupStore } from "@/stores/group";
import router from "@/router";
import IconArrow from "@/components/icons/IconArrow.vue";

const groupStore = useGroupStore();
const error = ref("");

onMounted(async () => {
  try {
    await groupStore.getGroups();
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
  <div class="flex h-full">
    <div class="min-h-0 flex flex-1 flex-col z-[5] bg-ghost">
      <div class="flex flex-col gap-4 overflow-y-auto p-8 w-[60vw]">
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
    <div></div>

    <ModalContainer
      :show="$route.name === 'createGroup'"
      class="bg-white"
      effect="shadow"
      title="Create Group"
      @close="$router.push({ name: 'groups' })"
      mobile-full
    >
      <RouterView class="px-8" @close="$router.push({ name: 'groups' })" />
    </ModalContainer>

    <Transition name="side">
      <aside
        v-if="$route.name === 'showGroup'"
        class="h-full right-0 overflow-hidden w-[30vw] min-w sm:w-screen sm:fixed bg-ghost sm:rounded-none z-[15] shadow-yonder/10 shadow-md"
        @close="router.push({ name: 'groups' })"
      >
        <div class="min-w-[300px]">
          <header class="flex items-center border-yonder border-b-2 p-4">
            <button
              class="text-2xl text-rebecca p-2 mr-4"
              @click="router.push({ name: 'groups' })"
            >
              <IconArrow
                class="h-6 w-6 transform rotate-180 hover:font-bold transition-colors duration-300"
              />
            </button>
            <h1 class="text-2xl font-bold">Edit Group</h1>
          </header>
          <div class="p-8">
            <RouterView @close="router.push({ name: 'groups' })" />
          </div>
        </div>
      </aside>
    </Transition>
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

.side-enter-active,
.side-leave-active {
  transition: all 0.4s ease-in-out;
}

.side-enter-from,
.side-leave-to {
  opacity: 0;
  width: 0;
}

.side-leave-active {
  overflow: hidden;
}
</style>
