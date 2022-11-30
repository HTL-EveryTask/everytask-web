<script lang="ts" setup>
import { ref } from "vue";
import IconEye from "@/components/icons/IconEye.vue";
import IconEyeOff from "@/components/icons/IconEyeOff.vue";

defineProps(["modelValue"]);
defineEmits(["update:modelValue"]);

const showPassword = ref(false);
</script>

<template>
  <div class="input-wrapper relative">
    <input
      :type="showPassword ? 'text' : 'password'"
      :value="modelValue"
      v-bind="$attrs"
      @input="$emit('update:modelValue', $event.target.value)"
    />
  </div>
  <button
    @click="showPassword = !showPassword"
    class="absolute right-2 top-1/2 transform -translate-y-1/2 text-raisinA"
    type="button"
  >
    <IconEyeOff v-if="showPassword" class="w-5 h-5" />
    <IconEye v-else class="w-5 h-5" />
  </button>
</template>

<style scoped></style>
