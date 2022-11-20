<script lang="ts" setup>
import IconHome from "@/components/icons/IconHome.vue";
import IconGroup from "@/components/icons/IconGroup.vue";
import IconConnections from "@/components/icons/IconConnections.vue";
import IconUser from "@/components/icons/IconUser.vue";
import { useUserStore } from "@/stores/user";
import { onMounted } from "vue";
import IconLogout from "@/components/icons/IconLogout.vue";
import { useAuthenticateStore } from "@/stores/auth";

const userStore = useUserStore();
const authenticateStore = useAuthenticateStore();

onMounted(async () => {
  await userStore.getMe();
});

const links = [
  {
    name: "tasks",
    icon: IconHome,
    text: "Home",
  },
  {
    name: "groups",
    icon: IconGroup,
    text: "Groups",
  },
  {
    name: "not-found",
    icon: IconConnections,
    text: "Connections",
  },
];
</script>

<template>
  <nav class="h-full w-64 shadow-md shadow-yonder/10 bg-ghost sm:hidden">
    <div class="m-3 flex-col items-center">
      <div class="my-8 font-bold flex flex-col items-center">
        <IconUser
          class="h-[7em] w-[7em] mx-auto text-raisin/50 bg-yonder/10 rounded-full"
        />
        <div class="w-[7rem] flex justify-between m-2">
          <span
            v-if="userStore.ME"
            class="block text-raisin flex-1 overflow-ellipsis overflow-hidden"
          >
            {{ userStore.ME.username }}
          </span>
          <span v-else class="text-center block text-raisin/60">
            Not Logged In
            <span class="text-xs text-raisin/60 block underline">
              <router-link :to="{ name: 'login' }">Login</router-link>
            </span>
          </span>
          <IconLogout
            v-if="userStore.ME"
            class="h-6 w-6 text-raisin/60 hover:text-red-500/80 cursor-pointer transition-colors"
            @click="authenticateStore.logout()"
          />
        </div>
      </div>
      <ul class="flex flex-col font-bold gap-4">
        <li v-for="link in links" :key="link.name">
          <router-link
            :to="{ name: link.name }"
            class="flex gap-4 p-4 rounded-full transition-all items-center hover:bg-yonder/5"
          >
            <component
              :is="link.icon"
              class="w-[26px] h-[26px] font-bold transition-all"
            />
            <span class="condensed-hidden">{{ link.text }}</span>
          </router-link>
        </li>
      </ul>
    </div>
  </nav>
</template>

<!--suppress CssUnusedSymbol -->
<style scoped>
.router-link-active {
  @apply bg-yonder/10 text-yonder shadow-inner shadow-yonder/10 gap-6;
}
</style>
