<script lang="ts" setup>
import { maxLength, required } from "@vuelidate/validators";
import { onMounted, ref, watch } from "vue";
import useVuelidate from "@vuelidate/core";
import ModalContainer from "@/components/ModalContainer.vue";
import type { Group } from "@/models/Group";
import InputField from "@/components/InputField.vue";
import LoadingButton from "@/components/LoadingButton.vue";
import IconSpinner from "@/components/icons/IconSpinner.vue";
import { useGroupStore } from "@/stores/group";

const emit = defineEmits(["close"]);
const props = defineProps<{
  id?: number;
}>();

const groupStore = useGroupStore();

const group = ref<Group | undefined>();

const name = ref("");
const description = ref("");

onMounted(async () => {
  watch(
    () => props.id,
    async (id) => {
      if (id) {
        loading.value = true;
        group.value = await groupStore.getGroup(id);
        name.value = group.value?.name || "";
        description.value = group.value?.description || "";
        loading.value = false;
      }
    },
    { immediate: true }
  );
});

const loading = ref(false);
const loadingDelete = ref(false);

let showDeleteModal = ref(false);

const rules = {
  name: {
    required,
    maxLength: maxLength(32),
  },
  description: {
    maxLength: maxLength(300),
  },
};

const v$ = useVuelidate(
  rules,
  { name: name, description },
  { $autoDirty: true }
);

async function onSubmit() {
  loading.value = true;
  const newGroup: Group = {
    id: group.value?.id || 0,
    name: name.value,
    description: description.value,
  };
  if (group.value) {
    await groupStore.updateGroup(newGroup);
  }
  loading.value = false;
  await groupStore.getGroups();

  emit("close");
}

async function deleteGroup() {
  loadingDelete.value = true;
  if (group.value) {
    await groupStore.deleteGroup(group.value.id);
    await groupStore.getGroups;
  }
  loadingDelete.value = false;
  showDeleteModal.value = false;
  emit("close");
}
</script>

<template>
  <Transition name="fade">
    <div v-if="!loading">
      <form class="w-full" @submit.prevent="onSubmit">
        <InputField id="name" :validation="v$.name" label="Name">
          <input id="name" v-model="name" class="w-full" type="text" />
          <template v-slot:right>
            <span class="text-gray-500 text-sm"> {{ name.length }}/32 </span>
          </template>
        </InputField>

        <InputField
          id="description"
          :validation="v$.description"
          label="Description"
        >
          <textarea
            id="description"
            v-model="description"
            class="w-full"
            rows="3"
          ></textarea>
          <template v-slot:right>
            <span class="text-gray-500 text-sm">
              {{ description.length }}/300
            </span>
          </template>
        </InputField>

        <LoadingButton
          :disabled="v$.$invalid"
          :loading="loading"
          class="btn-primary mt-4"
          type="submit"
        >
          Update
        </LoadingButton>
      </form>

      <button v-if="group" class="btn-red" @click="showDeleteModal = true">
        Delete Group
      </button>

      <ModalContainer
        :show="showDeleteModal"
        class="bg-ghost"
        headless
        @close="showDeleteModal = false"
      >
        <div class="flex flex-col items-center">
          <p class="whitespace-nowrap text-center my-2 font-bold px-4">
            Are you sure you want to delete this group?
          </p>
          <div class="flex w-full gap-4 justify-center">
            <LoadingButton
              :loading="loadingDelete"
              class="btn-red"
              @click="deleteGroup"
              >Delete
            </LoadingButton>
            <button class="btn-primary" @click="showDeleteModal = false">
              Cancel
            </button>
          </div>
        </div>
      </ModalContainer>

      <button class="btn-red" @click="showDeleteModal = true">
        Leave Group
      </button>

      <ModalContainer
        :show="showDeleteModal"
        class="bg-ghost"
        headless
        @close="showDeleteModal = false"
      >
        <div class="flex flex-col items-center">
          <p class="whitespace-nowrap text-center my-2 font-bold px-4">
            Are you sure you want to leave this group?
          </p>
          <div class="flex w-full gap-4 justify-center">
            <LoadingButton
              :loading="loadingDelete"
              class="btn-red"
              @click="deleteGroup"
              >Leave
            </LoadingButton>
            <button class="btn-primary" @click="showDeleteModal = false">
              Cancel
            </button>
          </div>
        </div>
      </ModalContainer>
    </div>
    <IconSpinner
      v-else
      class="w-16 h-16 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-raisin/50"
    />
  </Transition>
</template>

<!--suppress CssUnusedSymbol -->
<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s;
}

.fade-enter,
.fade-leave-to {
  opacity: 0;
}
</style>
