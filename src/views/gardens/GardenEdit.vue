<template>
  <confirm-dialogue ref="confirmDialogue"></confirm-dialogue>
  <br/>
  <div class="edit">
    <h2>Edit Garden {{ garden.name }}</h2>
    <router-link :to="{ name: 'GardenList' }">
      <b>Back to Garden List</b>
    </router-link>
    <br/>
    <br/>
    <form class="form-card-display" @submit.prevent="updateGarden">
      <div class="form-container">
        <v-text-field
          label="Garden Name"
          v-model="garden.name"
        /> 
        <h3 id="p-custom-left">Current Status: {{ showGardenActive }}</h3>
        <v-select
          v-model="active"
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
</script>
<script>
import ConfirmDialogue from "@/components/ConfirmDialogue.vue";
import { ref } from 'vue';
export default {
  name: "GardenEdit",
  props: ["id"],
  components: {
    ConfirmDialogue,
  },
  created() {
    //console.log("1 - Created@@")
    const garden_active_boolean = ref('');
    return { garden_active_boolean };
  },
  computed: {
    showGardenActive:{
      get(){
       var garden_active_string = ""
       garden_active_string = this.garden.active == true ? "Active" : "Inactive"
       return garden_active_string
      }
    },
    garden() {
      //console.log("2 - computed@@")
      return this.$store.state.garden
    },
  },
  async mounted() {
    //console.log("3 - Mounted@@")
  },
  data() {
    return {
      active: ""
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
        this.garden.active = this.getGardenActive(this.active)
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
    getGardenActive(boolean_to_string) {
      var gardenActiveString = ""
      gardenActiveString = boolean_to_string == 'Active' ? true : false
      return gardenActiveString
    }
  },
};
</script>
<style></style>
