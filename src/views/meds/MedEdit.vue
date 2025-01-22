<template>
  <confirm-dialogue ref="confirmDialogue"></confirm-dialogue>
  <br/>
  <div class="edit">
    <h2>Edit Med</h2>
    <button id="link-as-button">
      <router-link  :to="{ name: 'MedList' }">Back to Med List</router-link>
    </button>
    <br/>
    <form class="card-display" @submit.prevent="updateMed">
      <div class="form-container">
        <p id="p-custom-left">Date of Occurrence: {{ formatStandardDateTime(med.date_of_occurrence)}}</p>
        <v-text-field
          label="Click calendar at right to change Date/Time of Occurrence"
          v-model="med.date_of_occurrence"
          type="datetime-local"
        />
        <v-select
          label="Duration"
          :items="MED_DURATIONS"
          v-model="med.duration"
        >
          <option
            v-for="option in MED_DURATIONS"
            :value="option"
            :key="option"
            id="select-box"
            :selected="option === med.duration"
          >
            {{ option }}
          </option>
        </v-select>
        <v-text-field
          label="Interval in Days"
          v-model="med.interval_days"
          :readonly="true"
        />
        <v-text-field
          label="Interval in Hours"
          v-model="med.interval_hours"
          :readonly="true"
        />
        <v-text-field
          label="Interval in Minutes"
          v-model="med.interval_minutes"
          :readonly="true"
        />
        <v-textarea
          label="Circumstances"
          v-model="med.circumstances"
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
<script setup>
import ConfirmDialogue from "@/components/ConfirmDialogue.vue";
import DateFormatService from "@/services/DateFormatService.js";
import { MED_DURATIONS } from "@/services/constants";
</script>
<script>
export default {
  props: ["id"],
  components: {
    ConfirmDialogue,
  },
  created() {
    this.$store.dispatch("fetchMed", this.id);
  },
  computed: {
    med() {
      return this.$store.state.med;
    },
  },
  data() {
    return {
      //durations: ["Long: > 2mins", "Medium: 1 to 2mins", "Short: < 1min"],
      api_url: ""
    };
  },
  setup() {},
  methods: {
    async updateMed() {
      const ok = await this.$refs.confirmDialogue.show({
        title: "Update Med from List ",
        message:
          "Confirm Update this record ",
        okButton: "Update",
      });
      // If you throw an error, the method will terminate here unless you surround it wil try/catch
      if (ok) {
        const med = {
          ...this.med,
          updated_by: this.$store.state.created_by,
        };
        if (this.$store.dispatch("updateMed", med)) {
          this.$router.push({ name: "MedDetails", params: { id: med.id } });
        }
      } else {
        alert("ERROR in Update Med")
      }
    },
    formatStandardDateTime(value) {
      return DateFormatService.formatStandardDateTimejs(value);
    },
  },
};
</script>
<style>
</style>
