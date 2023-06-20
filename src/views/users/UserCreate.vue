<template>
  <h1>Create User</h1>
  <div class="form-container">
    <form class="add-form" @submit.prevent="onSubmit">
      <label>Name</label>
      <input v-model="user.name" type="text" class="text-style" required />
      <label>User Name</label>
      <input v-model="user.username" type="text" class="text-style" required />
      <label>Email</label>
      <input v-model="user.email" type="email" class="text-style" required />
      <div v-if="errors && errors.email">
        {{ errors.email }}
      </div>
      <label>Telephone</label>
      <input type="text" required v-model="user.telephone" />
      <!--input
        v-model="user.telephone"
        type="email"
        class="text-style"
        required
      /-->
      <button class="button" type="submit">Submit</button>
    </form>
    <!--Vuex:-->
    <!--div>{{ $store.state.users }}</div-->
  </div>
</template>
<script>
import { v4 as uuidv4 } from "uuid";
//import { mapGetters, mapActions } from "vuex";
//Vuex
//import UserService from "@/services/UserService.js";
export default {
  data() {
    return {
      user: {
        id: "",
        name: "",
        username: "",
        email: "",
        telephone: "",
        created_by: "dbaynes in UserCreate",
      },
      errors: null,
    };
  },
  computed: {
    isValidEmail() {
      return /^[^@]+@\w+(\.\w+)+\w$/.test(this.email);
    },
  },
  methods: {
    //Vuex...mapActions(["addUser"]),
    async onSubmit() {
      console.log("ONSUBMIT: ", this.user.email);
      const errors = {};
      if (!this.user.email) {
        errors.email = "Email is required";
      } else if (!/^[^@]+@\w+(\.\w+)+\w$/.test(this.user.email)) {
        errors.email = "Invalid email";
      }
      if (Object.keys(errors).length > 0) {
        this.errors = errors;
        return;
      } else {
        this.errors = null;
      }
      console.log("Continue on");
      const user = {
        ...this.user,
        id: uuidv4(),
        created_by: this.$store.state.user,
      };
      this.$store.dispatch("createUser", user);
      alert("User was successfully added for " + user.description);
      this.$router.push({ name: "UserList" });
    },
    validateEmail() {
      if (/^\w+([-]?\w+)*@\w+([-]?\w+)*(\.\w{2,3})+$/.test(this.email)) {
        this.msg["email"] = "Please enter a valid email address";
      } else {
        this.msg["email"] = "";
      }
    },
  },
  user() {
    return this.$store.state.user;
  },
};
</script>
<style>
.add-form {
  display: flex;
  flex-direction: column;
  width: 425px;
  padding: 20px;
  margin: 40px;
  border: 2px solid #d8d8d8;
  background-color: white;
  -webkit-box-shadow: 0px 2px 15px -12px rgba(0, 0, 0, 0.57);
  -moz-box-shadow: 0px 2px 15px -12px rgba(0, 0, 0, 0.57);
  box-shadow: 2px 15px -12px rgba(0, 0, 0, 0.57);
}
#notes {
  width: 100%;
  height: 4rem;
}
.button {
  margin: 30px;
  background-color: #39495c;
  border-radius: 5px;
  font-size: 18px;
  width: 160px;
  height: 60px;
  color: white;
  padding: 20px;
  box-shadow: inset 0 -0.6em 1em -0.35em rgba(0, 0, 0, 0.17),
    inset 0 0.6em 2em -0.3em rgba(255, 255, 255, 0.15),
    inset 0 0 0em 0.05em rgba(255, 255, 255, 0.12);
  text-align: center;
  cursor: pointer;
}
label {
  font-size: 20px;
  margin-bottom: 5px;
}
input {
  width: 100%;
  height: 40px;
  margin-bottom: 20px;
}
fieldset {
  border: 0;
  margin: 0;
  padding: 0;
}
select {
  border-color: darkgreen;
}
legend {
  font-size: 28px;
  font-weight: 700;
  margin-top: 20px;
}
</style>
