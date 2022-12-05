<script lang="ts" setup>
import { computed, ref } from "vue";
import IconEye from "@/components/icons/IconEye.vue";
import IconEyeOff from "@/components/icons/IconEyeOff.vue";

const props = defineProps(["modelValue"]);
const emit = defineEmits(["update:modelValue"]);

const value = computed({
  get() {
    return props.modelValue;
  },
  set(value) {
    emit("update:modelValue", value);
  },
});
const showPassword = ref(false);
</script>

<template>
  <div class="input-wrapper relative">
    <input
      :type="showPassword ? 'text' : 'password'"
      v-model="value"
      v-bind="$attrs"
    />
    <button
      class="absolute right-2 top-1/2 transform -translate-y-1/2 text-raisinA"
      type="button"
      @click="showPassword = !showPassword"
    >
      <IconEyeOff v-if="showPassword" class="w-5 h-5" />
      <IconEye v-else class="w-5 h-5" />
    </button>
  </div>
</template>

<style scoped></style>
