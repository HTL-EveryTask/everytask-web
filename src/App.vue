<script lang="ts" setup>
import NavBarAltr from "@/components/NavBarAltr.vue";
import { onMounted, ref } from "vue";
import { useAuthenticateStore } from "@/stores/auth";
import router from "@/router";
import GroupUserSelector from "@/components/GroupUserSelector.vue";

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

const selectedItems = ref<string[]>([]);
</script>

<template>
  <div class="flex min-h-screen">
    <NavBarAltr v-if="!$route.meta.hideNavBar" />
    <div class="p-3 w-full flex overflow-auto">
      <!--      <RouterView class="" />-->
      <div>
        <GroupUserSelector v-model="selectedItems" />
      </div>
    </div>
  </div>
</template>

<style scoped></style>
