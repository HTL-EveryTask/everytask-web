<script lang="ts" setup>
import { RouterView } from "vue-router";
import NavBarAltr from "@/components/icons/NavBarAltr.vue";
</script>

<template>
  <div class="flex min-h-screen">
    <NavBarAltr />
    <div class="p-3 mx-auto">
      <RouterView />
    </div>
  </div>
</template>

<style scoped></style>
