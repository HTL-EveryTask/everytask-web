<script lang="ts" setup>
import IconHome from "@/components/icons/IconHome.vue";
import IconGroup from "@/components/icons/IconGroup.vue";
import IconConnections from "@/components/icons/IconConnections.vue";
import IconUser from "@/components/icons/IconUser.vue";
import { useUserStore } from "@/stores/user";
import { markRaw, onMounted, ref } from "vue";
import IconLogout from "@/components/icons/IconLogout.vue";
import { useAuthenticateStore } from "@/stores/auth";
import IconChevron from "@/components/icons/IconChevron.vue";

const userStore = useUserStore();
const authenticateStore = useAuthenticateStore();

onMounted(async () => {
  await userStore.getMe();
});

const links = ref([
  {
    name: "tasks",
    icon: markRaw(IconHome),
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
    expanded: false,
  },
  {
    name: "groups",
    icon: markRaw(IconGroup),
    text: "Groups",
    children: [],
    expanded: false,
  },
  {
    name: "connections",
    icon: markRaw(IconConnections),
    text: "Connections",
    children: [],
    expanded: false,
  },
]);

function expand(link: any) {
  link.expanded = !link.expanded;
  console.log(link);
}
</script>

<template>
  <nav class="h-full w-64 shadow-md shadow-yonder/10 bg-ghost sm:hidden">
    <div class="flex-col items-center">
      <div class="my-8 flex flex-col items-center">
        <router-link :to="{ name: 'profileSettings' }">
          <IconUser
            class="h-[7em] w-[7em] mx-auto text-raisin/50 bg-yonder/10 rounded-full cursor-pointer hover:text-raisin/70 transition-colors duration-300"
          />
        </router-link>
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
      <TransitionGroup appear class="flex flex-col gap-4" name="list" tag="ul">
        <li v-for="link in links" :key="link.name" class="main-links">
          <router-link
            :to="{ name: link.name }"
            class="flex gap-4 p-4 rounded-r-full mr-4 pl-8 transition-all items-center hover:bg-yonder/5"
          >
            <component
              :is="link.icon"
              class="w-[26px] h-[26px] transition-all"
            />
            <span class="condensed-hidden">{{ link.text }}</span>

            <div class="flex-1" @click.prevent="expand(link)">
              <IconChevron
                v-if="link.children.length > 0"
                :class="{ 'rotate-0': link.expanded }"
                class="w-4 h-4 ml-auto transition-transform transform rotate-180"
              />
            </div>
          </router-link>
          <Transition
            v-if="link.children.length > 0 && link.expanded"
            appear
            name="fade"
          >
            <ul class="flex flex-col mt-4">
              <li v-for="child in link.children" :key="child.name">
                <router-link
                  :to="{ name: child.name }"
                  class="flex gap-4 p-2 rounded-r-full mr-4 transition-all items-center hover:text-yonder/100"
                >
                  <span class="condensed-hidden ml-20">{{ child.text }}</span>
                </router-link>
              </li>
            </ul>
          </Transition>
        </li>
      </TransitionGroup>
    </div>
  </nav>
</template>

<!--suppress CssUnusedSymbol -->
<style scoped>
.main-links > .router-link-active {
  @apply bg-white text-yonder shadow-md shadow-yonder/10;
}

.list-move,
.list-enter-active,
.list-leave-active {
  transition: all 0.5s ease;
}

.list-enter-from {
  opacity: 0;
  transform: translateX(-30px);
}

.list-leave-to {
  opacity: 0;
}

.list-leave-active {
  position: absolute;
  width: 100%;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
