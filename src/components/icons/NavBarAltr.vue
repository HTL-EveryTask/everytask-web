<script lang="ts" setup>
import HomeIcon from "@/components/icons/HomeIcon.vue";
import GroupIcon from "@/components/icons/GroupIcon.vue";
import ConnectionIcon from "@/components/icons/ConnectionIcon.vue";
import UserIcon from "@/components/icons/UserIcon.vue";
import { ref } from "vue";

const mouseOver = ref(false);
</script>

<template>
  <nav
    :class="
      'w-[300px] bg-slate-800 p-[15px] py-[20px] transition-all' +
      (!mouseOver ? ' collapsed' : '')
    "
    @mouseleave="mouseOver = false"
    @mouseover="mouseOver = true"
  >
    <header class="w-12 mx-auto">
      <img alt="logo" src="@/assets/logo.svg" />
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
    </ul>
    <!-- Profile -->
    <div>
      <UserIcon class="w-10 h-10" />
      <span class="ml-4 whitespace-nowrap condensed-hidden">John Doe</span>
    </div>
  </nav>
</template>

<style scoped>
nav.collapsed {
  width: 90px;
}

.nav-link svg {
  min-width: 60px;
  height: 24px;
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
  @apply bg-red-800 mt-4 flex;
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
