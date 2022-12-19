<script lang="ts" setup>
import { computed, ref } from "vue";
import IconX from "@/components/icons/IconX.vue";

const query = ref("");
const props = defineProps({
  modelValue: {
    type: Array,
    required: true,
  },
  maxChars: {
    type: Number,
    default: 20,
  },
});
const emit = defineEmits(["update:modelValue"]);

const tags = computed<string[]>({
  get: () => props.modelValue as string[],
  set: (value) => emit("update:modelValue", value),
});

function beforeLeave(el: any) {
  const { marginLeft, marginTop, width, height } = window.getComputedStyle(el);
  el.style.left = `${el.offsetLeft - parseFloat(marginLeft)}px`;
  el.style.top = `${el.offsetTop - parseFloat(marginTop)}px`;
  el.style.width = width;
  el.style.height = height;
}

function addTag() {
  if (
    query.value.length > 0 &&
    !tags.value.includes(query.value) &&
    query.value.length <= props.maxChars
  ) {
    tags.value.push(query.value);
    query.value = "";
  }
}
</script>

<template>
  <TransitionGroup
    class="flex items-center flex-wrap border-b-[1px] border-raisin/40 w-full min-h-[3rem]"
    name="list"
    tag="div"
    @before-leave="beforeLeave"
  >
    <div
      v-for="tag in modelValue"
      :key="tag"
      class="m-1 bg-gray-200 py-1 px-2 rounded-full flex items-center"
    >
      <div>{{ tag }}</div>
      <div class="ml-2">
        <IconX
          class="font-bold text-gray-500 cursor-pointer rounded-full w-5 h-5 font-bold flex items-center justify-center hover:bg-gray-300"
          @click="tags = tags.filter((t) => t !== tag)"
        />
      </div>
    </div>
    <div
      id="input"
      key="query"
      class="relative flex-1 min-w-[7em] h-full flex items-center"
    >
      <input
        ref="input"
        v-model="query"
        class="bg-transparent w-full h-full focus:outline-none"
        @keydown.enter.prevent="addTag()"
        @keydown.delete="
          query.length === 0 && tags.length > 0 ? tags.pop() : null
        "
      />
      <span
        v-if="query.length > 0"
        :class="{ 'text-red-500': query.length > maxChars }"
        class="absolute right-0 m-2 text-raisin/50 transition-colors duration-300"
      >
        {{ query.length }}/{{ props.maxChars }}
      </span>
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
.list-leave-active:not(#input) {
  position: absolute;
}
</style>
