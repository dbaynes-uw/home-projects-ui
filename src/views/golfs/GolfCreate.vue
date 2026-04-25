<template>
  <v-card class="mx-auto mt-5">
    <v-card-title class="pb-0">
      <h3>New Round</h3>
    </v-card-title>
    <v-card-text>
      <router-link :to="{ name: 'GolfList' }">Back to Golf List</router-link>
    </v-card-text>
  </v-card>
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
