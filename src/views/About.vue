<template>
  <div class="about">
    <h1>Home Projects</h1>
    <h2>A Site for Events to make a Better World!</h2>
    
    <h2 v-if="this.$store.state.user.resource_owner.email.toLowerCase().includes('baynes')">
      <router-link :to="{ name: 'UserList' }">Users</router-link>
    </h2>
    <p>User: {{ this.$store.state.user.resource_owner.email }}</p>
  </div>
</template>
<style lang="css">
@import '../assets/global.css';
</style>