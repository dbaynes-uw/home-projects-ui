<template>
  <confirm-dialogue ref="confirmDialogue"></confirm-dialogue>
  <br/>
  <div class="eventEdit">
    <h2>Edit Event {{ event.description }}</h2>
    <router-link :to="{ name: 'EventList' }">
      <h3>Back to Event List</h3>
    </router-link>
    <br/>
    <form class="card-display" @submit.prevent="updateEvent">
      <div class="form-container">
        <v-text-field
          label="Event Name or Description"
          v-model="event.description"
        />
        <v-select
          label="Status"
          :items="EVENT_STATUSES"
          v-model="event.status"
        >
          <option
            v-for="option in EVENT_STATUSES"
            :value="option"
            :key="option"
            id="select-box"
            :selected="option === med.duration"
          >
            {{ option }}
          </option>
        </v-select>
        <!--p id="p-custom-left">Action Due Date: {{ formatStandardDate(event.action_due_date)}}</p-->
        <span v-if="datePastDue(event.action_completed_date, event.frequency)">
          <span style="color: red; font-weight: bold">
            Event is Past Due: {{ calculateDateDue(event.action_completed_date, event.frequency) }}
          </span>
        </span>
        <v-text-field
          label="Action Due Date"
          v-model="event.action_due_date"
          type="date"
        />
        <!--p id="p-custom-left">Action Completed Date: {{ formatStandardDate(event.action_completed_date)}}</p-->
        <v-text-field
          label="Action Last Completed Date"
          v-model="event.action_completed_date"
          type="date"
        />
        <v-select
          label="Whose Turn?"
          :items="ASSIGNEES"
          v-model="event.assigned"
        >
          <option
            v-for="option in ASSIGNEES"
            :value="option"
            :key="option"
            id="select-box"
            :selected="option === event.assigned"
          >
            {{ option }}
          </option>
        </v-select>
        <v-select
          label="Frequency in Days"
          :items="EVENT_FREQUENCY"
          v-model="event.frequency"
        >
          <option
            v-for="option in EVENT_FREQUENCY"
            :value="option"
            :key="option"
            id="select-box"
            :selected="option === event.frequency"
          >
            {{ option }}
          </option>
        </v-select>
        <v-textarea
          label="Notes"
          v-model="event.notes"
          rows="3"
          cols="40"
        />
        <br>
        <button class="button" id="link-as-button" type="submit">
          Submit
        </button>
        <br/>
        <button id="button-as-link">
          <router-link :to="{ name: 'EventShow', id: `${event.id}` }">
            Details and History
          </router-link>
        </button>
      </div>
    </form>
  </div>
</template>
<script setup>
  import {ASSIGNEES, EVENT_FREQUENCY, EVENT_STATUSES} from "@/services/constants.js"
  import ConfirmDialogue from "@/components/ConfirmDialogue.vue";
  import axios from "axios";
  import DateFormatService from "@/services/DateFormatService.js";
</script>
<script>
//import EventService from "@/services/EventService.js";
export default {
  props: ["id", "assigned"],
  components: {
    ConfirmDialogue,
  },
  async mounted() {
    var work_url = ""
    if (window.location.port == "8080") {
      // or: "http://davids-macbook-pro.local:3000/api/v1/";
      work_url = "http://localhost:3000/api/v1/events/";
    } else {
      work_url =
        "https://peaceful-waters-05327-b6d1df6b64bb.herokuapp.com/api/v1/events/";
    }
    this.api_url = work_url
    const result = await axios.get(this.api_url + +this.$route.params.id);
    this.event = result.data;
    const capitalizedFirst = this.event.status.toUpperCase();
    const rest = this.event.status.slice(1);
    this.event.status = capitalizedFirst[0] + rest
  },
  data() {
    return {
      event: {
        id: "",
        description: "",
        status: "",
        action_completed_date: "",
        action_due_date: "",
        assigned: "",
        frequency: "",
        completed: "",
        notes: "",
        updated_by: this.$store.state.user.resource_owner.email,
      },
    };
  },
  setup() {},
  methods: {
    async updateEvent() {
      const ok = await this.$refs.confirmDialogue.show({
        title: "Update Event from List",
        message:
          "Are you sure you want to update " +
          this.event.description,
        okButton: "Update",
      });
      // If you throw an error, the method will terminate here unless you surround it wil try/catch
      if (ok) {
        //Needed? const event = {
        //Needed?   ...this.event,
        //Needed?   updated_by: this.$store.state.user.resource_owner.email,
        //Needed? };
        //console.log("This event to PUT: ", this.event);
        const result = await axios.put(
          this.api_url +
          +this.$route.params.id,
          {
            description: this.event.description,
            status: this.event.status.toLowerCase(),
            action_completed_date: this.event.action_completed_date,
            action_due_date: this.event.action_due_date,
            assigned: this.event.assigned,
            frequency: this.event.frequency,
            notes: this.event.notes,
            updated_by: this.$store.state.user.resource_owner.email,
          }
        );
        if (result.status >= 200) {
          alert("Event has been updated");
          this.$router.push({ name: "EventShow", params: { id: result.id } });
        } else {
          alert("Update Error Code ", result.status);
        }
        //Not Yet:console.warn("Edit Event: ", event),
        //Not Yet:  EventService.putEvent(event)
        //Not Yet:    //{
        //Not Yet:    //  description: this.event.description,
        //Not Yet:    //  notes: this.event.notes,
        //Not Yet:    //}
        //Not Yet:    .then(() => {
        //Not Yet:      //this.$store.commit("ADD_EVENT", event);
        //Not Yet:      alert("Event was successfully updated");
        //Not Yet:      this.$router.push({ name: "EventList" });
        //Not Yet:    })
        //Not Yet:    .catch((error) => {
        //Not Yet:      console.log(error);
        //Not Yet:    });
      }
    },
    formatStandardDate(value) {
      return DateFormatService.formatStandardDatejs(value);
    },
    datePastDue(action_date, frequency) {
      return DateFormatService.datePastDuejs(action_date, frequency);
    },
    calculateDateDue(action_completed_date, frequency) {
      return DateFormatService.calculateDateDuejs(action_completed_date, frequency);
    },
  },
};
</script>
<style>
.form-container {
  width: 100%;
}
select {
  border-color: darkgreen;
}
</style>
@/services/constants.js