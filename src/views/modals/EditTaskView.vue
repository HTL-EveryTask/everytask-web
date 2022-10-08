<script lang="ts" setup>
defineProps<{
  id: number;
}>();
</script>

<template v-slot="scope">
  <h1>Edit task {{ id }}</h1>
  <button @click="$parent.$emit('close')">Close</button>
</template>
<style scoped></style>
