<script lang="ts" setup>
import IconGroup from "@/components/icons/IconGroup.vue";
import type { Group } from "@/models/Group";

const props = defineProps<{
  group: Group;
}>();
</script>

<template>
  <div class="p-4 flex items-center rounded-full min-w-0">
    <div
      class="flex items-center rounded-full bg-ghost w-12 h-12 flex justify-center items-center"
    >
      <img
        v-if="group.picture"
        :src="`data:image/png;base64,${group.picture}`"
        class="w-full h-full rounded-full object-cover"
        alt="Group Picture"
      />
      <IconGroup v-else class="w-6 h-6" />
    </div>
    <div
      class="flex flex-col ml-4 flex-1 overflow-hidden whitespace-nowrap overflow-ellipsis min-w-0 inline-block w-0"
    >
      <div class="text-lg font-bold">{{ props.group.name }}</div>
      <span
        class="overflow-hidden overflow-ellipsis whitespace-nowrap text-sm text-gray-500"
      >
        {{ props.group.description }}
      </span>
    </div>
    <div
      class="ml-2 sm:ml-0 flex items-center box-border border-l-[1px] border-raisin/40 sm:border-none flex-1 sm:flex-none text-sm text-gray-500 whitespace-nowrap pl-2 self-stretch"
    >
      <div>
        <div class="flex items-center">
          <IconGroup class="w-[1.2em] h-[1.2em] mr-2 text-raisin/50" />
          <span class="text-sm text-gray-500">{{
            group.users.length || 0
          }}</span>
        </div>
        <span
          v-for="user in group.users"
          :key="user.id"
          class="text-sm text-gray-500 sm:hidden"
        >
          {{ user.username }}
          <span v-if="user !== group.users[group.users.length - 1]">, </span>
        </span>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
