<template>
  <confirm-dialogue ref="confirmDialogue"></confirm-dialogue>
  <div class="edit">
    <h2>Edit Plant {{ plant.plant_name }} for {{ garden.garden_name }}</h2>
    <router-link :to="{ name: 'GardenDetails', params: { id: `${garden.id}` } }">
      <b>Back to Garden Plant List</b>
    </router-link>
    <br/>
    <br/>
    <form class="form-card-display" @submit.prevent="updateGardenPlant">
      <div class="form-container">
        <label>Plant Name:</label>
        <input type="text" class="text-style" v-model="plant.plant_name" required />
        <label>Description:</label>
        <input type="text" class="text-style" v-model="plant.description" />
        <v-select
          label="Status"
          :items="active_statuses"
          v-model="plant.active"
        >
          <template v-slot:prepend-inner>
            <v-icon class="icon-css">mdi-list-status</v-icon>
          </template>
          <option
            v-for="option in active_statuses"
            :value="option"
            :key="option"
            id="select-box"
            :selected="option === plant.active"
          >
            {{ option }}
          </option>
        </v-select>        
        <label>Location:</label>
        <input type="text" class="text-style" v-model="plant.yard_location"/>
        <v-select
          label="Outlet Name:"
          :items="outletsGroup.outletsGroup"
          v-model="plant.outlet_name"
        >
          <option
            v-for="option in outletsGroup"
            :value="option"
            :key="option"
            id="select-box"
            :selected="option === plant.outlet_name"
          >
            {{ option }}
          </option>
        </v-select>
        <label>Duration:</label>
        <input type="text" class="text-style" v-model="plant.duration" />
        <label for="date_written">Date Planted:</label>
        <input
          type="date"
          class="text-style"
          v-model="plant.date_planted"
        />
        <label for="date_read">Date Harvested (if applicable):</label>
        <input
          type="date"
          class="text-style"
          v-model="plant.date_harvested"
        />
        <label for="url_to_review">Online Link:</label>
        <input type="text" class="text-style" v-model="plant.online_link" />
        <label>Notes:</label>
        <textarea
          v-model="plant.notes"
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
      // or: "http://davids-macplant-pro.local:3000/api/v1/";
      work_url = "http://localhost:3000/api/v1/plants/";
    } else {
      work_url =
        "https://peaceful-waters-05327-b6d1df6b64bb.herokuapp.com/api/v1/plants/";
    }
    this.api_url = work_url
    const result = await axios.get(this.api_url + +this.$route.params.id);
    this.plant = result.data;
    this.plant.active = this.plant.active == 1 ? 'Active' : 'Inactive'
  },
  created() {
    this.$store.dispatch("fetchOutletsGroup");
  },
  computed: {
    garden() {
      console.log("Garden: ", this.$store.state.garden)
      return this.$store.state.garden;
    },
    outletsGroup() {
      return this.$store.state.outlets_group;
    },
  },
  data() {
    return {
      plant: {
        garden_id: "",
        outlet_id: "",
        plant_name: "",
        yard_location: "",
        description: "",
        water_outlet: "",
        online_link: "",
        date_planted: "",
        date_harvested: "",
        duration: "",
        active: "",
        notes: "",
        created_by: this.$store.state.user.resource_owner.email,
      },
      api_url: "",
      active_statuses: ["Active", "Inactive"],
    };
  },
  setup() {},
  methods: {
    async updateGardenPlant() {
      const ok = await this.$refs.confirmDialogue.show({
        title: "Update GardenPlant from List ",
        message:
          "Are you sure you want to update " + 
          this.plant.plant_name,
        okButton: "Update",
      });
      // If you throw an error, the method will terminate here unless you surround it wil try/catch
      if (ok) {
        const plant = {
          ...this.plant,
          updated_by: this.$store.state.created_by,
        };
        const result = await axios.put(
            this.api_url + 
            this.$route.params.id,
          {
            garden_id:  this.garden.id,
            plant_name: this.plant.plant_name,
            outlet_id:  this.plant.outlet_id,
            outlet_name:  this.plant.outlet_name,
            yard_location: this.plant.yard_location,
            description: this.plant.description,
            online_link: this.plant.online_link,
            date_planted: this.plant.date_planted,
            date_harvested: this.plant.date_harvested,
            duration: this.plant.duration,
            active: this.plant.active,
            notes: this.plant.notes,
            updated_by: this.$store.state.user.resource_owner.email,
          }
        );
        if (result.status >= 200) {
          alert("Garden Plant has been updated for: ", plant.plant_name);
          this.$router.push({ name: "GardenDetails", params: { id: this.garden.id } });
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
