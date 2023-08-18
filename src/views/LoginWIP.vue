<template>
  <v-card width="400" class="mx-auto mt-5" style="padding-top: 4rem">
    <v-card-title class="pb-0">
      <h3>Login</h3>
    </v-card-title>
    <v-card-text>
      <v-form>
        <v-text-field label="Username">
          <template v-slot:append>
            <v-icon class="icon-css">mdi-account-circle</v-icon>
          </template>
        </v-text-field>
        <v-text-field
          :type="showPassword ? 'text' : 'password'"
          label="Password"
          aria-hidden="true"
          :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
          @click:append="showPassword = !showPassword"
        />
      </v-form>
    </v-card-text>
    <v-divider></v-divider>
    <v-card-actions>
      <v-btn color="success">Register</v-btn>
      <v-btn color="info">Login</v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
export default {
  name: "Login",
  data() {
    return {
      showPassword: false,
    };
  },
};
</script>
