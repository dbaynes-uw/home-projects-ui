<template>
  <confirm-dialogue ref="confirmDialogue"></confirm-dialogue>
  <div class="edit">
    <h2>Edit Outlet {{ outlet.yard_location }} {{ outlet.faucet_location }}</h2>
    <router-link :to="{ name: 'WateringDisplay' }">
      <b>Back to Watering List</b>
    </router-link>
    <br/><br/>
    <br/>
    <form class="form-card-display" @submit.prevent="updateOutlet">
      <div class="form-container">
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

        <label>Target:</label>
        <input type="text" class="text-style" v-model="outlet.target" />
        <label>Frequency:</label>
        <input type="text" class="text-style" v-model="outlet.frequency" />
        <label>Start Time:</label>
        <input type="text" class="text-style" v-model="outlet.start_time" />
        <label>Duration:</label>
        <input type="text" class="text-style" v-model="outlet.duration"  />
        <label>Status:</label>
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

        <label>Notes:</label>
        <textarea
          v-model="outlet.notes"
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
import DateFormatService from "@/services/DateFormatService.js";
export default {
  props: ["id"],
  components: {
    ConfirmDialogue,
  },
  async mounted() {
    var work_url = ""
    if (window.location.port == "8080") {
      // or: "http://davids-macwatering-pro.local:3000/api/v1/";
      work_url = "http://localhost:3000/api/v1/outlets/";
    } else {
      work_url =
        "https://peaceful-waters-05327-b6d1df6b64bb.herokuapp.com/api/v1/outlets/";
    }
    this.api_url = work_url
    const result = await axios.get(this.api_url + +this.$route.params.id);
    this.outlet = result.data;
    
    this.outlet.active = this.outlet.active == 1 ? 'Active' : 'Inactive'
    this.outlet.start_time = DateFormatService.formatTimejs(this.outlet.start_time)
    console.log("Outlet Edit: ", this.outlet)
    //this.watering = await axios.get(this.api_url + +this.outlet.watering_id);
  },
  created() {
    //this.outlet.start_time = DateFormatService.formatTimejs(this.outlet.start_time)
    //Xthis.$store.dispatch("fetchOutlets"
  },
  data() {
    return {
      outlet: {
        id: null,
        watering_id: null,
        yard_location: null,
        faucet_location: null,
        line_number: null,
        target: null,
        frequency: null,
        start_time: null,
        duration: null,
        active: null,
        notes: null,
        created_at: null,
        updated_at: null,
        created_by: this.$store.state.user.resource_owner.email,
        updated_by: this.$store.state.user.resource_owner.email,
      },
      //watering: {
      //  //name: "",
      //},
      active_statuses: ["Active", "Inactive"],
      yard_locations: ["North", "South"],
      faucet_locations: ["East", "West"],
      line_numbers: ["1","2","3","4"],
      api_url: ""
    };
  },
  setup() {},
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
        //const watering = {
        //  ...this.watering,
        //  updated_by: this.$store.state.created_by,
        //};
        const result = await axios.put(
            this.api_url + 
            this.outlet.id,
          {
            yard_location: this.outlet.yard_location,
            faucet_location: this.outlet.faucet_location,
            line_number: this.outlet.line_number,
            target: this.outlet.target,
            frequency: this.outlet.frequency,
            start_time: this.outlet.start_time,
            duration: this.outlet.duration,
            active: this.outlet.active,
            notes: this.outlet.notes,
            updated_by: this.$store.state.user.resource_owner.email
          }
        );
        if (result.status >= 200) {
          alert("Watering has been updated");
          this.$router.push({ name: "WateringDisplay" });
        } else {
          alert("Update Error Code ", result.status);
        }
      }
    },
    formatTime(value) {
      console.log("Format Time: ", value)
      return DateFormatService.formatTimejs(value);
    },
  },
};
</script>
<style>
select {
  border-color: darkgreen;
}
</style>
