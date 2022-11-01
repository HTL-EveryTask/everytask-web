<script lang="ts" setup>
import HomeIcon from "@/components/icons/HomeIcon.vue";
import GroupIcon from "@/components/icons/GroupIcon.vue";
import ConnectionIcon from "@/components/icons/ConnectionIcon.vue";
import UserIcon from "@/components/icons/UserIcon.vue";
import { ref } from "vue";
import { useAuthenticateStore } from "@/stores/auth";

const authenticateStore = useAuthenticateStore();

const mouseOver = ref(false);
</script>

<template>
  <nav
    :class="
      'w-[250px] bg-ghost shadow-xl p-[22px] py-[20px] transition-all rounded-2xl' +
      (!mouseOver ? ' collapsed' : '')
    "
    @mouseleave="mouseOver = false"
    @mouseover="mouseOver = true"
  >
    <header class="w-16 mx-auto">
      <img alt="logo" src="@/assets/logo_light.svg" />
      <span>EveryTask</span>
    </header>
    <ul class="">
      <li>
        <router-link class="nav-link" to="/">
          <HomeIcon />
          <span class="condensed-hidden">Home</span>
        </router-link>
      </li>
      <li>
        <router-link class="nav-link" to="/">
          <GroupIcon />
          <span class="">Groups</span>
        </router-link>
      </li>
      <li>
        <router-link class="nav-link" to="/">
          <ConnectionIcon />
          <span class="">Connections</span>
        </router-link>
      </li>
      <li>
        <router-link class="nav-link" to="/">
          <HomeIcon />
          <span class="">Settings</span>
        </router-link>
      </li>

      <li>
        <router-link :to="{ name: 'login' }" class="nav-link">
          <UserIcon />
          <span>{{
            authenticateStore.token ? authenticateStore.token : "Not Logged In"
          }}</span>
        </router-link>
      </li>
    </ul>
    <!-- Profile -->
    <div></div>
  </nav>
</template>

<style scoped>
/*noinspection CssUnusedSymbol*/
nav.collapsed {
  width: 100px;
}

.nav-link svg {
  min-width: 53px;
  height: 28px;
  margin-right: 8px;
}

.nav-link span {
  white-space: nowrap;
  opacity: 1;
}

nav.collapsed span {
  /* opacity: 0; */
}

nav li {
  height: 50px;
  @apply rounded-xl bg-ghost border-2 border-indigo-200 mt-4 flex;
  display: flex;
}

nav li a {
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
