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

const emit = defineEmits(["close"]);

const groupStore = useGroupStore();

const stepCounter = ref(1);
const change = ref(0);

const name = ref("");
const description = ref("");

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
  const response = await groupStore.createGroup(name.value, description.value);
  const data = await response.json();
  createdGroup.value = data.group;
  console.log(createdGroup.value);
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
    @submit.prevent="createGroup"
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
              type="submit"
            >
              Create Group
            </LoadingButton>
          </div>
        </div>
      </section>

      <section v-else-if="stepCounter === 2">
        <h2 class="text-xl text-center">
          Invite your Colleagues to join {{ name }}
        </h2>
        <GenerateInviteView :group="createdGroup" />
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
