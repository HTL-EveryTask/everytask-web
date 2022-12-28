<script lang="ts" setup>
const data = [
  [
    {
      startTime: 8000,
      endTime: 9000,
      title: "Test",
      description: "Test",
    },
  ],
  [
    {
      startTime: 9000,
      endTime: 10000,
      title: "Test",
      description: "Test",
    },
    {
      startTime: 9000,
      endTime: 11000,
      title: "Test",
      description: "Test",
    },
  ],
];

function calculateStartingPosition(startTime: number) {
  return (startTime / 1000) * 80 + 45;
}
</script>

<template>
  <div class="relative">
    <div class="absolute pt-8">
      <div
        v-for="index in 24"
        :key="index"
        class="flex h-[80px] text-raisin/50"
      >
        {{ index - 1 }}
      </div>
    </div>
    <div class="absolute pt-8 w-full h-full relative">
      <div
        v-for="entry in data"
        class="absolute flex w-full"
        :key="entry"
        :style="{ top: calculateStartingPosition(entry[0].startTime) + 'px' }"
      >
        <div
          v-for="event in entry"
          :key="event.title"
          class="h-12 w-full bg-raisin/50"
        >
          {{ event.title }}
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
