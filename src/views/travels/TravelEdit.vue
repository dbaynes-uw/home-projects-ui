<template>
  <div class="travelEdit">
    <h2>Edit Travel {{ travel.title }}</h2>
    <form class="add-form" @submit.prevent="updateTravel">
      <div class="form-container">
        <label>Title:</label>
        <input type="text" class="text-style" v-model="travel.title" required />
        <label>Description:</label>
        <input
          type="text"
          class="text-style"
          v-model="travel.description"
          required
        />
        <label for="start_date">Start Date:</label>
        <input
          type="date"
          class="text-style"
          v-model="travel.start_date"
          required
        />
        <label for="end_date">End Date:</label>
        <input
          type="date"
          class="text-style"
          v-model="travel.end_date"
          required
        />
        <label for="url_reference">URL Reference:</label>
        <input type="text" class="text-style" v-model="travel.url_reference" />
        <label>Notes:</label>
        <textarea
          v-model="travel.notes"
          rows="3"
          cols="40"
          class="textarea-style"
        />
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
export default {
  props: ["id"],
  async mounted() {
    var work_url = ""
    if (window.location.port == "8080") {
      // or: "http://davids-macbook-pro.local:3000/api/v1/";
      work_url = "http://localhost:3000/api/v1/travels/";
    } else {
      work_url =
        "https://peaceful-waters-05327-b6d1df6b64bb.herokuapp.com/api/v1/travels/";
    }
    this.api_url = work_url
    const result = await axios.get(this.api_url + +this.$route.params.id);
    this.travel = result.data;
  },
  data() {
    return {
      travel: {
        id: "",
        title: "",
        description: "",
        distance: "",
        start_date: "",
        end_date: "",
        notes: "",
        created_by: this.$store.state.user.resource_owner.email,
      },
    };
  },
  setup() {},
  methods: {
    async updateTravel() {
      const travel = {
        ...this.travel,
        updated_by: this.$store.state.created_by,
      };
      const result = await axios.put(
        this.api_url +
          this.$route.params.id,
        {
          title: this.travel.title,
          description: this.travel.description,
          distance: this.travel.distance,
          start_date: this.travel.start_date,
          end_date: this.travel.end_date,
          url_reference: this.travel.url_reference,
          notes: this.travel.notes,
        }
      );
      if (result.status >= 200) {
        alert("Travel has been updated");
        this.$router.push({ name: "TravelDetails", params: { id: travel.id } });
      } else {
        alert("Update Error Code ", result.status);
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
