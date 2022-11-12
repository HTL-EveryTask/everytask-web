<script lang="ts" setup>
import { computed, ref } from "vue";

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

const mockUsers = [
  {
    id: "1",
    name: "Usedddr 1",
  },
  {
    id: "2",
    name: "User 2",
  },
  {
    id: "3",
    name: "User 3",
  },
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
  {
    id: "10",
    name: "User 10",
  },
  {
    id: "11",
    name: "User 11",
  },
  {
    id: "12",
    name: "User 12",
  },
  {
    id: "13",
    name: "User 13",
  },
  {
    id: "14",
    name: "User 14",
  },
  {
    id: "15",
    name: "User 15",
  },
  {
    id: "16",
    name: "User 16",
  },
  {
    id: "17",
    name: "User 17",
  },
  {
    id: "18",
    name: "User 18",
  },
  {
    id: "19",
    name: "User 19",
  },
  {
    id: "20",
    name: "User 20",
  },
  {
    id: "21",
    name: "User 21",
  },
  {
    id: "22",
    name: "User 22",
  },
  {
    id: "23",
    name: "User 23",
  },
  {
    id: "24",
    name: "User 24",
  },
  {
    id: "25",
    name: "User 25",
  },
  {
    id: "26",
    name: "User 26",
  },
  {
    id: "27",
    name: "User 27",
  },
  {
    id: "28",
    name: "User 28",
  },
  {
    id: "29",
    name: "User 29",
  },
  {
    id: "30",
    name: "User 30",
  },
  {
    id: "31",
    name: "User 31",
  },
  {
    id: "32",
    name: "User 32",
  },
  {
    id: "33",
    name: "User 33",
  },
  {
    id: "34",
    name: "User 34",
  },
  {
    id: "35",
    name: "User 35",
  },
  {
    id: "36",
    name: "User 36",
  },
  {
    id: "37",
    name: "User 37",
  },
];

// filter groups by query and not in selected array
const filteredGroups = computed(() => {
  return mockGroups.filter((group) => {
    return (
      group.name.toLowerCase().includes(query.value.toLowerCase()) &&
      !selected.value.find(
        (selectedGroup) =>
          selectedGroup.id === group.id && selectedGroup.type === "group"
      )
    );
  });
});

const filteredUsers = computed(() => {
  return mockUsers.filter((user) => {
    return (
      user.name.toLowerCase().includes(query.value.toLowerCase()) &&
      !selected.value.find(
        (selectedUser) =>
          selectedUser.id === user.id && selectedUser.type === "user"
      )
    );
  });
});

const selected = ref<any[]>([]);

function select(item: any, type: string) {
  const itemCopy = { ...item };
  itemCopy.type = type;
  console.log(itemCopy);
  selected.value.push(itemCopy);
}

function beforeLeave(el: any) {
  const { marginLeft, marginTop, width, height } = window.getComputedStyle(el);
  el.style.left = `${el.offsetLeft - parseFloat(marginLeft, 10)}px`;
  el.style.top = `${el.offsetTop - parseFloat(marginTop, 10)}px`;
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
      v-for="item in selected"
      :key="item.id + item.type"
      class="m-1 bg-gray-200 py-1 px-2 rounded-full flex items-center"
    >
      <div>{{ item.name }}</div>
      <div class="ml-2">
        <div
          class="font-bold text-gray-500 cursor-pointer hover:text-gray-700 border-[2px] border-gray-400 hover:border-gray-700 rounded-full w-4 h-4 font-bold flex items-center justify-center hover:bg-gray-300"
          @click="
            selected = selected.filter(
              (i) => i.id !== item.id || i.type !== item.type
            )
          "
        >
          ×
        </div>
      </div>
    </div>
    <div class="relative">
      <input v-model="query" class="border-none" />

      <div
        class="suggestions absolute w-full bg-ghost overflow-scroll max-h-24 rounded-b-lg shadow-lg"
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
