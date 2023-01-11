<script lang="ts" setup>
const data = [
  [
    {
      startTime: 8000,
      endTime: 8500,
      title: "Test1",
      description: "Test",
    },
  ],
  [
    {
      startTime: 9000,
      endTime: 10000,
      title: "Test2",
      description: "Test",
    },
    {
      startTime: 9000,
      endTime: 11000,
      title: "Test3",
      description: "Test",
    },
  ],
  [
    {
      startTime: 10000,
      endTime: 11000,
      title: "Test4",
      description: "Test",
    },
    {
      startTime: 10000,
      endTime: 12000,
      title: "Test",
      description: "Test",
    },
  ],
  [
    {
      startTime: 11000,
      endTime: 12000,
      title: "Test5",
      description: "Test",
    },
    {
      startTime: 11000,
      endTime: 13000,
      title: "Test6",
      description: "Test",
    },
  ],
  [
    {
      startTime: 12000,
      endTime: 13000,
      title: "Test7",
      description: "Test",
    },
    {
      startTime: 12000,
      endTime: 14000,
      title: "Test",
      description: "Test",
    },
  ],
  [
    {
      startTime: 13000,
      endTime: 14000,
      title: "Test8",
      description: "Test",
    },
    {
      startTime: 13000,
      endTime: 15000,
      title: "Test",
      description: "Test",
    },
  ],
  [
    {
      startTime: 14000,
      endTime: 15000,
      title: "Test9",
      description: "Test",
    },
    {
      startTime: 14400,
      endTime: 16000,
      title: "Test10",
      description: "Test",
    },
  ],
  [
    {
      startTime: 15000,
      endTime: 16000,
      title: "Test11",
      description: "Test",
    },
  ],
  [
    {
      startTime: 16000,
      endTime: 17000,
      title: "Test12",
      description: "Test",
    },
    {
      startTime: 16200,
      endTime: 18000,
      title: "Test13",
      description: "Test",
    },
  ],
  [
    {
      startTime: 17000,
      endTime: 18000,
      title: "Test14",
      description: "Test",
    },
    {
      startTime: 17500,
      endTime: 19000,
      title: "Test15",
      description: "Test",
    },
  ],
];

function calculateStartingPosition(startTime: number) {
  return (startTime / 1000) * 150 + 44;
}

function calculateHeight(startTime: number, endTime: number) {
  return ((endTime - startTime) / 1000) * 150;
}
</script>

<template>
  <div class="relative">
    <div class="absolute pt-8">
      <div
        v-for="index in 24"
        :key="index"
        class="flex h-[150px] text-raisin/50"
      >
        {{ index - 1 }}
      </div>
    </div>
    <div class="absolute pt-8 w-full h-full relative">
      <div
        v-for="(entry, index) in data"
        :key="index"
        :style="{ top: calculateStartingPosition(entry[0].startTime) + 'px' }"
        class="absolute flex w-full"
      >
        <div
          v-for="event in entry"
          :key="event.title"
          :style="{
            marginTop:
              calculateStartingPosition(event.startTime) -
              calculateStartingPosition(entry[0].startTime) +
              'px',
            height: calculateHeight(event.startTime, event.endTime) + 'px',
            backgroundColor:
              'rgba(' +
              Math.floor(Math.random() * 255) +
              ',' +
              Math.floor(Math.random() * 255) +
              ',' +
              Math.floor(Math.random() * 255) +
              ', 0.5)',
          }"
          class="h-12 w-full bg-raisin/50 m-1"
        >
          {{ event.title }}
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
