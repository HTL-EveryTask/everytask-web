<script lang="ts" setup>
import { ref } from "vue";

let message = ref("Hello, world!");

function showNotification() {
  let notification;
  setTimeout(() => {
    notification = new Notification(message.value);
    notification.addEventListener("click", () => {
      // open the window and focus it
      window.focus();
    });
  }, 2000);
}
</script>

<template>
  <main>
    <h1 class="text-2xl">This is the test view</h1>
    <p>
      Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quae.
    </p>

    <input v-model="message" type="text" />
    <button @click="showNotification">Show Notsssification</button>
  </main>
</template>
