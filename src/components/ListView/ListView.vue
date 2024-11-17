<script setup lang="ts">
export type ListItem = { label: string; value: string }

export type ListViewProps = {
  data: ListItem[]
}

defineProps<ListViewProps>()
</script>

<template>
  <div class="wrapper">
    <p v-for="item in data" :key="item.label">
      {{ item.label }} <strong>{{ item.value }}</strong>
    </p>
  </div>
</template>

<style scoped>
.wrapper {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  flex-wrap: wrap;
  column-gap: 2rem;
}
</style>
