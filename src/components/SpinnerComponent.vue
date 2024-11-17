<script setup lang="ts">
const { width = 'fit-content', height = 'fit-content' } = defineProps<{
  width?: string
  height?: string
}>()
</script>

<template>
  <div class="wrapper" :style="{ width, height }">
    <div class="loader"></div>
  </div>
</template>

<style scoped>
.wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
}

.loader {
  width: 40px;
  padding: 6px;
  aspect-ratio: 1;
  border-radius: 50%;
  background: #25b09b;
  --_m: conic-gradient(#0000 10%, #000), linear-gradient(#000 0 0) content-box;
  -webkit-mask: var(--_m);
  mask: var(--_m);
  -webkit-mask-composite: source-out;
  mask-composite: subtract;
  animation: l3 1s infinite linear;
}
@keyframes l3 {
  to {
    transform: rotate(1turn);
  }
}
</style>
