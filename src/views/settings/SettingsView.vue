<script lang="ts" setup>
import IconUser from "@/components/icons/IconUser.vue";

const links = [
  {
    name: "profileSettings",
    icon: IconUser,
    text: "Profile",
  },
  {
    name: "groups",
    icon: IconUser,
    text: "Placeholder",
  },
  {
    name: "groups",
    icon: IconUser,
    text: "Placeholder",
  },
];
</script>

<template>
  <div class="flex h-full">
    <nav class="w-44 h-full shadow-md shadow-yonder/10 bg-ghost">
      <ul>
        <li v-for="link in links" :key="link.name">
          <router-link
            :to="{ name: link.name }"
            class="flex gap-4 p-3 transition-all items-center hover:bg-yonder/5"
          >
            <component
              :is="link.icon"
              class="w-[26px] h-[26px] font-bold transition-all"
            />
            <span class="condensed-hidden">{{ link.text }}</span>
          </router-link>
        </li>
      </ul>
    </nav>
    <div class="flex-1 flex justify-center mx-auto mx-8">
      <RouterView class="w-full max-w-[1000px] px-12 pt-8 bg-ghost" />
    </div>
  </div>
</template>

<style scoped>
.router-link-exact-active {
  @apply bg-yonder/10 text-yonder shadow-inner shadow-yonder/10;
}
</style>
