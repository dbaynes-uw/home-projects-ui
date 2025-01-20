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
          v-model="capitalizedStatus"
        >
          <option
            v-for="option in EVENT_STATUSES"
            :value="option"
            :key="option"
            id="select-box"
            :selected="option === event.status"
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
          :items="ASSIGNEES_CURRENT"
          v-model="event.assigned"
        >
          <option
            v-for="option in ASSIGNEES_CURRENT"
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
  import {ASSIGNEES_CURRENT, EVENT_FREQUENCY, EVENT_STATUSES} from "@/services/constants.js"
  import ConfirmDialogue from "@/components/ConfirmDialogue.vue";
  import DateFormatService from "@/services/DateFormatService.js";
</script>
<script>
export default {
  props: ["id", "assigned"],
  components: {
    ConfirmDialogue,
  },
  created() {
    this.$store.dispatch("fetchEvent", this.id);
  },
  computed: {
    event() {
      return this.$store.state.event;
    },
    capitalizedStatus: {
      get() {
        return this.event.status.charAt(0).toUpperCase() + this.event.status.slice(1);
      },
      set(value){
        //value is what is returned from get() above in capitalizedStatus
        this.event.status = value
      }
   }
  },
  data() {
    return {};
  },
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
        const event = {
        ...this.event,
        assigned_email: this.$store.state.user.resource_owner.email,
        updated_by: this.$store.state.user.resource_owner.email,
        }
        if (this.$store.dispatch("updateEvent", event)) {
          this.$router.push({ name: "EventShow", params: { id: event.id } });
        }
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