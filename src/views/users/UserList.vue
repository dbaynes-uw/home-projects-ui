<template>
  <confirm-dialogue ref="confirmDialogue"></confirm-dialogue>
  <div>
    <h2>Users</h2>
    <h3>Message: {{ this.message }}</h3>
    <h3>Count: {{ }}</h3>
    <h2>
      <router-link :to="{ name: 'UserCreate' }">Create User</router-link>
    </h2>
    <br />
    <div class="users">
      <div v-for="user in users" :key="user.id" :user="user" class="user">
        <!--router-link :to="{ name: 'UserDetails', params: { id: user.id } }">
          <p class="p-align-left">
            <b>
              <u>User Details for {{ user.description }}</u>
            </b>
          </p>
        </router-link-->
        <p> Users <Caption></Caption>Count: {{ users.length }}</p>
        <ul class="ul-left">
          <li>{{ user.name }}</li>
          <li>{{ user.username }}</li>
          <li>{{ user.email }}</li>
          <li>{{ user.telephone }}</li>
        </ul>
        <br />
        <span class="fa-stack">
          <router-link :to="{ name: 'UserEdit', params: { id: `${user.id}` } }">
            <i class="fa-solid fa-pen-to-square fa-stack-1x"></i>
          </router-link>
        </span>

        <span class="fa-stack">
          <i @click="deleteUser(user)" class="fas fa-trash-alt fa-stack-1x">
          </i>
        </span>
      </div>
    </div>
    <!--div>{{ $store.state.users }}</div-->
  </div>
</template>
<script>
// @ is an alias to /src
import ConfirmDialogue from "@/components/ConfirmDialogue.vue";
export default {
  name: 'UserList',
  components: {
    ConfirmDialogue,
  },
  props: ["id"],
  data() {
    return {
      message: '',
      userList: null,
    };
  },
  methods: {
    async deleteUser(user) {
      const ok = await this.$refs.confirmDialogue.show({
        title: "Delete User from List",
        message:
          "Are you sure you want to delete users" +
          user.name +
          "? It cannot be undone.",
        okButton: "Delete",
      });
      // If you throw an error, the method will terminate here unless you surround it wil try/catch
      if (ok) {
        this.$store.dispatch("deleteUser", user);
        alert("User was Deleted for " + user.name);
        location.reload();
      }
    },
  },
  created() {
    this.$store.dispatch("fetchUsers")
  },
  computed: {
    users() {
      return this.$store.state.users;
    },
  },
};
</script>
<style>
.users {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-gap: 1rem;
}
.user {
  border: 1px solid #ccc;
  background: #41b883;
  padding: 1rem;
  padding-top: 0em;
  border-radius: 5px;
  text-align: center;
  position: relative;
  cursor: pointer;
}
.user-link {
  border: 1px solid #ccc;
  background: #41b883;
  padding: 1rem;
  padding-top: 0em;
  border-radius: 5px;
  text-align: center;
  position: relative;
  cursor: pointer;
}
i {
  position: absolute;
  bottom: 10px;
  right: 10px;
  color: #fff;
  cursor: pointer;
}
.legend {
  display: flex;
  justify-content: space-around;
  margin-bottom: 1rem;
}
.complete-box {
  display: inline-block;
  width: 10px;
  height: 10px;
  background: #35495e;
}
.incomplete-box {
  display: inline-block;
  width: 10px;
  height: 10px;
  background: #41b882;
}
.is-complete {
  background: #35495e;
  color: #fff;
}
.is-complete-for-link {
  color: #41b883;
}
select {
  border-color: darkgreen;
}
.fa-table {
  margin-top: 1rem;
}
@media (max-width: 500px) {
  .users {
    grid-template.columns: 1fr;
  }
}
</style>
