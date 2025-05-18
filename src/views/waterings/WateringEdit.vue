<template>
  <confirm-dialogue ref="confirmDialogue"></confirm-dialogue>
  <div class="edit">
    <h2>Edit Watering {{ watering.watering_name }}</h2>
    <router-link :to="{ name: 'WateringList' }">
      <b>Back to Watering List</b>
    </router-link>
    <br/><br/>
    <form class="form-card-display" @submit.prevent="updateWatering">
      <div class="form-container">
        <v-text-field
          label="Watering Name"
          v-model="watering.watering_name"
        />
        <h3 id="p-custom-left">Last Updated: {{ formatStandardDateTime(watering.updated_at) }}</h3>
        <h3 id="p-custom-left">Current Status: {{ showWateringActive }}</h3>
        <v-select
          v-model="active"
          :items="ACTIVE_STATUSES"
          label="Select Status to Change"
        />
        <br/>
        <!--label for="created_at">Date Created:</!--label>
        <input
          readonly
          type="text"
          class="text-style"
          v-model="watering.created_at"
        />
        <label for="updated_at">Date Updated:</label>
        <input
          readonly
          type="text"
          class="text-style"
          v-model="watering.updated_at"
        /-->
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
<script setup>
import { ACTIVE_STATUSES } from "@/services/constants";
import ConfirmDialogue from "@/components/ConfirmDialogue.vue";
import DateFormatService from "@/services/DateFormatService.js";
//import { ref } from 'vue';
</script>
<script>
export default {
  props: ["id"],
  components: {
    ConfirmDialogue,
  },
  //created() {
    //var date = new Date();
    //console.log(date.toLocaleString());
    //const watering_active_boolean = ref('');
    //return { watering_active_boolean };
  //},
  //computed: {
    //showWateringActive:{
    //  get(){
    //   var watering_active_string = ""
    //   watering_active_string = this.watering.active == true ? "Active" : "Inactive"
    //   return watering_active_string
    //  }
    //},
    //watering() {
    //  //console.log("2 - computed@@")
    //  return this.$store.state.watering
    //},
    
  //},
  created() {
    this.$store.dispatch("fetchWatering", this.id);
  },
  computed: {
    watering() {
    return this.$store.state.watering;
    }
  },

  data() {
    return {
      active: ""
    };
  },
  methods: {
    async updateWatering() {
      const ok = await this.$refs.confirmDialogue.show({
        title: "Update Watering ",
        message:
          "Are you sure you want to update " + 
          this.watering.watering_name,
        okButton: "Update",
      });
      // If you throw an error, the method will terminate here unless you surround it wil try/catch
      if (ok) {
        this.watering.active = this.getWateringActive(this.active)
        const watering = {
          ...this.watering,
          updated_at: this.$store.state.created_by,
          updated_by: this.$store.state.created_by,
        };
        if (this.$store.dispatch("updateWatering", watering)) {
          this.$router.push({ name: "WateringList" });
        } else {
          alert("Error in Watering Update");
        }
      }
    },
    getWateringActive(boolean_to_string) {
      var wateringActiveString = ""
      wateringActiveString = boolean_to_string == 'Active' ? true : false
      return wateringActiveString
    },
    formatStandardDateTime(value) {
      return DateFormatService.formatStandardDateTimejs(value);
    },
    formatFullYearDate(value) {
      return DateFormatService.formatFullYearDatejs(value);
    },
  },
};
</script>
<style></style>
