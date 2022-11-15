<script lang="ts" setup>
import { RouterView } from "vue-router";
import NavBarAltr from "@/components/NavBarAltr.vue";
import { onMounted } from "vue";
import { useAuthenticateStore } from "@/stores/auth";
import router from "@/router";

const authenticateStore = useAuthenticateStore();

onMounted(async () => {
  authenticateStore.token = localStorage.getItem("token") ?? "";
  let loggedIn = await authenticateStore.authenticate().catch(() => {
    router.push({ name: "login" });
  });
  if (!loggedIn) {
    localStorage.removeItem("token");
    await router.push({ name: "login" });
  }
});
</script>

<template>
  <div class="h-screen w-screen flex flex-col">
    <div class="h-16 w-full z-20 shadow-md"></div>
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
