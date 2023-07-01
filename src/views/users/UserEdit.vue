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
          v-model="user.telephone"
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
    console.log("Params id: ", this.$route.params.id);
    const result = await axios.get(
      "https://peaceful-waters-05327-b6d1df6b64bb.herokuapp.com/api/v1/users/" +
        +this.$route.params.id
    );
    this.user = result.data;
  },
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
  setup() {},
  methods: {
    async updateUser() {
      console.log("This user to PUT: ", this.user.name);
      const result = await axios.put(
        "https://peaceful-waters-05327-b6d1df6b64bb.herokuapp.com/api/v1/users/" +
          +this.$route.params.id,
        {
          name: this.user.name,
          username: this.user.username,
          email: this.user.email,
          telephone: this.user.telephone,
        }
      );
      if (result.status >= 200) {
        alert("User has been updated");
        this.$router.push({ name: "UserList" });
      } else {
        alert("Update Error Code ", result.status);
        console.log("ERROR Result Status: ", result.status);
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
