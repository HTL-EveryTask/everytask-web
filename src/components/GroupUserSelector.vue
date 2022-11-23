<script lang="ts" setup>
import { computed, ref } from "vue";
import IconX from "@/components/icons/IconX.vue";
import { useGroupStore } from "@/stores/group";
import type { Group } from "@/models/Group";

const query = ref("");

const groupStore = useGroupStore();
const groups = computed<Group[]>(() => groupStore.groups);

const props = defineProps(["modelValue"]);
const emit = defineEmits(["update:modelValue"]);

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

const filteredUsers = computed(() => {
  if (!groups.value) return [];
  const users = groups.value
    .flatMap((group: any) => group.users)
    .filter((user: any) => {
      return (
        user.username.toLowerCase().includes(query.value.toLowerCase()) &&
        !selectedItems.value.find(
          (selectedUser: any) =>
            selectedUser.id === user.id && selectedUser.type === "user"
        )
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
    class="flex items-center flex-wrap border-b-2 border-raisin/40 w-full h-12"
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
              (i) => i.id !== item.id || i.type !== item.type
            )
          "
        />
      </div>
    </div>
    <div class="relative flex-1 min-w-[7em] h-full">
      <input
        v-model="query"
        class="w-full h-full"
        @keydown.enter="
          filteredGroups.length > 0
            ? select(filteredGroups[0], 'group')
            : filteredUsers.length > 0
            ? select(filteredUsers[0], 'user')
            : null
        "
      />

      <div
        v-if="filteredGroups.length > 0 || filteredUsers.length > 0"
        class="suggestions absolute w-96 overflow-scroll max-h-32 rounded-b-md shadow-yonder/10 shadow-lg border-raisin/10 border-2"
      >
        <div
          v-for="group in filteredGroups"
          :key="group.id"
          @click="select(group, 'group')"
        >
          <div class="flex items-center">
            <div class="ml-2">{{ group.name }}</div>
          </div>
        </div>
        <div
          v-for="user in filteredUsers"
          :key="user.id"
          @click="select(user, 'user')"
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
.list-leave-active {
  position: absolute;
}
</style>
