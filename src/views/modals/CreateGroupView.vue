<script lang="ts" setup>
import { maxLength, required } from "@vuelidate/validators";
import { ref } from "vue";
import { useAuthenticateStore } from "@/stores/auth";
import useVuelidate from "@vuelidate/core";
import InputField from "@/components/InputField.vue";
import gsap from "gsap";

const emit = defineEmits(["close"]);

const authenticateStore = useAuthenticateStore();

const stepCounter = ref(1);
const change = ref(0);

function stepForward() {
  change.value = 1;
  stepCounter.value++;
}

function stepBackward() {
  change.value = -1;
  stepCounter.value--;
}

const title = ref("");
const description = ref("");
const memberIds = ref<string[]>([]);

const loading = ref(false);

const rules = {
  title: {
    required,
    maxLength: maxLength(32),
  },
  description: {
    maxLength: maxLength(300),
  },
};

const v$ = useVuelidate(rules, { title, description }, { $autoDirty: true });

async function onSubmit() {}

function onSectionEnter(element: any, done: any) {
  gsap.fromTo(
    element,
    { x: change.value * 100, opacity: 0 },
    {
      x: 0,
      opacity: 1,
      duration: 0.5,
      onComplete: done,
    }
  );
}

function onSectionLeave(element: any, done: any) {
  gsap.fromTo(
    element,
    { x: 0, opacity: 1 },
    {
      x: -change.value * 100,
      opacity: 0,
      duration: 0.5,
      onComplete: done,
    }
  );
}
</script>

<template>
  <form class="w-full" @submit.prevent="onSubmit">
    <Transition
      mode="out-in"
      name="slide"
      @enter="onSectionEnter"
      @leave="onSectionLeave"
    >
      <section v-if="stepCounter === 1">
        <InputField id="title" :validation="v$.title" label="Title">
          <input id="title" v-model="title" type="text" />
          <template v-slot:right>
            <span class="text-gray-500 text-sm"> {{ title.length }}/32 </span>
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

        <button
          :disabled="v$.$invalid"
          class="w-96 mt-4"
          type="button"
          @click="stepForward"
        >
          Next
        </button>
      </section>

      <section v-else-if="stepCounter === 2">
        <button type="button" @click="stepBackward">Back</button>

        <button
          class="bg-gray-200 text-gray-700 rounded-md px-4 py-2"
          type="button"
          @click="emit('close')"
        >
          Create Group
        </button>
      </section>
    </Transition>
  </form>
</template>
<style scoped></style>
