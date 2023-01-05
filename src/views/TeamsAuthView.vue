<script lang="ts" setup>
import { onMounted } from "vue";
import { useConnectionStore } from "@/stores/connection";
import { useToastStore } from "@/stores/toast";
import router from "@/router";

const clientId = "4692541b-da14-4367-b420-1a76fc090357";
const tenantId = "9ec23210-0e57-409e-beac-05e755ea3dd8";
const scopes = "User.Read EduAssignments.ReadBasic offline_access";

const redirectUri = "http://localhost:5173/teamsauth";

async function authenticate() {
  // Get the auth code
  // redirect to the auth code url
  window.location.href = `https://login.microsoftonline.com/${tenantId}/oauth2/v2.0/authorize?client_id=${clientId}&response_type=code&redirect_uri=${redirectUri}&response_mode=query&scope=${scopes}&state=12345`;
}

onMounted(async () => {
  // Get the auth code from the url params
  const urlParams = new URLSearchParams(window.location.search);
  const authCode = urlParams.get("code");

  if (authCode) {
    const response = await useConnectionStore().authenticateTeams(authCode);
    if (response.ok) {
      useToastStore().addToast({
        title: "Successfully authenticated",
        message: "You can now use the Teams integration",
        type: "success",
      });
      await router.push({ name: "connections" });
    } else {
      useToastStore().addToast({
        title: "Failed to authenticate",
        message: "Please try again",
        type: "error",
      });
    }
  }
});
</script>

<template>
  <div class="main-card bg-white max-w-[36em] sm:w-full sm:h-full mt-16">
    <h1>Authenticating with Microsoft</h1>
    <button class="btn btn-primary" @click="authenticate">Authenticate</button>
  </div>
</template>

<style scoped></style>
