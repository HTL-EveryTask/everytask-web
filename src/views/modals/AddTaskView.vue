<script lang="ts" setup>
import { ref } from "vue";

const title = ref("");
const description = ref("");
const due = ref("");

function addTask() {
  console.log(title.value, description.value, due.value);
}
</script>

<template>
  <div class="bg-red-500">
    <h1>Add A Task</h1>

    <div>
      <div class="input-field">
        <label for="title">Title</label>
        <input id="title" v-model.trim="title" type="text" />
      </div>
      <div class="input-field">
        <label for="description">Description</label>
        <input id="description" v-model="description" type="text" />
      </div>
      <div class="input-field">
        <label for="due">Due</label>
        <input id="due" v-model="due" type="datetime-local" />
      </div>
    </div>

    <button
      class="absolute right-0 bottom-0 bg-blue-600 text-white w-20 h-20 rounded-full m-12"
      @click="addTask"
    >
      Save
    </button>
  </div>
</template>
<style scoped></style>
