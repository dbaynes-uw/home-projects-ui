<template>
  <div class="about">
    <h1>A Site for Events to make a Better World!</h1>
    <h1>
      <router-link :to="{ name: 'UserList' }">Users</router-link>
    </h1>
    <p>User: {{ this.$store.state.user.resource_owner.email }}</p>
  </div>
</template>
<style lang="css">
@import '../assets/global.css';
</style>