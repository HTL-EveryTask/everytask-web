<script lang="ts" setup>
import { onMounted, ref } from "vue";
import { useAuthenticateStore } from "@/stores/auth";
import IconSettings from "@/components/icons/IconSettings.vue";
import NavBar from "@/components/NavBar.vue";
import ToastList from "@/components/ToastList.vue";
import CustomDatePicker from "@/components/CustomDatePicker.vue";

const authenticateStore = useAuthenticateStore();

onMounted(async () => {
  if (localStorage.getItem("token")) {
    const loggedIn = await authenticateStore.checkAuth();
    if (!loggedIn) {
      // await router.push({ name: "login" });
    }
  }
});

const date = ref("2022-11-11");
</script>

<template>
  <div class="h-screen w-screen flex flex-col">
    <div
      class="h-16 w-full z-20 shadow-md shadow-yonder/10 flex justify-between items-center"
    >
      <header class="h-full w-full p-3 ml-2">
        <img alt="logo" class="h-full" src="@/assets/logo_light.svg" />
      </header>
      <div class="h-full p-4 mr-[5vw]">
        <IconSettings class="h-full" />
      </div>
    </div>
    <div
      class="flex-1 flex flex-row sm:flex-col-reverse h-full overflow-hidden"
    >
      <NavBar v-if="!$route.meta.hideNavBar" class="z-10" />
      <div class="w-full h-full overflow-auto">
        <!--        <RouterView />-->
        <div class="m-52">
          <CustomDatePicker class="-top-4" v-model="date">
            <input type="date" v-model="date" readonly />
          </CustomDatePicker>
        </div>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed
          consectetur, nisl nec ultricies lacinia, nisl nisl aliquet nisl, nec
          tincidunt nisl nisl nec nunc. Nulla facilisi. Nulla facilisi. Nulla
        </p>
        <button class="bg-raisin/50 text-raisin/80 rounded-md p-2">
          Click Me
        </button>
      </div>
    </div>

    <ToastList class="fixed top-0 right-0 z-30" />
  </div>
</template>

<style scoped></style>
