<script lang="ts" setup>
import { RouterView } from "vue-router";
import NavBarAltr from "@/components/NavBarAltr.vue";
import { onMounted } from "vue";
import { useAuthenticateStore } from "@/stores/auth";

const authenticateStore = useAuthenticateStore();

onMounted(() => {
  authenticateStore.token = localStorage.getItem("token") ?? "";
});
</script>

<template>
  <div class="flex min-h-screen">
    <NavBarAltr />
    <div class="p-3 w-full flex overflow-auto">
      <RouterView class="" />
    </div>
  </div>
</template>

<style scoped></style>
