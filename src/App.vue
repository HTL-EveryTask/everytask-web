<script lang="ts" setup>
import { onMounted } from "vue";
import { useAuthenticateStore } from "@/stores/auth";
import IconSettings from "@/components/icons/IconSettings.vue";
import NavBar from "@/components/NavBar.vue";
import ToastList from "@/components/ToastList.vue";

const authenticateStore = useAuthenticateStore();

onMounted(async () => {
  if (localStorage.getItem("token")) {
    const loggedIn = await authenticateStore.checkAuth();
    if (!loggedIn) {
      // await router.push({ name: "login" });
    }
  }
});
</script>

<template>
  <div
    class="h-screen w-screen flex flex-col bg-gradient-to-tr from-cerulean/50 to-rebecca/50"
  >
    <div
      class="h-16 w-full z-20 shadow-md shadow-yonder/10 flex justify-between items-center bg-ghost rounded-br-xl"
    >
      <header class="h-full w-full p-3 ml-2">
        <img alt="logo" class="h-full" src="@/assets/logo_light.svg" />
      </header>
      <router-link :to="{ name: 'settings' }" class="h-full p-2 mr-[5vw]">
        <div
          class="h-full hover:bg-raisin/5 text-raisin hover:text-raisin rounded-full p-2"
        >
          <IconSettings class="h-full" />
        </div>
      </router-link>
    </div>
    <div
      class="flex-1 flex flex-row sm:flex-col-reverse h-full overflow-hidden"
    >
      <NavBar v-if="!$route.meta.hideNavBar" class="z-10" />
      <div class="w-full h-full overflow-auto">
        <RouterView />
      </div>
    </div>

    <ToastList class="fixed top-0 right-0 z-30" />
  </div>
</template>

<style scoped></style>
