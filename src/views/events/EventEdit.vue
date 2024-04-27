<template>
  <confirm-dialogue ref="confirmDialogue"></confirm-dialogue>
  <div class="eventEdit">
    <h2>Edit Event {{ event.description }}</h2>
    <form class="add-form" @submit.prevent="updateEvent">
      <div class="form-container">
        <label>Status: {{ event.status }}</label>
        <br/>
        <select class="select-status" v-model="event.status" required>
          <option
            v-for="option in statuses"
            :value="option"
            :key="option"
            :selected="option === event.status"
          >
            &nbsp;&nbsp;
            {{ option }}
          </option>
        </select>
        <br/>
        <br/>
        <label for="action_date">Action Due Date:</label>
        <br/>
        <input
          type="date"
          class="text-style"
          v-model="event.action_due_date"
          required
        />
        <span v-if="datePastDue(event.action_completed_date, event.frequency)">
          <span style="color: red; font-weight: bold">
            &nbsp;{{ calculateDateDue(event.action_completed_date, event.frequency) }}
          </span>
        </span>
        <br/>
        <label for="action_completed_date">Action Last Completed Date:</label>
        <input
          type="date"
          class="text-style"
          v-model="event.action_completed_date"
          required
        />
        <label>Whose Turn? </label>
        <select class="text-style" v-model="event.assigned" required>
          <option
            v-for="option in assignees"
            :value="option"
            :key="option"
            :selected="option === event.assigned"
          >
            &nbsp;&nbsp;
            {{ option }}
          </option>
        </select>
        <br />
        <br />
        <label>Select a Frequency: </label>
        <select class="text-style" v-model="event.frequency" required>
          <option
            v-for="option in frequency"
            :value="option"
            :key="option"
            :selected="option === event.frequency"
          >
            &nbsp;&nbsp;
            {{ option }}
          </option>
        </select>
        <br />
        <br />
        <label for="notes">Notes:</label>
        <input
          type="textarea"
          rows="8"
          columns="10"
          v-model="event.notes"
          id="notes"
          class="textarea-style"
          required
        />
        <button class="button" id="link-as-button" type="submit">
          Submit
        </button>
      </div>
    </form>
  </div>
</template>

<script>
//import EventService from "@/services/EventService.js";
import ConfirmDialogue from "@/components/ConfirmDialogue.vue";
import axios from "axios";
import DateFormatService from "@/services/DateFormatService.js";
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
      statuses: ["Active", "Inactive"],
      assignees: ["David", "Jane", "Both", "Up for Grabs"],
      frequency: ["7", "10", "14", "21", "30", "60", "90", "120", "180", "360"],
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
          this.$router.push({ name: "EventShow", params: { id: event.id } });
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
    datePastDue(value) {
      return DateFormatService.datePastDuejs(value);
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
