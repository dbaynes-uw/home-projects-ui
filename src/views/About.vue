<template>
  <div class="about">
    <h1>Home Projects</h1>

    <span v-if="statusMessage">
      <h2 style="color: red">
        {{ statusMessage }} from the API -- Make sure that API has started and Check the API Logs
      </h2>
    </span>
    <h2>A Site for Home Projects to make a Better World!</h2>
    <h2 v-if="$store.state.user.resource_owner.email.toLowerCase().includes('baynes')">
      <router-link :to="{ name: 'UserList' }">Users</router-link>
    </h2>
    <p>User: {{ $store.state.user.resource_owner.email }}</p>
  </div>
</template>
<script>
import { ref } from 'vue';
const successMessage = ref('')
export default {
  mounted() {   
    if (this.$route.query.success) {
      successMessage.value = this.$route.query.success;
      this.statusMessage = successMessage.value
    }
  },
  data() {
    return {
      statusMessage: '',
    }
  }
}
</script>
<style lang="css">
@import '../assets/global.css';
</style>