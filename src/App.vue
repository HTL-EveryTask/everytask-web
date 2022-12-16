<script lang="ts" setup>
import { onMounted, ref, watch } from "vue";
import { useAuthenticateStore } from "@/stores/auth";
import IconSettings from "@/components/icons/IconSettings.vue";
import NavBar from "@/components/NavBar.vue";
import ToastList from "@/components/ToastList.vue";
import IconBurger from "@/components/icons/IconBurger.vue";
import router from "@/router";

const authenticateStore = useAuthenticateStore();

const isMenuOpen = ref(false);

onMounted(async () => {
  if (localStorage.getItem("token")) {
    const loggedIn = await authenticateStore.checkAuth();
    if (!loggedIn) {
      // await router.push({ name: "login" });
    }
  }

  // watch route change to close menu
  watch(
    () => router.currentRoute.value,
    () => {
      isMenuOpen.value = false;
    }
  );
});
</script>

<template>
  <div
    class="h-screen w-screen flex flex-col bg-gradient-to-tr from-cerulean/50 to-rebecca/50"
  >
    <div
      class="h-16 w-full z-30 sm:z-40 shadow-md shadow-yonder/10 flex justify-between items-center bg-ghost"
    >
      <header class="h-full w-full p-3 ml-2 flex items-center">
        <div
          :class="{ 'opacity-50': $route.meta.hideNavBar }"
          class="p-2 bg-ghost hidden sm:block mx-2 rounded-full hover:bg-yonder/10 active:bg-yonder/20"
          @click="isMenuOpen = !isMenuOpen"
        >
          <IconBurger class="h-8 w-8" />
        </div>
        <img
          alt="logo"
          class="h-full sm:hidden cursor-pointer"
          src="@/assets/logo_light.svg"
          @click="router.push('/')"
        />
      </header>
      <router-link :to="{ name: 'settings' }" class="h-full p-2 mr-[5vw]">
        <div
          v-if="!$route.meta.hideNavBar"
          class="h-full hover:bg-yonder/10 text-raisin hover:text-raisin rounded-full p-2"
        >
          <IconSettings class="h-full" />
        </div>
      </router-link>
    </div>
    <div
      class="flex-1 flex flex-row sm:flex-col-reverse h-full overflow-hidden relative"
    >
      <NavBar
        v-if="!$route.meta.hideNavBar"
        :class="{
          'sm:translate-x-0': isMenuOpen,
          'sm:-translate-x-full': !isMenuOpen,
        }"
        class="z-10 sm:z-30 sm:absolute transition-transform duration-300 ease-in-out"
      />

      <div class="w-full h-full overflow-auto">
        <RouterView />
      </div>
    </div>

    <ToastList class="fixed top-0 right-0 z-50" />
  </div>
</template>

<style scoped></style>
