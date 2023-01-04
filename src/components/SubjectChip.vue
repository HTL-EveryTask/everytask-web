<script lang="ts" setup>
import type { Subject } from "@/models/Subject";

defineProps<{
  subject: Subject;
}>();
</script>

<template>
  <div
    class="text-xs text-gray-500 p-1 min-w-[3rem] text-center rounded-full overflow-x-hidden overflow-ellipsis font-semibold"
    :style="{
      backgroundColor: `${subject.back_color}70`,
      color: `${subject.fore_color}`,
    }"
    :title="subject?.long_name"
  >
    {{ subject?.name }}
  </div>
</template>

<style scoped></style>
