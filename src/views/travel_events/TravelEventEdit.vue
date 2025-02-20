<template>
  <confirm-dialogue ref="confirmDialogue"></confirm-dialogue>
  <div class="travelEdit">
    <br/>
    <h2>Edit Travel Event {{ travel_event.title }}</h2>
    <br/>
    <button id="link-as-button">
      <router-link  :to="{ name: 'TravelList' }">Back to Travel List</router-link>
    </button>
    <br/>
    <form class="card-display" @submit.prevent="updateTravelEvent">
      <div class="form-container">
        <v-text-field
          label="Title"
          v-model="travel_event.title"
          required
        />
        <v-textarea
          label="Description"
          v-model="travel_event.description"
          rows="3"
          cols="40"
        />
        <v-text-field
          label="Event Information (URL)"
          v-model="travel_event.travel_event_url"
        />     
        <v-text-field
          label="Transportation"
          v-model="travel_event.transport"
          required
        />
        <p id="p-custom-left">Start Date Saved As: {{ formatStandardDateTime(travel_event.start_date)}}</p>
        <v-text-field
          label="Click calendar at right to change Date Read"
          v-model="travel_event.start_date"
          type="datetime-local"
        />
        <p id="p-custom-left">End Date Saved As: {{ formatStandardDateTime(travel_event.end_date)}}</p>
        <v-text-field
          label="Click calendar at right to change Date Read"
          v-model="travel_event.end_date"
          type="datetime-local"
        />
        <!--v-text-field
          label="URL to Review"
          v-model="travel_event.url_reference"
        /-->        
        <v-textarea
          label="Notes"
          v-model="travel_event.notes"
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
    this.$store.dispatch("fetchTravelEvent", this.id);
  },
  computed: {
    travel_event() {
      return this.$store.state.travel_event;
    },
    travel() {
      return this.$store.state.travel;
    },
  },
  data() {
    return {};
  },
  setup() {},
  methods: {
    async updateTravelEvent() {
      const ok = await this.$refs.confirmDialogue.show({
        title: "Update Travel Event ",
        message:
          "Are you sure you want to update " + 
          this.travel_event.title,
        okButton: "Update",
      });
      if (ok) {
        const travel_event = {
          ...this.travel_event,
          updated_by: this.$store.state.created_by,
        };
        if (this.$store.dispatch("updateTravelEvent", travel_event)) {
          this.$router.push({ name: "TravelDetails", params: { id: travel_event.travel_id } });
        }
      } else {
        alert("Travel Event Update Error Code ");
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
