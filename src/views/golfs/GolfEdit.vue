<template>
  <div>Redirecting…</div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'

const props = defineProps({ id: { type: String, default: '' } })
const router = useRouter()

onMounted(() => {
  router.replace({ name: 'GolfGroupScorecard', params: { id: props.id } })
})
</script>
