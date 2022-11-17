<script lang="ts" setup>
import HomeIcon from "@/components/icons/HomeIcon.vue";
import IconGroup from "@/components/icons/IconGroup.vue";
import IconConnections from "@/components/icons/IconConnections.vue";
import UserIcon from "@/components/icons/UserIcon.vue";
import { onMounted, ref } from "vue";
import { useApiStore } from "@/stores/api";
import { useAuthenticateStore } from "@/stores/auth";
import { useUserStore } from "@/stores/user";

const apiStore = useApiStore();
const userStore = useUserStore();

onMounted(async () => {
  await userStore.getMe();
});

const authenticateStore = useAuthenticateStore();

const mouseOver = ref(false);
</script>

<template>
  <nav
    class="w-[240px] bg-ghost shadow-lg shadow-yonder/10 p-[22px] py-[20px] transition-all text-raisin"
    @mouseleave="mouseOver = false"
    @mouseover="mouseOver = true"
  >
    <ul class="">
      <li>
        <router-link :to="{ name: 'tasks' }" class="nav-link">
          <HomeIcon />
          <span class="condensed-hidden">Home</span>
        </router-link>
      </li>
      <li>
        <router-link :to="{ name: 'groups' }" class="nav-link">
          <IconGroup />
          <span class="">Groups</span>
        </router-link>
      </li>
      <li>
        <router-link :to="{ name: 'not-found' }" class="nav-link">
          <IconConnections />
          <span class="">Connections</span>
        </router-link>
      </li>

      <li :class="!userStore.ME ? 'bg-opacity-20 bg-red-500' : ''">
        <router-link :to="{ name: 'login' }" class="nav-link">
          <UserIcon />
          <span
            >{{ userStore.ME ? userStore.ME.username : "Not Logged In" }}
            <span
              v-if="apiStore.TOKEN"
              class="text-xs text-raisin/60 block"
              @click="authenticateStore.logout()"
            >
              Logout
            </span>
          </span>
          <br />
        </router-link>
      </li>
    </ul>
    <!-- Profile -->
    <div></div>
  </nav>
</template>

<!--suppress CssUnusedSymbol -->
<style scoped>
nav.collapsed {
  width: 100px;
}

.nav-link svg {
  min-width: 53px;
  height: 28px;
  margin-right: 8px;
  @apply text-raisin/90;
}

.nav-link span {
  white-space: nowrap;
  opacity: 1;
}

nav.collapsed span {
  /* opacity: 0; */
}

nav li > * {
}

.router-link-active {
  @apply bg-white;
}

nav li a {
  height: 60px;
  @apply rounded-full mt-4 flex bg-raisin/10;
  list-style: none;
  background-color: transparent;
  display: flex;
  align-items: center;
  text-decoration: none;
}

nav ul {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  overflow-y: scroll;
  overflow-x: hidden;
}

ul::-webkit-scrollbar {
  display: none;
}
</style>
