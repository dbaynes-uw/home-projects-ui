<template>
  <div class="userEdit">
    <h2>Edit User {{ user.name }}</h2>
    <form class="add-form" @submit.prevent="updateUser">
      <div class="form-container">
        <label>Name:</label>
        <input type="text" class="text-style" v-model="user.name" required />
        <label>User Name:</label>
        <input
          type="text"
          class="text-style"
          v-model="user.username"
          required
        />
        <label>Email</label>
        <input v-model="user.email" type="email" class="text-style" required />
        <div v-if="errors && errors.email">
          {{ errors.email }}
        </div>
        <label>Telephone:</label>
        <input
          type="text"
          class="text-style"
          v-model="user.phone"
          required
        />
        <button class="button" type="submit">Submit</button>
      </div>
    </form>
  </div>
</template>

<script>
import axios from "axios";
export default {
  props: ["id"],
  async mounted() {
    var work_url = ""
    if (window.location.port == "8080") {
      // or: "http://davids-macbook-pro.local:3000/api/v1/";
      work_url = "http://localhost:3000/api/v1/users/";
    } else {
      work_url =
        "https://peaceful-waters-05327-b6d1df6b64bb.herokuapp.com/api/v1/users/";
    }
    this.api_url = work_url
    const result = await axios.get(this.api_url + +this.$route.params.id);
    this.user = result.data;
  },
  created(){},
  data() {
    return {
      user: {
        id: "",
        name: "",
        username: "",
        email: "",
        phone: "",
        created_by: this.$store.state.user.resource_owner.email,
      },
      api_url: "",
      errors: null,
    };
  },
  computed: {
    isValidEmail() {
      return /^[^@]+@\w+(\.\w+)+\w$/.test(this.email);
    },
  },
  setup() {},
  methods: {
    async updateUser() {
      const result = await axios.put(this.api_url  +this.$route.params.id,
        {
            name: this.user.name,
            username: this.user.username,
            email: this.user.email,
            phone: this.user.phone,
        }
      );
      if (result.status >= 200) {
        alert("User has been updated");
        this.$router.push({ name: "UserList" });
      } else {
        alert("Update Error Code ", result.status);
      }
      //Not Yet:console.warn("Edit Event: ", event),
      //Not Yet:  EventService.putEvent(event)
      //Not Yet:    //{
      //Not Yet:    //  description: this.event.description,
      //Not Yet:    //  notes: this.event.notes,
      //Not Yet:    //}
      //Not Yet:    .then(() => {
      //Not Yet:      //this.$store.commit("ADD_EVENT", event);
      //Not Yet:      alert("Event was successfully updated");
      //Not Yet:      this.$router.push({ name: "EventList" });
      //Not Yet:    })
      //Not Yet:    .catch((error) => {
      //Not Yet:      console.log(error);
      //Not Yet:    });
    },
  },
};
</script>
<style>
select {
  border-color: darkgreen;
}
</style>
