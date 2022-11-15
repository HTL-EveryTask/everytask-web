<script lang="ts" setup>
import HomeIcon from "@/components/icons/HomeIcon.vue";
import IconGroup from "@/components/icons/IconGroup.vue";
import IconConnections from "@/components/icons/IconConnections.vue";
import UserIcon from "@/components/icons/UserIcon.vue";
import LogoutIcon from "@/components/icons/LogoutIcon.vue";
import { ref } from "vue";

const mouseOver = ref(false);
</script>

<template>
  <div
    :class="
      'w-24 bg-red-500 rounded-tr-xl rounded-br-xl' +
      (mouseOver ? ' w-64' : '') +
      (!mouseOver ? ' condensed' : '')
    "
    @mouseleave="mouseOver = false"
    @mouseover="mouseOver = true"
  >
    <div class="pt-8 pb-4 px-4 h-full flex flex-col items-center">
      <div class="w-12">
        <img alt="logo" src="@/assets/logo.svg" />
      </div>

      <ul class="w-full h-full mt-12 mb-8 flex flex-col gap-4">
        <li>
          <router-link class="nav-link" to="/">
            <HomeIcon />
            <span class="condensed-hidden">Home</span>
          </router-link>
        </li>
        <li>
          <router-link class="nav-link" to="/">
            <IconGroup />
            <span class="condensed-hidden">Groups</span>
          </router-link>
        </li>
        <li>
          <router-link class="nav-link" to="/">
            <IconConnections />
            <span class="condensed-hidden">Connections</span>
          </router-link>
        </li>
        <li class="mt-auto">
          <router-link class="nav-link" to="/">
            <HomeIcon />
            <span class="condensed-hidden">Settings</span>
          </router-link>
        </li>
      </ul>

      <!-- Profile -->
      <div class="mt-auto w-full flex items-center h-16">
        <div>
          <UserIcon class="w-10 h-10" />
        </div>
        <div class="ml-4 whitespace-nowrap condensed-hidden">
          <p class="text-white">John Doe</p>
          <p class="text-white text-xs">
            <span class="text-amber-500">●</span> Online
          </p>
        </div>
        <div class="ml-auto condensed-hidden">
          <LogoutIcon />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
* {
  transition: width 0.4s ease-in-out;
}

.nav-link {
  @apply flex items-center gap-4 h-16 text-lg font-bold bg-yellow-500 px-4 py-4;
}

.condensed .nav-link {
}

.nav-link svg {
  width: 2rem;
  height: 2rem;
  min-width: 2rem;
}

.nav-link:hover {
  @apply bg-yellow-600;
}

.nav-link span {
  @apply pr-6;
}

.condensed .condensed-hidden {
  display: none;
}
</style>
