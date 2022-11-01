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
    <NavBarAltr v-if="authenticateStore.token" />
    <div class="p-3 w-full flex overflow-auto">
      <RouterView class="" />
    </div>
  </div>
</template>

<style scoped></style>
