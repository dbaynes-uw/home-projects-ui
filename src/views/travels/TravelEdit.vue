<template>
  <confirm-dialogue ref="confirmDialogue"></confirm-dialogue>
  <div class="travelEdit">
    <br/>
    <h2>Edit Travel {{ travel.title }}</h2>
    <br/>
    <button id="link-as-button">
      <router-link  :to="{ name: 'TravelList' }">Back to Travel List</router-link>
    </button>
    <br/>
    <form class="card-display" @submit.prevent="updateTravel">
      <div class="form-container">
        <v-text-field
          label="Title"
          v-model="travel.title"
          required
        />
        <v-textarea
          label="Description"
          v-model="travel.description"
          rows="3"
          cols="40"
        />
        <p id="p-custom-left">Start Date Saved As: {{ formatStandardDate(travel.start_date)}}</p>
        <v-text-field
          label="Click calendar at right to change Date Read"
          v-model="travel.start_date"
          type="date"
        />
        <p id="p-custom-left">Start Date Saved As: {{ formatStandardDate(travel.end_date)}}</p>
        <v-text-field
          label="Click calendar at right to change Date Read"
          v-model="travel.end_date"
          type="date"
        />
        <v-text-field
          label="URL to Review"
          v-model="travel.url_reference"
        />        
        <v-textarea
          label="Notes"
          v-model="travel.notes"
          rows="3"
          cols="40"
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
import ConfirmDialogue from "@/components/ConfirmDialogue.vue";
import DateFormatService from "@/services/DateFormatService.js";

export default {
  props: ["id"],
  components: {
    ConfirmDialogue,
  },
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
    //const result = await axios.get(this.api_url + +this.$route.params.id);
    //if (result.data) {
    //  this.book = result.data;
    //}
  },
  created() {
    this.$store.dispatch("fetchTravel", this.id);
  },
  computed: {
    travel() {
      return this.$store.state.travel;
    },
  },
  data() {
    return {
      api_url: "",
     };
  },
  setup() {},
  methods: {
    async updateTravel() {
      const ok = await this.$refs.confirmDialogue.show({
        title: "Update Travel from List ",
        message:
          "Are you sure you want to update " + 
          this.travel.title,
        okButton: "Update",
      });
      if (ok) {
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
        if (result) {
          if (result.status >= 200) {
            alert("Travel has been updated");
            this.$router.push({ name: "TravelDetails", params: { id: travel.id } });
          } else {
            alert("Update Error Code ", result.status);
          }
        }
      }
    },
    formatStandardDate(value) {
      return DateFormatService.formatStandardDatejs(value);
    },
  },
};
</script>
<style></style>
