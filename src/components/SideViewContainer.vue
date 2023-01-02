<script lang="ts" setup>
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
      :class="$attrs.class"
      class="xl:absolute h-full right-0 overflow-hidden w-[30vw] min-w-[550px] sm:min-w-0 sm:w-screen sm:fixed top-0 right-0 bg-ghost sm:rounded-none shadow-md shadow-yonder/10 z-[20]"
      @close="emit('close')"
    >
      <div class="min-w-[300px] h-full flex flex-col">
        <div class="flex-1 overflow-y-auto">
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
