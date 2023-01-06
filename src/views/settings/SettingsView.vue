<script lang="ts" setup>
import IconUser from "@/components/icons/IconUser.vue";
import SideHeader from "@/components/SideHeader.vue";

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
  <div class="flex h-full relative">
    <nav
      :class="{ 'sm:hidden': $route.name !== 'settings' }"
      class="w-44 h-full shadow-md shadow-yonder/10 bg-ghost sm:absolute sm:w-full sm:z-20"
    >
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
    <div
      class="flex-1 flex flex-col justify-center mx-auto mx-8 sm:mx-0 w-full"
    >
      <SideHeader
        class="bg-ghost sm:flex hidden"
        title="Settings"
        @close="$router.push({ name: 'settings' })"
      />
      <RouterView
        class="w-full max-w-[1000px] px-12 pt-8 bg-ghost sm:p-4 flex-1 overflow-y-auto"
      />
    </div>
  </div>
</template>

<style scoped>
.router-link-exact-active {
  @apply bg-yonder/10 text-yonder shadow-inner shadow-yonder/10;
}
</style>
