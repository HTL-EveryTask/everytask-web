<script lang="ts" setup>
import { computed, ref } from "vue";
import IconX from "@/components/icons/IconX.vue";

const query = ref("");

const mockGroups = [
  {
    id: "1",
    name: "Group 1",
    users: [
      {
        id: "1",
        name: "User 1",
      },
      {
        id: "2",
        name: "User 2",
      },
      {
        id: "3",
        name: "User 3",
      },
    ],
  },
  {
    id: "2",
    name: "Group 2",
    users: [
      {
        id: "4",
        name: "User 4",
      },
      {
        id: "5",
        name: "User 5",
      },
      {
        id: "6",
        name: "User 6",
      },
    ],
  },
  {
    id: "3",
    name: "Group 3",
    users: [
      {
        id: "7",
        name: "User 7",
      },
      {
        id: "8",
        name: "User 8",
      },
      {
        id: "9",
        name: "User 9",
      },
    ],
  },
];

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
  return mockGroups.filter((group) => {
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
  if (!mockGroups) return [];
  return mockGroups
    .flatMap((group: any) => group.users)
    .filter((user: any) => {
      return (
        user.name.toLowerCase().includes(query.value.toLowerCase()) &&
        !selectedItems.value.find(
          (selectedUser: any) =>
            selectedUser.id === user.id && selectedUser.type === "user"
        )
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
    class="flex items-center flex-wrap border-2 border-indigo-200 w-[60em]"
    name="list"
    tag="div"
    @before-leave="beforeLeave"
  >
    <div
      v-for="item in selectedItems"
      :key="item.id + item.type"
      class="m-1 bg-gray-200 py-1 px-2 rounded-full flex items-center"
    >
      <div>{{ item.name }}</div>
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
    <div class="relative flex-1 min-w-[7em]">
      <input v-model="query" />

      <div
        class="suggestions absolute w-96 bg-ghost overflow-scroll max-h-32 rounded-b-md shadow-yonder/10 shadow-lg"
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
            <div class="ml-2">{{ user.name }}</div>
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
