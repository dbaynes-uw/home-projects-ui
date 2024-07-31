<template>
  <confirm-dialogue ref="confirmDialogue"></confirm-dialogue>
  <div class="edit">
    <h2>Edit GardenPlant {{ plant.head_name }}</h2>
    <router-link :to="{ name: 'GardenPlantList' }">
      <b>Back to GardenPlant List</b>
    </router-link>
    <br/>
    <br/>
    <form class="form-card-display" @submit.prevent="updateGardenPlant">
      <div class="form-container">
        <label>Title:</label>
        <input type="text" class="text-style" v-model="plant.title" required />
        <label>Author:</label>
        <input type="text" class="text-style" v-model="plant.author" required />
        <label for="date_written">Date Written:</label>
        <input
          type="date"
          class="text-style"
          v-model="plant.date_written"
        />
        <label for="date_read">Date Read:</label>
        <input
          type="date"
          class="text-style"
          v-model="plant.date_read"
        />
        <label for="url_to_review">URL to Review:</label>
        <input type="text" class="text-style" v-model="plant.url_to_review" />
        <label>Notes:</label>
        <textarea
          v-model="plant.notes"
          rows="3"
          cols="40"
          class="textarea-style"
        />
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
    this.plant = result.data;
  },
  data() {
    return {
      plant: {
        id: "",
        title: "",
        author: "",
        date_written: "",
        date_read: "",
        url_to_review: "",
        notes: "",
        created_by: this.$store.state.user.resource_owner.email,
      },
      api_url: ""
    };
  },
  setup() {},
  methods: {
    async updateGardenPlant() {
      const ok = await this.$refs.confirmDialogue.show({
        title: "Update GardenPlant from List ",
        message:
          "Are you sure you want to update " + 
          this.plant.title,
        okButton: "Update",
      });
      // If you throw an error, the method will terminate here unless you surround it wil try/catch
      if (ok) {
        const plant = {
          ...this.plant,
          updated_by: this.$store.state.created_by,
        };
        const result = await axios.put(
            this.api_url + 
            this.$route.params.id,
          {
            title: this.plant.title,
            author: this.plant.author,
            date_written: this.plant.date_written,
            date_read: this.plant.date_read,
            url_to_review: this.plant.url_to_review,
            notes: this.plant.notes,
          }
        );
        if (result.status >= 200) {
          alert("GardenPlant has been updated");
          this.$router.push({ name: "GardenPlantDetails", params: { id: plant.id } });
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
