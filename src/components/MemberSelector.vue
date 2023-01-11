<script lang="ts" setup>
import { computed, onMounted, ref } from "vue";
import IconX from "@/components/icons/IconX.vue";
import { useGroupStore } from "@/stores/group";
import type { User } from "@/models/User";
import { useUserStore } from "@/stores/user";
import IconUser from "@/components/icons/IconUser.vue";
import IconCheck from "@/components/icons/IconCheck.vue";

const container = ref();

const query = ref("");

const props = defineProps<{
  modelValue: User[];
  pool: User[];
}>();
const emit = defineEmits(["update:modelValue"]);

const highLightedIndex = ref(0);

const selectedUsers = computed({
  get() {
    return props.modelValue;
  },
  set(value) {
    emit("update:modelValue", value);
  },
});

const filteredUsers = computed(() => {
  const me = useUserStore().ME;
  return props.pool
    .filter(
      (user) =>
        user.id !== me?.id &&
        user.username.toLowerCase().includes(query.value.toLowerCase())
    )
    .sort((a, b) => {
      if (selectedUsers.value.find((user) => user.id === a.id)) return -1;
      if (selectedUsers.value.find((user) => user.id === b.id)) return 1;
      if (a.username < b.username) return -1;
      if (a.username > b.username) return 1;
      return 0;
    });
});

function select(user: User) {
  if (selectedUsers.value.find((u) => u.id === user.id)) {
    selectedUsers.value = selectedUsers.value.filter((u) => u.id !== user.id);
  } else {
    selectedUsers.value = [...selectedUsers.value, user];
  }
  // set the highLightedIndex to where the user is in the list
}

onMounted(() => {
  useGroupStore().getGroups();
  container.value.focus();
});

function beforeLeave(el: any) {
  const { marginLeft, marginTop, width, height } = window.getComputedStyle(el);
  el.style.left = `${el.offsetLeft - parseFloat(marginLeft)}px`;
  el.style.top = `${el.offsetTop - parseFloat(marginTop)}px`;
  el.style.width = width;
  el.style.height = height;
}
</script>

<template>
  <div
    ref="container"
    class="flex flex-col focus:outline-none"
    tabindex="0"
    @keydown.enter.prevent="
      select(filteredUsers[highLightedIndex]);
      query = '';
    "
    @keydown.up="highLightedIndex = Math.max(highLightedIndex - 1, 0)"
    @keydown.down="
      highLightedIndex = Math.min(
        highLightedIndex + 1,
        filteredUsers.length - 1
      )
    "
  >
    <TransitionGroup
      class="flex items-center flex-wrap max-h-32 overflow-y-auto justify-between min-h-[3rem] overflow-x-hidden block w-full p-0 border-2 border-yonder/30 rounded-md focus:outline-none focus:border-indigo-500/30 focus:bg-cerulean/5 bg-inherit"
      name="list"
      tag="div"
      @before-leave="beforeLeave"
    >
      <div
        v-for="user in selectedUsers"
        :key="user.id"
        class="m-1 bg-gray-200 py-1 px-2 rounded-full flex items-center"
      >
        <div>{{ user.username }}</div>
        <div class="ml-2">
          <IconX
            class="font-bold text-gray-500 cursor-pointer rounded-full w-5 h-5 font-bold flex items-center justify-center hover:bg-gray-300"
            @click="selectedUsers.splice(selectedUsers.indexOf(user), 1)"
          />
        </div>
      </div>
      <input
        key="query"
        v-model="query"
        class="flex-1 min-w-[8rem] my-1 relative bg-transparent"
        type="text"
      />
    </TransitionGroup>
    <div class="flex flex-col overflow-y-auto flex-1">
      <TransitionGroup name="list" @before-leave="beforeLeave">
        <div
          v-for="(user, index) in filteredUsers"
          :key="user.id"
          :class="{
            'bg-yonder/10': highLightedIndex === index,
          }"
          class="p-2 flex items-center gap-2 bg-white"
          @click="select(user)"
        >
          <img
            v-if="user.image"
            :src="user.image"
            alt="Profile picture"
            class="w-10 h-10 rounded-full"
          />
          <IconUser v-else class="w-10 h-10 rounded-full text-raisin/70" />
          <span>
            {{ user.username }}
          </span>

          <div
            :class="{
              'bg-yonder/20': selectedUsers.find((u) => u.id === user.id),
            }"
            class="ml-auto rounded-md flex items-center justify-center w-7 h-7 bg-gray-200"
          >
            <IconCheck
              v-if="selectedUsers.find((u) => u.id === user.id)"
              class="w-5 h-5 text-yonder/70"
            />
          </div>
        </div>
      </TransitionGroup>
    </div>
  </div>
</template>

<!--suppress CssUnusedSymbol -->
<style scoped>
.list-move, /* apply transition to moving elements */
.list-enter-active,
.list-leave-active {
  transition: all 0.4s ease;
}

.list-enter-from {
  opacity: 0;
  transform: translateX(12px);
}

.list-leave-to {
  opacity: 0;
  transform: translateY(12px);
}

/* ensure leaving items are taken out of layout flow so that moving
   animations can be calculated correctly. */
.list-leave-active:not(#input) {
  position: absolute;
}
</style>
