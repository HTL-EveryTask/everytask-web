<script lang="ts" setup>
import { RouterView } from "vue-router";
import NavBarAltr from "@/components/NavBarAltr.vue";
import { onMounted } from "vue";

onMounted(() => {});
</script>

<template>
  <div class="flex min-h-screen">
    <NavBarAltr />
    <div class="p-3 w-full flex">
      <RouterView class="" />
    </div>
  </div>
</template>

<style scoped></style>
