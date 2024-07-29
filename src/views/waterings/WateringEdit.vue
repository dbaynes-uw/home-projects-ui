<template>
  <confirm-dialogue ref="confirmDialogue"></confirm-dialogue>
  <div class="edit">
    <h2>Edit Watering {{ watering.head_name }}</h2>
    <router-link :to="{ name: 'WateringList' }">
      <b>Back to Watering List</b>
    </router-link>
    <br/>
    <br/>
    <form class="form-card-display" @submit.prevent="updateWatering">
      <div class="form-container">
        <label>Title:</label>
        <input type="text" class="text-style" v-model="watering.title" required />
        <label>Author:</label>
        <input type="text" class="text-style" v-model="watering.author" required />
        <label for="date_written">Date Written:</label>
        <input
          type="date"
          class="text-style"
          v-model="watering.date_written"
        />
        <label for="date_read">Date Read:</label>
        <input
          type="date"
          class="text-style"
          v-model="watering.date_read"
        />
        <label for="url_to_review">URL to Review:</label>
        <input type="text" class="text-style" v-model="watering.url_to_review" />
        <label>Notes:</label>
        <textarea
          v-model="watering.notes"
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
      // or: "http://davids-macwatering-pro.local:3000/api/v1/";
      work_url = "http://localhost:3000/api/v1/waterings/";
    } else {
      work_url =
        "https://peaceful-waters-05327-b6d1df6b64bb.herokuapp.com/api/v1/waterings/";
    }
    this.api_url = work_url
    const result = await axios.get(this.api_url + +this.$route.params.id);
    this.watering = result.data;
  },
  data() {
    return {
      watering: {
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
    async updateWatering() {
      const ok = await this.$refs.confirmDialogue.show({
        title: "Update Watering from List ",
        message:
          "Are you sure you want to update " + 
          this.watering.title,
        okButton: "Update",
      });
      // If you throw an error, the method will terminate here unless you surround it wil try/catch
      if (ok) {
        const watering = {
          ...this.watering,
          updated_by: this.$store.state.created_by,
        };
        const result = await axios.put(
            this.api_url + 
            this.$route.params.id,
          {
            title: this.watering.title,
            author: this.watering.author,
            date_written: this.watering.date_written,
            date_read: this.watering.date_read,
            url_to_review: this.watering.url_to_review,
            notes: this.watering.notes,
          }
        );
        if (result.status >= 200) {
          alert("Watering has been updated");
          this.$router.push({ name: "WateringDetails", params: { id: watering.id } });
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
