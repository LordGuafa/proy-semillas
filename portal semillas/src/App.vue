<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
</script>

<template>
  <header>
    <div class="">

      <nav>
        <RouterLink to="/">Home</RouterLink>
        <RouterLink :to="{name: 'admissions'}">Admisiones</RouterLink>
      </nav>
    </div>
  </header>

  <RouterView />
</template>

<style scoped>
</style>
