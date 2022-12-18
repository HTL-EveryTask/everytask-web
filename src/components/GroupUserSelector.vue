<script lang="ts" setup>
import { computed, onMounted, ref } from "vue";
import IconX from "@/components/icons/IconX.vue";
import { useGroupStore } from "@/stores/group";
import type { Group } from "@/models/Group";
import { useUserStore } from "@/stores/user";

const query = ref("");

const groupStore = useGroupStore();
const groups = computed<Group[]>(() => groupStore.groups);

const props = defineProps(["modelValue"]);
const emit = defineEmits(["update:modelValue"]);

const highLightedIndex = ref(0);

const input = ref(null);
const groupSuggestions = ref<any[]>([]);
const userSuggestions = ref<any[]>([]);

const isFocused = ref(false);

const selectedItems = computed({
  get() {
    return props.modelValue;
  },
  set(value) {
    emit("update:modelValue", value);
  },
});

const filteredGroups = computed(() => {
  return groups.value.filter((group) => {
    return (
      group.name.toLowerCase().includes(query.value.toLowerCase()) &&
      !selectedItems.value.find(
        (selectedGroup: any) =>
          selectedGroup.id === group.id && selectedGroup.type === "group"
      )
    );
  });
});

onMounted(() => {
  useGroupStore().getGroups();
});

const filteredUsers = computed(() => {
  const me = useUserStore().ME;
  if (!groups.value) return [];
  const users = groups.value
    .flatMap((group: any) => group.users)
    .filter((user: any) => {
      return (
        user.username.toLowerCase().includes(query.value.toLowerCase()) &&
        !selectedItems.value.find(
          (selectedUser: any) =>
            selectedUser.id === user.id && selectedUser.type === "user"
        ) &&
        user.id !== me?.id &&
        !selectedItems.value
          .filter((i2: any) => i2.type === "group")
          .flatMap((g2: any) => g2.users)
          .find((u2: any) => u2.id === user.id)
      );
    });

  return users.filter((user: any, index: number) => {
    return (
      index ===
      users.findIndex((u: any) => {
        return u.id === user.id;
      })
    );
  });
});

function select(item: any, type: string) {
  const itemCopy = { ...item };
  itemCopy.type = type;
  console.log(itemCopy);
  selectedItems.value.push(itemCopy);
}

function scrollToSuggestion(index = 0) {
  if (index < groupSuggestions.value.length) {
    if (groupSuggestions.value[index]) {
      groupSuggestions.value[index].scrollIntoView({
        block: "nearest",
      });
    }
  } else {
    if (userSuggestions.value[index - groupSuggestions.value.length]) {
      userSuggestions.value[
        index - groupSuggestions.value.length
      ].scrollIntoView({
        block: "nearest",
      });
    }
  }
}

function beforeLeave(el: any) {
  const { marginLeft, marginTop, width, height } = window.getComputedStyle(el);
  el.style.left = `${el.offsetLeft - parseFloat(marginLeft)}px`;
  el.style.top = `${el.offsetTop - parseFloat(marginTop)}px`;
  el.style.width = width;
  el.style.height = height;
}
</script>

<template>
  <TransitionGroup
    class="flex items-center flex-wrap border-b-[1px] border-raisin/40 w-full min-h-[3rem]"
    name="list"
    tag="div"
    @before-leave="beforeLeave"
  >
    <div
      v-for="item in selectedItems"
      :key="item.id + item.type"
      class="m-1 bg-gray-200 py-1 px-2 rounded-full flex items-center"
    >
      <div>{{ item.type === "group" ? item.name : item.username }}</div>
      <div class="ml-2">
        <IconX
          class="font-bold text-gray-500 cursor-pointer rounded-full w-5 h-5 font-bold flex items-center justify-center hover:bg-gray-300"
          @click="
            selectedItems = selectedItems.filter(
              (i: any) => i.id !== item.id || i.type !== item.type
            )
          "
        />
      </div>
    </div>
    <div id="input" key="query" class="relative flex-1 min-w-[7em] h-full">
      <input
        ref="input"
        v-model="query"
        class="bg-transparent w-full h-full focus:outline-none"
        @blur="isFocused = false"
        @click="isFocused = true"
        @focus="isFocused = true"
        @input="
          isFocused = true;
          highLightedIndex = 0;
          scrollToSuggestion(highLightedIndex);
        "
        @keydown.esc="isFocused = false"
        @keydown.enter.prevent="
          select(
            highLightedIndex < groupSuggestions.length
              ? filteredGroups[highLightedIndex]
              : filteredUsers[highLightedIndex - groupSuggestions.length],
            highLightedIndex < groupSuggestions.length ? 'group' : 'user'
          );
          highLightedIndex = 0;
          query = '';
        "
        @keydown.up="
          highLightedIndex =
            highLightedIndex === 0
              ? filteredGroups.length + filteredUsers.length - 1
              : highLightedIndex - 1;
          scrollToSuggestion(highLightedIndex);
        "
        @keydown.down="
          highLightedIndex =
            highLightedIndex ===
            filteredGroups.length + filteredUsers.length - 1
              ? 0
              : highLightedIndex + 1;
          scrollToSuggestion(highLightedIndex);
        "
        @keydown.delete="
          query.length === 0 && selectedItems.length > 0
            ? selectedItems.pop()
            : null
        "
      />

      <div
        v-if="
          (filteredGroups.length > 0 || filteredUsers.length > 0) && isFocused
        "
        class="suggestions absolute max-w-[24rem] w-full overflow-scroll max-h-32 rounded-b-md shadow-yonder/10 shadow-lg border-raisin/10 border-2 bg-white"
      >
        <div
          v-for="group in filteredGroups"
          :key="group.id"
          ref="groupSuggestions"
          :class="{
            'bg-gray-200': highLightedIndex === filteredGroups.indexOf(group),
          }"
          class="hover:bg-raisin/10 hover:cursor-pointer"
          @click="
            select(group, 'group');
            highLightedIndex = 0;
            query = '';
          "
          @mousedown.prevent
        >
          <div class="flex items-center">
            <div class="ml-2">{{ group.name }}</div>
          </div>
        </div>
        <div
          v-for="user in filteredUsers"
          :key="user.id"
          ref="userSuggestions"
          :class="{
            'bg-gray-200':
              highLightedIndex ===
              filteredGroups.length + filteredUsers.indexOf(user),
          }"
          class="hover:bg-raisin/10 hover:cursor-pointer"
          @click="
            select(user, 'user');
            highLightedIndex = 0;
            query = '';
          "
          @mousedown.prevent
        >
          <div class="flex items-center">
            <div class="ml-2">{{ user.username }}</div>
          </div>
        </div>
      </div>
    </div>
  </TransitionGroup>
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
