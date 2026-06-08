<template>
  <section class="page-shell mx-auto mt-5">
    <header class="page-shell-header pb-0">
      <h3>New Round</h3>
    </header>
    <div class="page-shell-body">
      <router-link :to="{ name: 'GolfList' }">Back to Golf List</router-link>
    </div>
  </section>
  <!-- Redirect handled in onMounted — this page now just redirects to GolfGroupScorecard -->
</template>

<script setup>
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

onMounted(() => {
  router.replace({ name: 'GolfGroupScorecard' })
})
</script>

<style scoped>
.page-shell {
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 0.75rem;
  overflow: hidden;
}

.page-shell-header {
  padding: 1rem 1.25rem 0.5rem;
}

.page-shell-body {
  padding: 0.5rem 1.25rem 1rem;
}
</style>
