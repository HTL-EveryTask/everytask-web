<script lang="ts" setup>
import { maxLength, required } from "@vuelidate/validators";
import { ref } from "vue";
import useVuelidate from "@vuelidate/core";
import InputField from "@/components/InputField.vue";
import gsap from "gsap";
import IconPlus from "@/components/icons/IconPlus.vue";
import LoadingButton from "@/components/LoadingButton.vue";
import { useGroupStore } from "@/stores/group";
import type { Group } from "@/models/Group";
import GenerateInviteView from "@/views/group/GenerateInviteView.vue";
import type { User } from "@/models/User";
import MemberSelector from "@/components/MemberSelector.vue";
import IconCheck from "@/components/icons/IconCheck.vue";
import { useToastStore } from "@/stores/toast";
import IconUpload from "@/components/icons/IconUpload.vue";

const emit = defineEmits(["close"]);

const groupStore = useGroupStore();

const stepCounter = ref(1);
const change = ref(0);

const name = ref("");
const description = ref("");
const uploadedPictureData = ref("");

const selectedUsers = ref<User[]>([]);

const createdGroup = ref<Group | undefined>();

function stepForward() {
  change.value = 1;
  stepCounter.value++;
}

function stepBackward() {
  change.value = -1;
  stepCounter.value--;
}

const loading = ref(false);

async function createGroup() {
  loading.value = true;
  let response = await groupStore.createGroup(
    name.value,
    description.value,
    uploadedPictureData.value
  );
  const data = await response.json();
  createdGroup.value = data.group;
  console.log(createdGroup.value);
  if (createdGroup.value) {
    response = await groupStore.addUsersToGroup(
      createdGroup.value.id,
      selectedUsers.value.map((user) => user.id)
    );
    if (!response.ok) {
      useToastStore().addToast({
        title: "Error",
        message: "Failed to add users to the group",
        type: "error",
      });
    }
  }
  await groupStore.getGroups();

  loading.value = false;
  stepForward();
}

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

function onSectionEnter(element: any, done: any) {
  gsap.fromTo(
    element,
    { x: change.value * 50, opacity: 0 },
    {
      x: 0,
      opacity: 1,
      duration: 0.3,
      onComplete: done,
    }
  );
}

function uploadPicture() {
  const input = document.createElement("input");
  input.type = "file";
  input.accept = "image/*";
  input.onchange = async (e) => {
    const file = (e.target as HTMLInputElement).files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = async (e) => {
        const data = e.target?.result;
        if (data) {
          uploadedPictureData.value = data.toString();
        }
      };
      reader.readAsDataURL(file);
    }
  };
  input.click();
}

function onSectionLeave(element: any, done: any) {
  gsap.fromTo(
    element,
    { x: 0, opacity: 1 },
    {
      x: -change.value * 50,
      opacity: 0,
      duration: 0.3,
      onComplete: done,
    }
  );
}
</script>

<template>
  <form
    class="w-full h-[30rem] min-h-[20rem] min-w-[600px] sm:min-w-0 px-4 overflow-x-hidden"
    @submit.prevent
  >
    <Transition
      mode="out-in"
      name="slide"
      @enter="onSectionEnter"
      @leave="onSectionLeave"
    >
      <section v-if="stepCounter === 1" class="h-full flex flex-col">
        <div class="flex flex-col h-[25rem]">
          <div class="flex sm:flex-col items-center gap-8">
            <div
              class="w-36 h-36 flex items-center justify-center rounded-full bg-ghost relative"
              @click="uploadPicture"
            >
              <div
                v-if="uploadedPictureData"
                class="absolute inset-0 bg-black bg-opacity-40 rounded-full opacity-0 hover:opacity-100 transition-opacity duration-200"
              >
                <div
                  class="flex items-center justify-center h-full flex flex-col text-white"
                >
                  <IconUpload class="w-12 h-12" />
                </div>
              </div>
              <img
                v-if="uploadedPictureData"
                :src="uploadedPictureData"
                class="w-full h-full object-cover rounded-full"
                alt="Group picture"
              />
              <div
                v-else
                class="w-full h-full hover:bg-yonder/5 flex items-center justify-center rounded-full text-raisin/50 hover:text-raisin/80 transition-colors duration-200"
              >
                <IconPlus class="w-1/2 h-1/2" />
              </div>
            </div>
            <div class="flex-1 flex flex-col w-full">
              <InputField id="name" :validation="v$.name" label="Name">
                <input id="name" v-model="name" type="text" />
                <template v-slot:right>
                  <span class="text-gray-500 text-sm">
                    {{ name.length }}/32
                  </span>
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
            </div>
          </div>
        </div>
        <div class="mt-auto">
          <LoadingButton
            :disabled="v$.$invalid"
            :loading="loading"
            class="btn-primary block ml-auto"
            type="button"
            @click="stepForward"
          >
            Next
          </LoadingButton>
        </div>
      </section>

      <section v-else-if="stepCounter === 2" class="h-full flex flex-col">
        <h2 class="text-xl">Add Users to {{ name }}</h2>
        <div class="flex-1 py-4">
          <MemberSelector
            v-model="selectedUsers"
            :pool="groupStore.getAllUsers()"
            class="h-full"
          />
        </div>
        <div class="flex justify-between mt-auto shrink-0">
          <button class="btn-secondary" type="button" @click="stepBackward">
            Back
          </button>
          <LoadingButton
            :class="{ 'btn-light': selectedUsers.length === 0 }"
            :disabled="loading"
            :loading="loading"
            class="btn-primary"
            type="button"
            @click="createGroup()"
          >
            {{ selectedUsers.length > 0 ? "Finish" : "Skip" }}
          </LoadingButton>
        </div>
      </section>

      <section
        v-else-if="stepCounter === 3 && createdGroup"
        class="h-full flex flex-col"
      >
        <h2 class="text-xl">Invite your Colleagues to join {{ name }}</h2>
        <GenerateInviteView :group="createdGroup" class="py-4" />
        <div class="flex justify-between mt-auto">
          <button
            class="btn-primary ml-auto"
            type="button"
            @click="stepForward"
          >
            Next
          </button>
        </div>
      </section>
      <section v-else-if="stepCounter === 4" class="h-full flex flex-col">
        <div class="h-[20rem] flex justify-center items-center">
          <div>
            <IconCheck
              class="w-24 h-24 text-green-500 mx-auto p-2 rounded-full border-4 border-green-500"
            />
            <h2 class="text-xl text-center m-4">
              {{ name }} is now fully set up
            </h2>
          </div>
        </div>
        <div class="flex justify-between mt-auto">
          <button class="btn-secondary" type="button" @click="stepBackward">
            Back
          </button>
          <button class="btn-primary" type="button" @click="emit('close')">
            Close
          </button>
        </div>
      </section>
    </Transition>
  </form>
</template>
<style scoped></style>
