<script lang="ts" setup>
import IconArrow from "@/components/icons/IconArrow.vue";

const emit = defineEmits(["close"]);

defineProps<{
  show: boolean;
  title: string;
}>();
</script>

<template>
  <Transition name="side">
    <aside
      v-if="show"
      class="xl:absolute h-full right-0 overflow-hidden w-[30vw] min-w-[500px] sm:min-w-0 sm:w-screen sm:fixed top-0 right-0 bg-ghost sm:rounded-none shadow-md shadow-yonder/10 z-[20]"
      :class="$attrs.class"
      @close="emit('close')"
    >
      <div class="min-w-[300px] h-full flex flex-col">
        <header class="flex items-center border-yonder border-b-2 p-4">
          <button class="text-2xl text-rebecca p-2 mr-4" @click="emit('close')">
            <IconArrow
              class="h-6 w-6 transform rotate-180 hover:font-bold transition-colors duration-300"
            />
          </button>
          <h1 class="text-2xl font-bold">{{ title }}</h1>
        </header>
        <div class="p-8 flex-1 overflow-y-auto">
          <slot />
        </div>
      </div>
    </aside>
  </Transition>
</template>

<!--suppress CssUnusedSymbol -->
<style scoped>
.side-enter-active,
.side-leave-active {
  transition: all 0.4s ease-in-out;
}

.side-enter-from,
.side-leave-to {
  opacity: 0;
  min-width: 0;
  width: 0;
}

.side-leave-active {
  overflow: hidden;
}
</style>
