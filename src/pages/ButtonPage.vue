<script setup lang="ts">
import AtomicButton from '@/components/AtomicButton.vue'
</script>

<template>
  <div>
    <div class="container">
      <AtomicButton variant="contained" color="primary">Click</AtomicButton>
      <AtomicButton variant="contained" color="success">Click</AtomicButton>
      <AtomicButton variant="contained" color="warning">Click</AtomicButton>
      <AtomicButton variant="contained" color="danger">Click</AtomicButton>
      <AtomicButton variant="contained" color="info">Click</AtomicButton>

      <AtomicButton variant="outlined" color="primary">Click</AtomicButton>
      <AtomicButton variant="outlined" color="success">Click</AtomicButton>
      <AtomicButton variant="outlined" color="warning">Click</AtomicButton>
      <AtomicButton variant="outlined" color="danger">Click</AtomicButton>
      <AtomicButton variant="outlined" color="info">Click</AtomicButton>

      <AtomicButton variant="text" color="primary">Click</AtomicButton>
      <AtomicButton variant="text" color="success">Click</AtomicButton>
      <AtomicButton variant="text" color="warning">Click</AtomicButton>
      <AtomicButton variant="text" color="danger">Click</AtomicButton>
      <AtomicButton variant="text" color="info">Click</AtomicButton>
    </div>

    <div>
      <AtomicButton to="/">Back to home</AtomicButton>
    </div>
  </div>
</template>

<style scoped>
.container {
  width: 500px;
  margin-bottom: 200px;
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 12px;
}
</style>
