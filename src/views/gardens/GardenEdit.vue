<template>
  <confirm-dialogue ref="confirmDialogue"></confirm-dialogue>
  <div class="edit">
    <h2>Edit Garden '{{ garden.garden_name }}'</h2>
    <router-link :to="{ name: 'GardenList' }">
      <b>Back to Garden List</b>
    </router-link>
    <br/>
    <br/>
    <form class="form-card-display" @submit.prevent="updateGarden">
      <div class="form-container">
        <label>Garden Name:</label>
        <input type="text" class="text-style" v-model="garden.garden_name" required />
        <label>Status:</label>
        <v-select
          :items="active_statuses"
          v-model="garden.active"
        >
          <template v-slot:prepend-inner>
            <v-icon class="icon-css">mdi-list-status</v-icon>
          </template>
          <option
            v-for="option in active_statuses"
            :value="option"
            :key="option"
            id="select-box"
            :selected="option === garden.active"
          >
            {{ option }}
          </option>
        </v-select> 
        <label>Notes:</label>
        <textarea
          v-model="garden.notes"
          rows="3"
          cols="40"
          class="textarea-style"
        />
        <br/>
        <br/>
        <button class="button" id="link-as-button" type="submit">
          Submit
        </button>
      </div>
    </form>
  </div>
</template>
<script>
import axios from "axios";
import ConfirmDialogue from "@/components/ConfirmDialogue.vue";
export default {
  props: ["id"],
  components: {
    ConfirmDialogue,
  },
  async mounted() {
    var work_url = ""
    if (window.location.port == "8080") {
      // or: "http://davids-macplant-pro.local:3000/api/v1/";
      work_url = "http://localhost:3000/api/v1/gardens/";
    } else {
      work_url =
        "https://peaceful-waters-05327-b6d1df6b64bb.herokuapp.com/api/v1/gardens/";
    }
    this.api_url = work_url
    const result = await axios.get(this.api_url + +this.$route.params.id);
    this.garden = result.data;
    this.garden.active = this.garden.active == 1 ? 'Active' : 'Inactive'

  },
  data() {
    return {
      garden: {
        garden_name: "",
        active: "",
        notes: "",
        created_by: this.$store.state.user.resource_owner.email,
      },
      api_url: "",
      active_statuses: ["Active", "Inactive"],
    };
  },
  setup() {},
  methods: {
    async updateGarden() {
      const ok = await this.$refs.confirmDialogue.show({
        title: "Update Garden",
        message:
          "Are you sure you want to update " + 
          this.garden.garden_name,
        okButton: "Update",
      });
      // If you throw an error, the method will terminate here unless you surround it wil try/catch
      if (ok) {
        const garden = {
          ...this.garden,
          updated_by: this.$store.state.created_by,
        };
        const result = await axios.put(
            this.api_url + 
            this.$route.params.id,
          {
            garden_name: this.garden.garden_name,
            active: this.garden.active,
            notes: this.garden.notes,
          }
        );
        if (result.status >= 200) {
          alert("Garden has been updated for ", this.garden.garden_name);
          this.$router.push({ name: "GardenDetails", params: { id: garden.id } });
        } else {
          alert("Update Error Code ", result.status);
        }
      }
    },
  },
};
</script>
<style>
select {
  border-color: darkgreen;
}
</style>
