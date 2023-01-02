<script lang="ts" setup>
import type { Note } from "@/models/Note";
import { ref } from "vue";
import IconUser from "@/components/icons/IconUser.vue";
import IconDotsVertical from "@/components/icons/IconDotsVertical.vue";

const props = defineProps<{
  note: Note;
}>();

const text = ref(props.note.text);
</script>

<template>
  <div
    class="bg-white rounded-lg shadow-md shadow-yonder/10 flex flex-col w-full"
  >
    <div class="flex items-center justify-between px-4 py-3">
      <div>
        <div
          v-if="note.user.profile_picture"
          class="w-10 h-10 rounded-full overflow-hidden"
        >
          <img
            :src="note.user.profile_picture"
            alt="Profile picture"
            class="w-full h-full object-cover"
          />
        </div>
        <IconUser v-else class="w-10 h-10 text-gray-400" />
      </div>
      <span class="ml-4 text-raisin/70 text-md">{{ note.user.username }}</span>
      <div
        class="ml-auto rounded-full hover:bg-yonder/10 p-1 active:bg-yonder/20"
      >
        <IconDotsVertical class="w-5 h-5 text-gray-400" />
      </div>
    </div>
    <div class="px-4 py-3">
      <textarea
        v-model="text"
        class="w-full resize-none bg-transparent border-none focus:outline-none"
        placeholder="Write a note..."
      ></textarea>
    </div>
  </div>
</template>

<style scoped></style>
