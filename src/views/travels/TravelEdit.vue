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
        <v-text-field
          label="Transportation"
          v-model="travel.transport"
        />
        <v-text-field
          label="Transport URL"
          v-model="travel.transport_url"
        />     
        <v-text-field
          label="Booking Reference"
          v-model="travel.booking_reference"
        />
        <p id="p-custom-left">Departure: {{ formatStandardDateTime(travel.departure_date)}}</p>
        <v-text-field
          label="Click calendar at right to change Date Read"
          v-model="travel.departure_date"
          type="datetime-local"
        />
        <p id="p-custom-left">Return: {{ formatStandardDateTime(travel.return_date)}}</p>
        <v-text-field
          label="Click calendar at right to change Date Read"
          v-model="travel.return_date"
          type="datetime-local"
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
import ConfirmDialogue from "@/components/ConfirmDialogue.vue";
import DateFormatService from "@/services/DateFormatService.js";
export default {
  props: ["id"],
  components: {
    ConfirmDialogue,
  },
  async mounted() {},
  created() {
    this.$store.dispatch("fetchTravel", this.id);
  },
  computed: {
    travel() {
      return this.$store.state.travel;
    },
  },
  data() {
    return {};
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
        if (this.$store.dispatch("updateTravel", travel)) {
          this.$router.push({ name: "TravelDetails", params: { id: travel.id } });
        }
      } else {
       alert("ERROR in Update Travel")
      }
    },
    formatStandardDate(value) {
      return DateFormatService.formatStandardDatejs(value);
    },
    formatStandardDateTime(value) {
      return DateFormatService.formatStandardDateTimejs(value);
    },
  },
};
</script>
<style></style>
