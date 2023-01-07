<script lang="ts" setup>
import { onMounted, ref } from "vue";
import GroupCard from "@/components/GroupCard.vue";
import IconPlus from "@/components/icons/IconPlus.vue";
import ModalContainer from "@/components/ModalContainer.vue";
import { useGroupStore } from "@/stores/group";
import router from "@/router";
import SideViewContainer from "@/components/SideViewContainer.vue";
import IconSpinner from "@/components/icons/IconSpinner.vue";

const groupStore = useGroupStore();
const error = ref("");
const loading = ref(false);

onMounted(async () => {
  loading.value = true;
  try {
    await groupStore.getGroups();
    console.log(groupStore.groups);
  } catch {
    error.value = "Error while loading groups";
  } finally {
    loading.value = false;
  }
});
</script>

<template>
  <div class="flex h-full relative">
    <main class="min-h-0 flex flex-1 flex-col z-[5]">
      <div class="flex-1 overflow-y-auto">
        <div class="mx-4 sm:m-1">
          <div class="main-board flex flex-col h-auto max-h-[80vh]">
            <header
              class="text-3xl p-8 border-b-2 border-yonder/60 flex items-center"
            >
              <h1 class="font-semibold">My Groups</h1>
            </header>
            <div
              class="p-8 sm:p-4 overflow-y-auto w-full h-full border-b-2 border-yonder/60"
            >
              <TransitionGroup
                v-if="groupStore.groups.length > 0"
                appear
                class="flex flex-col gap-4 w-full"
                name="list"
                tag="div"
              >
                <GroupCard
                  v-for="group in groupStore.groups"
                  :key="group.id"
                  :class="[
                    Number(router.currentRoute.value.params.id) === group.id
                      ? 'border-cerulean/50 border-2'
                      : 'border-transparent border-2',
                  ]"
                  :group="group"
                  class="bg-white"
                  @click="
                    Number(router.currentRoute.value.params.id) === group.id
                      ? router.push({ name: 'groups' })
                      : router.replace({
                          name: 'showGroup',
                          params: { id: group.id },
                        })
                  "
                />
              </TransitionGroup>
              <div v-else-if="loading" class="flex justify-center m-16">
                <IconSpinner class="w-6 h-6" />
              </div>
              <div
                v-else
                class="flex flex-col items-center justify-center m-16"
              >
                <h1 class="text-2xl font-semibold">No groups yet</h1>
                <p class="text-gray-500 text-center">
                  Create a group to start collaborating with your friends
                </p>
              </div>
            </div>
            <button
              class="m-4 p-4 px-24 pr-[6.5rem] mx-auto flex items-center justify-center btn-primary rounded-xl shadow-md shadow-yonder/10 font-bold text-xl"
              @click="$router.push({ name: 'createGroup' })"
            >
              <IconPlus class="w-[2rem] h-[2rem] mr-2" />
              Create Group
            </button>
          </div>
        </div>
      </div>
    </main>

    <ModalContainer
      :show="$route.name === 'createGroup'"
      class="bg-white"
      effect="shadow"
      mobile-full
      title="Create Group"
      @close="$router.push({ name: 'groups' })"
    >
      <RouterView @close="$router.push({ name: 'groups' })" />
    </ModalContainer>

    <SideViewContainer
      :show="$route.name === 'showGroup'"
      class="bg-ghost"
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
