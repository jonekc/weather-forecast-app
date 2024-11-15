<script setup lang="ts">
export type ListViewProps = {
  data: { label: string; value: string }[]
}

defineProps<ListViewProps>()
</script>

<template>
  <div v-for="item in data" :key="item.label" class="item">
    <p>{{ item.label }} {{ item.value }}</p>
  </div>
</template>

<style scoped></style>
