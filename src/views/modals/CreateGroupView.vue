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

const emit = defineEmits(["close"]);

const groupStore = useGroupStore();

const stepCounter = ref(1);
const change = ref(0);

const name = ref("");
const description = ref("");

const createdGroup = ref<Group | undefined>();

const inviteLink = ref("");

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
  const response = await groupStore.createGroup(name.value, description.value);
  // get json object from response and set it to createdGroup
  const data = await response.json();
  createdGroup.value = data.id;
  console.log(createdGroup.value);

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

async function requestInviteLink() {
  loading.value = true;
  if (createdGroup.value) {
    const response = await groupStore.requestInvite(createdGroup.value.id);
    inviteLink.value = await response.json().then((data) => data.key);
    inviteLink.value = `${window.location.origin}/invite/${inviteLink.value}`;
  }
  loading.value = false;
}

function copyInviteLink() {
  navigator.clipboard.writeText(inviteLink.value);
}

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
    class="w-full min-h-[20em] min-w-[600px] sm:min-w-0"
    @submit.prevent="onSubmit"
  >
    <Transition
      mode="out-in"
      name="slide"
      @enter="onSectionEnter"
      @leave="onSectionLeave"
    >
      <section v-if="stepCounter === 1">
        <div class="flex flex-col">
          <div class="flex sm:flex-col items-center gap-8">
            <div
              class="w-36 h-36 flex items-center justify-center rounded-full bg-ghost"
            >
              <IconPlus class="w-1/2 h-1/2 text-raisin/50" />
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
          <div>
            <LoadingButton
              :disabled="v$.$invalid"
              :loading="loading"
              class="btn-primary block ml-auto mt-4"
              type="button"
              @click="createGroup"
            >
              Create Group
            </LoadingButton>
          </div>
        </div>
      </section>

      <section v-else-if="stepCounter === 2">
        <h2>Invite your Colleagues to join {{ name }}</h2>
        <button
          class="btn-primary block mt-4"
          type="button"
          @click="requestInviteLink"
        >
          Generate Invite Link
        </button>

        <div class="flex w-full input-field my-4">
          <input :value="inviteLink" class="flex-1" readonly type="text" />
          <button class="btn-primary ml-2" @click="copyInviteLink">Copy</button>
        </div>

        <LoadingButton
          :loading="loading"
          class="bg-gray-200 text-gray-700 rounded-md px-4 py-2"
          type="button"
          @click="emit('close')"
        >
          Finish
        </LoadingButton>
      </section>
    </Transition>
  </form>
</template>
<style scoped></style>
