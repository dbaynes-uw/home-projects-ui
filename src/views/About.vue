<template>
  <div class="about">
    <h1>Home Projects</h1>

    <span v-if="statusMessage">
      <h2 style="color: red">
        {{ statusMessage }} -- Make sure that API has started.
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
    console.log("this.$route.query.success: ", this.$route.query.success)
    if (this.$route.query.success) {
      successMessage.value = this.$route.query.success;
      console.log("MOUNTED successMessage: ", successMessage.value )
      this.statusMessage = successMessage.value
      //!!this.statusMessage = this.statusMessage.toLowerCase().replace(/_/g, ' ').replace(/(?: |\b)(\w)/g, function(key) {
      //!!    return key.toUpperCase();
      //!!}); 
      console.log("StatusMessage: ", this.statusMessage )
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