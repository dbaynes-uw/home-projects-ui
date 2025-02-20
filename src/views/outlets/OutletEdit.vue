<template>
  <confirm-dialogue ref="confirmDialogue"></confirm-dialogue>
  <div class="edit">
    <h2>Edit Outlet {{ outlet.yard_location }} {{ outlet.faucet_location }}</h2>
    <router-link :to="{ name: 'WateringDetails', params: { id: `${outlet.watering_id}` } }">
      <b>Back to Watering List</b>
    </router-link>
    <br/><br/>
    <br/>
    <v-form class="form-card-display" @submit.prevent="updateOutlet">
      <div class="form-container">
        <v-text-field label="Outlet Name" v-model="outlet.outlet_name">
          <template v-slot:prepend-inner>
            <v-icon class="icon-css">mdi-target</v-icon>
          </template>
        </v-text-field>
        <v-select
          label="Yard Location"
          :items="yard_locations"
          v-model="outlet.yard_location"
        >
          <template v-slot:prepend-inner>
            <v-icon class="icon-css">mdi-list-status</v-icon>
          </template>
          <option
            v-for="option in yard_locations"
            :value="option"
            :key="option"
            id="select-box"
            :selected="option === outlet.yard_location"
          >
            {{ option }}
          </option>
        </v-select>
        <v-select
          label="Faucet Location"
          :items="faucet_locations"
          v-model="outlet.faucet_location"
        >
          <template v-slot:prepend-inner>
            <v-icon class="icon-css">mdi-list-status</v-icon>
          </template>
          <option
            v-for="option in faucet_locations"
            :value="option"
            :key="option"
            id="select-box"
            :selected="option === outlet.faucet_location"
          >
            {{ option }}
          </option>
        </v-select>        
        <v-select
          label="Line #"
          :items="line_numbers"
          v-model="outlet.line_number"
        >
          <template v-slot:prepend-inner>
            <v-icon class="icon-css">mdi-list-status</v-icon>
          </template>
          <option
            v-for="option in line_number"
            :value="option"
            :key="option"
            id="select-box"
            :selected="option === outlet.line_number"
          >
            {{ option }}
          </option>
        </v-select>   
        <v-text-field
          label="Target"
          v-model="outlet.target"
        />
        <v-text-field
          label="Frequency"
          v-model="outlet.frequency"
        />        
        <br/>
        <h3 style="text-align: left">Current time set to {{ formatTime(outlet.start_time) }} - Click to Edit.</h3>
        <h3 style="text-align: left" @click='startTimeDisplay(this.showTimePickerFlag)'>{{ this.start_time_display }} Start Time - Click to Edit.</h3>
        <!--span v-if="this.showTimePickerFlag == true"-->
          <v-text-field 
            type="time"
            label="Click to Edit Start Time"
            v-model="outlet.start_time"
          />
        <!--span--> 
        <br/>   
        <v-text-field
          label="Duration"
          v-model="outlet.duration"
        />    
        <v-select
          label="Status"
          :items="active_statuses"
          v-model="outlet.active"
        >
          <template v-slot:prepend-inner>
            <v-icon class="icon-css">mdi-list-status</v-icon>
          </template>
          <option
            v-for="option in active_statuses"
            :value="option"
            :key="option"
            id="select-box"
            :selected="option === outlet.active"
          >
            {{ option }}
          </option>
        </v-select>        

        <br/><br/>

        <v-textarea
          label="Notes"
          v-model="outlet.notes"
          rows="3"
          cols="40"
        />
        <br/>
        <button class="button" id="link-as-button" type="submit">
          Submit
        </button>
      </div>
    </v-form>
  </div>
</template>
<script>
import ConfirmDialogue from "@/components/ConfirmDialogue.vue";
import DateFormatService from "@/services/DateFormatService.js";
import { ref } from 'vue';
export default {
  props: ["id"],
  components: {
    ConfirmDialogue,
  },
  async mounted() {},
  setup() {
    const outlet_id = ref('');
    return { outlet_id };
  },
  created() {
    this.$store.dispatch("fetchOutlet", this.id);
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
    outlet() {
      return this.$store.state.outlet;
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
      //outlet: {
      //  id: null,
      //  outlet_name: null,
      //  watering_id: null,
      //  yard_location: null,
      //  faucet_location: null,
      //  line_number: null,
      //  target: null,
      //  frequency: null,
      //  start_time: null,
      //  duration: null,
      //  active: null,
      //  notes: null,
      //  created_at: null,
      //  updated_at: null,
      //  created_by: this.$store.state.user.resource_owner.email,
      //  updated_by: this.$store.state.user.resource_owner.email,
      //},
      //watering: {
      //  //name: "",
      //},
      active_statuses: ["Active", "Inactive"],
      yard_locations: ["North", "South"],
      faucet_locations: ["East", "West"],
      line_numbers: ["1","2","3","4"],
      api_url: "",
      start_time_display: null,
      showTimePickerFlag: false,
    };
  },
  methods: {
    async updateOutlet() {
      const ok = await this.$refs.confirmDialogue.show({
        title: "Update Watering Outlet ",
        message:
          "Are you sure you want to update " + 
          this.outlet.yard_location + ' ' + this.outlet.faucet_location,
        okButton: "Update",
      });
      // If you throw an error, the method will terminate here unless you surround it wil try/catch
      if (ok) {
        console.log("IN outlet_id: ",this.outlet_id)
        this.outlet_id = this.getOutletId(this.outlet_id)
        console.log("Return from getOutletId: ",this.outlet_id)
        const outlet = {
          ...this.outlet,
          updated_by: this.$store.state.created_by,
        };
        console.log("Outlet at UPDATE: ", outlet)
        if (this.$store.dispatch("updateOutlet", outlet)) {
          this.$router.push({ name: "WateringDetails", params: { id: outlet.watering_id } });
        }
      } else {
        alert("Outlet Update Error Code ");
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
    },
    startTimeDisplay(showTimePickerFlag) {
      return this.showTimePickerFlag = showTimePickerFlag == true ? false : true
    },
    formatTime(value) {
      return DateFormatService.formatTimejs(value);
    },
  },
};
</script>
<style></style>
