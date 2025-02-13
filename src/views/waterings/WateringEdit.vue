<template>
  <confirm-dialogue ref="confirmDialogue"></confirm-dialogue>
  <div class="edit">
    <h2>Edit Watering {{ watering.watering_name }}</h2>
    <router-link :to="{ name: 'WateringList' }">
      <b>Back to Watering List</b>
    </router-link>
    <br/><br/>
    <!--ul>
      <li class="center">
        <button id="button-as-link">
          <router-link  :to="{ name: 'OutletCreate' }">Add Outlet</router-link>
        </button>
      </li>
    </!--ul> 
    <br/-->
    <form class="form-card-display" @submit.prevent="updateWatering">
      <div class="form-container">
        <v-text-field
          label="Watering Name"
          v-model="watering.watering_name"
        />
        <v-select
          :items="ACTIVE_STATUSES"
          v-model="watering.active"
        >
          <template v-slot:prepend-inner>
            <v-icon class="icon-css">mdi-list-status</v-icon>
          </template>
          <option
            v-for="option in ACTIVE_STATUSES"
            :value="option"
            :key="option"
            id="select-box"
            :selected="option === watering.active"
          >
            {{ option }}
          </option>
        </v-select> 
        <br/><br/>
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
import axios from "axios";
import { ACTIVE_STATUSES } from "@/services/constants";
import ConfirmDialogue from "@/components/ConfirmDialogue.vue";
import DateFormatService from "@/services/DateFormatService.js";
</script>
<script>
export default {
  props: ["id"],
  components: {
    ConfirmDialogue,
  },
  async mounted() {
    var work_url = ""
    if (window.location.port == "8080") {
      // or: "http://davids-macwatering-pro.local:3000/api/v1/";
      work_url = "http://localhost:3000/api/v1/waterings/";
    } else {
      work_url =
        "https://peaceful-waters-05327-b6d1df6b64bb.herokuapp.com/api/v1/waterings/";
    }
    this.api_url = work_url
    const result = await axios.get(this.api_url + +this.$route.params.id);
    this.watering = result.data;
    this.watering.created_at = this.formatFullYearDate(this.watering.created_at)
    this.watering.updated_at = this.formatFullYearDate(this.watering.updated_at)
    this.watering.active = this.watering.active == 1 ? 'Active' : 'Inactive'
  },
  data() {
    return {
      watering: {
        id: null,
        garden_id: null,
        watering_name: null,
        name: null,
        active: null,
        notes: null,
        created_at: null,
        updated_at: null,
        created_by: this.$store.state.user.resource_owner.email,
        updated_by: this.$store.state.user.resource_owner.email,
      },
      //active_statuses: ["Active", "Inactive"],
      api_url: ""
    };
  },
  setup() {},
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
        const watering = {
          ...this.watering,
          updated_by: this.$store.state.created_by,
        };
        const result = await axios.put(
            this.api_url + 
            this.$route.params.id,
          {
            watering_name: this.watering.watering_name,
            active: this.watering.active,
            notes: this.watering.notes,
            updated_by: this.$store.state.user.resource_owner.email,
          }
        );
        if (result.status >= 200) {
          alert("Watering has been updated");
          this.$router.push({ name: "WateringEdit", params: { id: watering.id } });
        } else {
          alert("Update Error Code ", result.status);
        }
      }
    },
    formatFullYearDate(value) {
      return DateFormatService.formatFullYearDatejs(value);
    },
  },
};
</script>
<style>
select {
  border-color: darkgreen;
}
</style>
