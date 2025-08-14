<template>
  <h1>Edit Garden {{ garden.name }}</h1>
  <router-link :to="{ name: 'GardenDetails', params: { id: `${garden.id}` } }">
    <b>Garden Details</b>
  </router-link>
  <br/>
  <router-link :to="{ name: 'Gardens' }">
    <b>Back to Gardens</b>
   </router-link>
    <br/>
    <v-form @submit.prevent="updateGarden">
    <ConfirmDialogue ref="confirmDialogue" />
       <v-row>
        <v-col cols="12" md="6">
          <v-text-field
            v-model="garden.name"
            label="Garden Name"
            outlined
            required
            aria-label="Enter the name of the garden"
          ></v-text-field>
        </v-col>
        <v-col cols="12" md="6">
          <span v-if="garden.status">
            <h3 id="p-custom-left">Current Status: {{ garden.status }}</h3>
          </span>
          <v-select
            v-model="status"
            :items="ACTIVE_STATUSES"
            label="Select Status to Change"
          />
        </v-col>
      </v-row>
      <v-row>
        <v-textarea
          label="Notes"
          v-model="garden.notes"
          rows="3"
          cols="40"
        />
      </v-row>
      <!-- Action Buttons -->
      <v-row>
        <v-col cols="12">
          <v-btn color="primary" type="submit" aria-label="Update the Garden">
            Update
          </v-btn>
          <v-btn color="secondary" :to="{ name: 'Gardens' }" aria-label="Go back to the Gardens list">
            Back to List
          </v-btn>
        </v-col>
      </v-row>
  </v-form>
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
