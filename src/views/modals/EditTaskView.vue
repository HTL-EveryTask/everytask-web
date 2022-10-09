<script lang="ts" setup>
defineProps<{
  id: number;
}>();

defineEmits(["close"]);
</script>

<template>
  <div>
    <h1>Edit task {{ id }}</h1>
    <button @click="$emit('close')">Close</button>
  </div>
</template>
<style scoped></style>
