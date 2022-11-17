<script lang="ts" setup>
import { RouterView } from "vue-router";
import NavBarAltr from "@/components/NavBarAltr.vue";
import { onMounted } from "vue";
import { useAuthenticateStore } from "@/stores/auth";
import IconSettings from "@/components/icons/IconSettings.vue";

const authenticateStore = useAuthenticateStore();

onMounted(async () => {
  const loggedIn = await authenticateStore.checkAuth();
  if (!loggedIn) {
    // await router.push({ name: "login" });
  }
});
</script>

<template>
  <div class="h-screen w-screen flex flex-col">
    <div
      class="h-16 w-full z-20 shadow-md shadow-yonder/10 flex justify-between items-center"
    >
      <header class="h-full w-full p-3 ml-2">
        <img alt="logo" class="h-full" src="@/assets/logo_light.svg" />
      </header>
      <div class="h-full p-4 mr-16">
        <IconSettings class="h-full" />
      </div>
    </div>
    <div
      class="flex-1 flex sm:flex-row flex-col-reverse h-full overflow-hidden"
    >
      <NavBarAltr v-if="!$route.meta.hideNavBar" class="z-10" />
      <div class="w-full overflow-auto">
        <RouterView />
      </div>
    </div>
  </div>
</template>

<style scoped></style>
