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
    text: "Tasks",
    children: [
      {
        name: "not-found",
        text: "Private",
      },
      {
        name: "not-found",
        text: "Groups",
      },
    ],
  },
  {
    name: "groups",
    icon: IconGroup,
    text: "Groups",
    children: [],
  },
  {
    name: "not-found",
    icon: IconConnections,
    text: "Connections",
    children: [],
  },
];
</script>

<template>
  <nav class="h-full w-64 shadow-md shadow-yonder/10 bg-ghost sm:hidden">
    <div class="flex-col items-center">
      <div class="my-8 flex flex-col items-center">
        <IconUser
          class="h-[7em] w-[7em] mx-auto text-raisin/50 bg-yonder/10 rounded-full"
        />
        <div class="w-[7rem] flex justify-between m-2">
          <span
            v-if="userStore.ME"
            class="block text-raisin flex-1 overflow-ellipsis overflow-hidden text-center"
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
      <ul class="flex flex-col gap-4">
        <li v-for="link in links" :key="link.name" class="main-links">
          <router-link
            :to="{ name: link.name }"
            class="flex gap-4 p-4 rounded-r-full mr-4 pl-12 transition-all items-center hover:bg-yonder/5"
          >
            <component
              :is="link.icon"
              class="w-[26px] h-[26px] transition-all"
            />
            <span class="condensed-hidden">{{ link.text }}</span>
          </router-link>
          <ul v-if="link.children.length > 0" class="flex flex-col mt-4">
            <li v-for="child in link.children" :key="child.name">
              <router-link
                :to="{ name: child.name }"
                class="flex gap-4 p-2 rounded-r-full mr-4 transition-all items-center hover:text-yonder/100"
              >
                <span class="condensed-hidden ml-20">{{ child.text }}</span>
              </router-link>
            </li>
          </ul>
        </li>
      </ul>
    </div>
  </nav>
</template>

<!--suppress CssUnusedSymbol -->
<style scoped>
.main-links > .router-link-active {
  @apply bg-white text-yonder shadow-md shadow-yonder/10;
}
</style>
