<template>
  <confirm-dialogue ref="confirmDialogue"></confirm-dialogue>
  <div class="edit">
    <h2>Edit Plant {{ plant.plant_name }} for {{ garden.garden_name }}</h2>
    <router-link :to="{ name: 'GardenDetails', params: { id: `${garden.id}` } }">
      <b>Back to Garden Plant List</b>
    </router-link>
    <br/>
    <br/>
    <form class="form-card-display" @submit.prevent="updatePlant">
      <div class="form-container">
        <v-text-field
          label="Plant Name"
          v-model="plant.plant_name"
          required
        />
        <v-textarea
          label="Description"
          v-model="plant.description"
          rows="3"
          cols="40"
        />        
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
        <v-text-field
          label="Yard Location"
          v-model="plant.yard_location"
        />
        <h3 id="p-custom-left">Outlet Name: {{ showOutletName }}</h3>
        <v-select
          v-model="outlet_id"
          :items="outletsDisplayGroup.outletsDisplayGroup"
          name="id"
          item-title="outlet_name"
          label="Select Item to Change"
          :hide-details='true'
        />
        <br/>
        <v-text-field
          label="Duration"
          v-model="plant.duration"
        />
        <v-text-field
          label="Click calendar at right to change Date Planted"
          v-model="plant.date_planted"
          type="date"
        />
        <v-text-field
          label="Click calendar at right to change Date Harvested (if applicable)"
          v-model="plant.date_harvested"
          type="date"
        />
        <v-text-field
          label="Reference"
          v-model="plant.online_link"
        />           
        <label>Notes:</label>
        <v-textarea
          label="Notes"
          v-model="plant.notes"
          rows="3"
          cols="40"
        />
        <button class="button" id="link-as-button" type="submit">
          Submit
        </button>
      </div>
    </form>
  </div>
</template>
<script>
import ConfirmDialogue from "@/components/ConfirmDialogue.vue";
import { ref } from 'vue';
export default {
  setup() {
    const outlet_id = ref('');
    return { outlet_id };
  },
  props: ["id"],
  components: {
    ConfirmDialogue,
  },
  async mounted() {},
  created() {
    this.$store.dispatch("fetchPlant", this.id);
    this.$store.dispatch("fetchOutletsDisplayGroup");
    this.$store.dispatch("fetchOutletsHash");
  },
  computed: {
    showOutletName:{
      get(){
       console.log("ShowOutletName - plant.outlet_id: ", this.plant.outlet_id)
       console.log("ShowOutletsHash: ", this.outletsHash.outletsHash[0])
       console.log("ShowOutletsHashLength: ", this.outletsHash.outletsHash.length)
       var outletName = ""
       for (let i=0; i < this.outletsHash.outletsHash.length; i++) {
        console.log("Name: ", this.outletsHash.outletsHash[i].outlet_name)
         if (this.plant.outlet_id == this.outletsHash.outletsHash[i].id) {
           outletName = this.outletsHash.outletsHash[i].outlet_name
           i = 99
         }
       }
       return outletName
      },
    },
    plant() {
      return this.$store.state.plant;
    },
    garden() {
      return this.$store.state.garden;
    },
    outletsDisplayGroup() {
      return this.$store.state.outlets_display_group;
    },
    outletsHash() {
      return this.$store.state.outlets_hash;
    },
  },
  data() {
    return {
      selectedItem: '',
      active_statuses: ["Active", "Inactive"],
    };
  },
  methods: {
    async updatePlant() {
      const ok = await this.$refs.confirmDialogue.show({
        title: "Update Garden Plant from List ",
        message:
          "Are you sure you want to update " + 
          this.plant.plant_name,
        okButton: "Update",
      });
      // If you throw an error, the method will terminate here unless you surround it wil try/catch
      if (ok) {
        console.log("IN outlet_id: ",this.outlet_id)
        this.plant.outlet_id = this.getOutletId(this.outlet_id)
        console.log("Return from getOutletId: ",this.plant.outlet_id)
        const plant = {
          ...this.plant,
          updated_by: this.$store.state.created_by,
        };
        console.log("PLant at UPDATE: ", plant)
        if (this.$store.dispatch("updatePlant", plant)) {
          this.$router.push({ name: "GardenDetails", params: { id: plant.garden_id } });
        }
      } else {
        alert("Plant Update Error Code ");
      }
    },
    getOutletId(name_to_id) {
      var outletId = ""
      for (let i=0; i < this.outletsHash.outletsHash.length; i++) {
        console.log("if name; ", this.outletsHash.outletsHash[i].outlet_name)
        if (name_to_id == this.outletsHash.outletsHash[i].outlet_name) {
          outletId = this.outletsHash.outletsHash[i].id
          i = 99
        }
      }
      return outletId
    }
  },
};
</script>
<style>
select {
  border-color: darkgreen;
}
</style>
