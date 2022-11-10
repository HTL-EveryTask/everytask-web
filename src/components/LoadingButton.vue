<template>
  <div class="flex items-center">
    <button class="relative" v-bind="$attrs">
      <SpinnerIcon
        v-if="loading"
        class="absolute w-5 h-5 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
      />
      <span :class="{ 'opacity-0': loading }"><slot /></span>
    </button>
  </div>
</template>

<script lang="ts" setup>
import SpinnerIcon from "@/components/icons/SpinnerIcon.vue";

defineProps({
  loading: {
    type: Boolean,
    required: true,
  },
});
</script>

<script lang="ts">
export default {
  inheritAttrs: false,
};
</script>
<style scoped></style>
