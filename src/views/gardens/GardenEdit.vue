<template>
  <confirm-dialogue ref="confirmDialogue"></confirm-dialogue>
  <br/>
  <div class="edit">
    <h2>Edit Garden {{ garden.name }}</h2>
    <router-link :to="{ name: 'GardenDetails', params: { id: `${garden.id}` } }">
      <b>Garden Details</b>
    </router-link>
    <br/>
    <router-link :to="{ name: 'Gardens' }">
      <b>Back to Gardens</b>
    </router-link>
    <br/>
    <br/>
    <form class="form-card-display" @submit.prevent="updateGarden">
      <div class="form-container">
        <v-text-field
          label="Garden Name"
          v-model="garden.name"
        /> 
        <span v-if="garden.status">
          <h3 id="p-custom-left">Current Status: {{ garden.status }}</h3>
        </span>
        <v-select
          v-model="status"
          :items="ACTIVE_STATUSES"
          label="Select Status to Change"
        />
        <br/>
        <v-textarea
          label="Notes"
          v-model="garden.notes"
          rows="3"
          cols="40"
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
<script setup>
import { ACTIVE_STATUSES } from "@/services/constants";
import DateFormatService from "@/services/DateFormatService.js";
</script>
<script>
import ConfirmDialogue from "@/components/ConfirmDialogue.vue";
//import { ref } from 'vue';
export default {
  name: "GardenEdit",
  props: ["id"],
  components: {
    ConfirmDialogue,
  },
  created() {
    this.$store.dispatch("fetchGarden", this.id);
  },
  computed: {
    garden() {
      return this.$store.state.garden
    },
  },
  async mounted() {},
  data() {
    return {
      status: null
    };
  },
  methods: {
    async updateGarden() {
      const ok = await this.$refs.confirmDialogue.show({
        title: "Update Garden",
        message:
          "Are you sure you want to update " + 
          this.garden.name,
        okButton: "Update",
      });
      // If you throw an error, the method will terminate here unless you surround it wil try/catch
      if (ok) {
        this.garden.status = 'Active'
        const garden = {
          ...this.garden,
          updated_by: this.$store.state.created_by,
        };
        if (this.$store.dispatch("updateGarden", garden)) {
          this.$router.push({ name: "GardenDetails", params: { id: garden.id } });
        } else {
          alert("Error in Garden Update");
        }
      }
    },
    formatTime(value) {
      return DateFormatService.formatTimejs(value);
    },
  },
};
</script>
<style></style>
