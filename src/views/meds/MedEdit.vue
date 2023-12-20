<template>
  <confirm-dialogue ref="confirmDialogue"></confirm-dialogue>
  <div class="bookEdit">
    <h2>Edit Med</h2>
    <form class="add-form" @submit.prevent="updateMed">
      
      <div class="form-container">
        <p id="p-custom-left">Date of Occurrence: {{ formatStandardDateTime(med.date_of_occurrence) }}</p>
        <v-text-field
          label="Click calendar at right to change Date/Time of Occurrence"
          v-model="med.date_of_occurrence"
          type="datetime-local"
        >
          <!--template v-slot:prepend-inner>
            <v-icon class="icon-css">mdi-calendar</v-icon>
          </!--template-->
        </v-text-field>
        <v-select
          label="Duration"
          :items="durations"
          v-model="med.duration"
        >
          <option
            v-for="option in durations"
            :value="option"
            :key="option"
            id="select-box"
            :selected="option === med.duration"
          >
            {{ option }}
          </option>
        </v-select>
        <v-text-field
          v-model="med.circumstances"
          rows="3"
          cols="40"
        />
        <button class="button" type="submit" id="background-blue">
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
      // or: "http://davids-macmed-pro.local:3000/api/v1/";
      work_url = "http://localhost:3000/api/v1/meds/";
    } else {
      work_url =
        "https://peaceful-waters-05327-b6d1df6b64bb.herokuapp.com/api/v1/meds/";
    }
    console.log("MedEdit Mounted: ", this.$route.params.id);
    this.api_url = work_url
    const result = await axios.get(this.api_url + +this.$route.params.id);
    console.log("Results: ", result)
    this.med = result.data;
  },
  data() {
    return {
      med: {
        id: "",
        date_of_occurrence: "",
        duration: "",
        circumstances: "",
        created_by: this.$store.state.user.resource_owner.email,
      },
      durations: ["Long: > 2mins", "Medium: 1 to 2mins", "Short: < 1min"],
      api_url: ""
    };
  },
  setup() {},
  methods: {
    async updateMed() {
      const ok = await this.$refs.confirmDialogue.show({
        title: "Update Med from List ",
        message:
          "Are you sure you want to Update this record ",
        okButton: "Update",
      });
      // If you throw an error, the method will terminate here unless you surround it wil try/catch
      if (ok) {
        const med = {
          ...this.med,
          updated_by: this.$store.state.created_by,
        };
        console.log("This api_url: ", this.api_url);
        console.log("This med to PUT: ", this.med);
        const result = await axios.put(
            this.api_url + 
            this.$route.params.id,
          {
            date_of_occurrence: this.med.date_of_occurrence,
            duration: this.med.duration,
            circumstances: this.med.circumstances,
          }
        );
        if (result.status >= 200) {
          alert("Med has been updated");
          this.$router.push({ name: "MedDetails", params: { id: med.id } });
        } else {
          alert("Update Error Code ", result.status);
          console.log("ERROR Result Status: ", result.status);
        }
      }
    },
    formatStandardDateTime(value) {
      return DateFormatService.formatStandardDateTime(value);
    },
  },
};
</script>
<style>
select {
  border-color: darkgreen;
}
</style>
