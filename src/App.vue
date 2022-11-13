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
  <div class="flex min-h-screen">
    <NavBarAltr v-if="!$route.meta.hideNavBar" class="z-10" />
    <div class="flex w-full h-screen">
      <RouterView />
    </div>
  </div>
</template>

<style scoped></style>
