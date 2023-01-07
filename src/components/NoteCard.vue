<script lang="ts" setup>
import type { Note } from "@/models/Note";
import { onMounted, ref, watch } from "vue";
import IconUser from "@/components/icons/IconUser.vue";
import IconDotsVertical from "@/components/icons/IconDotsVertical.vue";
import ContextMenu from "@imengyu/vue3-context-menu";
import { useUserStore } from "@/stores/user";
import { useTaskStore } from "@/stores/task";
import LoadingButton from "@/components/LoadingButton.vue";

const props = defineProps<{
  note?: Note;
  taskId: number;
}>();

const emit = defineEmits(["update"]);

const userStore = useUserStore();
const taskStore = useTaskStore();

const loading = ref(false);
const editing = ref(!props.note);

const text = ref(props.note?.note || "");
const picture = ref(
  props.note?.user.picture || userStore.ME?.profile_picture || ""
);
const username = ref(props.note?.user.username || userStore.ME?.username || "");

onMounted(async () => {
  // watch userStore.ME for changes
  watch(
    () => userStore.ME,
    (me) => {
      if (me) {
        if (!props.note) {
          picture.value = me.profile_picture || "";
          username.value = me.username;
        }
      }
    }
  );
});

async function save() {
  await taskStore.addOrReplaceNote(props.taskId, text.value);
  editing.value = false;
  emit("update");
}

async function cancel() {
  editing.value = false;
  text.value = props.note?.note || "";
}

function onContextMenu(e: MouseEvent) {
  e.preventDefault();
  ContextMenu.showContextMenu({
    x: e.clientX,
    y: e.clientY,
    items: [
      {
        label: "Edit",
        onClick: () => {
          editing.value = true;
        },
      },
      {
        label: "Delete",
        onClick: async () => {
          await taskStore.deleteNote(props.taskId);
          emit("update");
        },
      },
    ],
    customClass: "bg-white shadow-md shadow-yonder/10",
  });
}

function onInput(e: any) {
  if (text.value.length < 1) {
    e.target.style.height = "auto";
  }
  e.target.style.height = e.target.scrollHeight + "px";
}
</script>

<template>
  <div
    :class="note ? 'bg-white' : 'bg-ghost border-2 border-yonder/30'"
    class="rounded-lg shadow-md shadow-yonder/10 flex flex-col w-full"
    @contextmenu.prevent="onContextMenu"
  >
    <div class="flex items-center justify-between px-4 py-3">
      <div>
        <div v-if="picture" class="w-10 h-10 rounded-full overflow-hidden">
          <img
            :src="`data:image/png;base64,${picture}`"
            alt="Profile picture"
            class="w-full h-full object-cover"
          />
        </div>
        <IconUser v-else class="w-10 h-10 text-gray-400" />
      </div>
      <span class="ml-4 text-raisin/70 text-md">{{ username }}</span>
      <div
        class="ml-auto rounded-full hover:bg-yonder/10 p-1 active:bg-yonder/20"
      >
        <IconDotsVertical
          v-if="note && !editing"
          class="w-5 h-5 text-gray-400"
          @click="onContextMenu"
        />
      </div>
    </div>
    <div :class="!editing ? 'pb-8' : 'pb-3'" class="px-4 py-3">
      <textarea
        v-model="text"
        :class="editing ? 'border-b-[1px] border-gray-300' : ''"
        :readonly="!editing"
        class="w-full bg-transparent focus:outline-none resize-none max-h-[24rem]"
        placeholder="Write a note..."
        rows="1"
        @input="onInput($event)"
      ></textarea>
      <Transition name="expand">
        <div
          v-if="editing && text.length > 0"
          class="flex justify-end gap-2 h-[3rem]"
        >
          <button
            v-if="note"
            class="bg-raisin/100 text-white rounded-md px-4 py-2 mt-2"
            type="button"
            @click="cancel"
          >
            Cancel
          </button>
          <LoadingButton
            :loading="loading"
            class="bg-raisin/100 text-white rounded-md px-4 py-2 mt-2"
            type="button"
            @click="save"
          >
            {{ note ? "Save" : "Publish" }}
          </LoadingButton>
        </div>
      </Transition>
    </div>
  </div>
</template>

<style scoped>
.expand-enter-active,
.expand-leave-active {
  transition: all 0.5s ease;
}

.expand-enter-from,
.expand-leave-to {
  opacity: 0;
  height: 0;
}

.expand-leave-active {
  overflow: hidden;
}
</style>
