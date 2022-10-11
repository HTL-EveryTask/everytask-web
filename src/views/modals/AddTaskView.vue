<script lang="ts" setup>
import { ref } from "vue";
import { Field, Form } from "vee-validate";

const title = ref("");
const description = ref("");
const due = ref("");

function addTask() {
  console.log(title.value, description.value, due.value);
}
</script>

<template>
  <div>
    <h1>Add A Task</h1>

    <Form @submit="addTask">
      <Field label="title" name="title">
        <label for="title">Title</label>
      </Field>
      <Field label="description" name="description" />
      <Field label="due" name="due" type="datetime-local" />
      <button type="submit">Add Task</button>
    </Form>

    <button
      class="absolute right-0 bottom-0 bg-blue-600 text-white w-20 h-20 rounded-full m-12"
      @click="addTask"
    >
      Save
    </button>
  </div>
</template>
<style scoped></style>
