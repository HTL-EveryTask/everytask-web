<script lang="ts" setup>
import IconGroup from "@/components/icons/IconGroup.vue";

const props = defineProps<{
  // TODO: Make type safe
  group: any;
}>();
</script>

<template>
  <div class="min-w-[12em] p-4 flex items-center rounded-xl">
    <div class="flex items-center rounded-full bg-ghost p-2">
      <IconGroup class="w-8 h-8" />
    </div>
    <div class="flex flex-col ml-4 flex-1 min-w-0">
      <div class="text-lg font-bold">{{ props.group.name }}</div>
      <span
        class="overflow-hidden overflow-ellipsis whitespace-nowrap text-sm text-gray-500"
      >
        {{ props.group.description }}
      </span>
    </div>
    <div class="flex items-center ml-auto">
      <IconGroup class="w-[1.2em] h-[1.2em] m-2 text-raisin/50" />
      <span class="text-sm text-gray-500">{{
        props.group.memberIds.length
      }}</span>
    </div>
  </div>
</template>

<style scoped></style>
