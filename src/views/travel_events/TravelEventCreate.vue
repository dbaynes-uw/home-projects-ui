<template>
  <v-card-title class="pb-0">
    <h3>Add Travel Event to {{ travel.title }} Travel</h3>
  </v-card-title>
  <router-link :to="{ name: 'TravelDetails' }">
      <b>Back to Travel Details</b>
    </router-link>
  <br/>
  <v-card-text>
    <v-form @submit.prevent="onSubmit">
      <v-container id="form-container">
        <v-text-field
          v-model="travel.title"
          readonly :value="travel.title"
          id="read-only-label"
          label="Journey Ahead"
        >
          <template v-slot:prepend-inner>
            <v-icon class="icon-css">mdi-magnify</v-icon>
          </template>
        </v-text-field>
        <v-text-field label="Event Title"
          v-model="travel_event.title"
          :rules="[requiredTitle]"
          >
          <template v-slot:prepend-inner>
            <v-icon class="icon-css">mdi-target</v-icon>
          </template>
        </v-text-field>
        <v-text-field label="Event Description" v-model="travel_event.description">
          <template v-slot:prepend-inner>
            <v-icon class="icon-css">mdi-target</v-icon>
          </template>
        </v-text-field>
        <v-text-field
          v-model="travel_event.travel_event_url"
          label="Event Information (URL)"
        >
          <template v-slot:prepend-inner>
            <v-icon class="icon-css">mdi-link</v-icon>
          </template>
        </v-text-field>  
        <span>
          {{ urlMaxLength - travel_event.travel_event_url.length }} / {{ urlMaxLength }}
        </span>
        <v-text-field label="Transportation Type" v-model="travel_event.transport">
          <template v-slot:prepend-inner>
            <v-icon class="icon-css">mdi-target</v-icon>
          </template>
        </v-text-field>
        <v-text-field label="Booking Reference" v-model="travel_event.booking_reference">
          <template v-slot:prepend-inner>
            <v-icon class="icon-css">mdi-magnify</v-icon>
          </template>
        </v-text-field>
        <v-text-field
          v-model="travel_event.transport_url"
          label="Link to Transportation"
        >
          <template v-slot:prepend-inner>
            <v-icon class="icon-css">mdi-link</v-icon>
          </template>
        </v-text-field>  
        <span>
          {{ urlMaxLength - travel_event.transport_url.length }} / {{ urlMaxLength }}
        </span>
        <v-text-field label="Start Date"
          v-model="travel_event.start_date"
          type="datetime-local"
          :rules="[requiredStartDate]"
        >
          <template v-slot:prepend-inner>
            <v-icon class="icon-css">mdi-calendar</v-icon>
          </template>
        </v-text-field>
        <v-text-field label="End Date"
          v-model="travel_event.end_date"
          type="datetime-local"
        >
          <template v-slot:prepend-inner>
            <v-icon class="icon-css">mdi-calendar</v-icon>
          </template>
        </v-text-field>        
        <v-textarea
          label="Notes"
          v-model="travel_event.notes"
          clearable
        >
          <template v-slot:prepend-inner>
            <v-icon class="icon-css">mdi-note</v-icon>
          </template>
        </v-textarea> 
        <br/>
        <v-btn type="submit" block class="mt-2">Submit</v-btn>
      </v-container>
    </v-form>
  </v-card-text>
</template>
<script>
import { v4 as uuidv4 } from "uuid";
export default {
  props: ["id"],
  //Xprops: {
  //X  id: {
  //X    type: String,
  //X    required: true
  //X  }
  //X},
  components: {},
  data() {
    return {
      travel_event: {
        id: "",
        travel_id: "",
        title: "",
        description: "",
        travel_event_url: "",
        start_date: "",
        end_date: "",
        transport: "",
        booking_reference: "",
        transport_url: "",
        notes: "",
        created_by: this.$store.state.user.resource_owner.email,
      },
      urlMaxLength: 255,
      isTitleValid: false,
      isStartDateValid: false,
      isFormValid: false,
      isYardLocationValid: false,
      isFaucetLocationValid: false,
      isLineNumberValid: false,
    };
  },
  created() {
    this.$store.dispatch("fetchTravel", this.$route.params.id);
  },
  computed: {
    travel() {
      return this.$store.state.travel;
    },

  },
  methods: {
    onSubmit() {
      this.checkValidations();
      if (this.isFormValid) {
        const travel_event = {
          ...this.travel_event,
          id: uuidv4(),
          travel_id: this.travel.id,
          created_by: this.$store.state.user.resource_owner.email,
        };
        if (this.$store.dispatch("createTravelEvent", travel_event )) {
          setTimeout(() => {
            this.$router.push({ name: "TravelDetails" })
          }, 2500) 
        } else {
          alert("Error adding Travel Event System " + travel_event.title);
        }
      } else {
        alert("Please correct required fields and resubmit");
      }
    },
    requiredCourse: function (value) {
      if (value) {
        this.isCourseValid = true
        return true;
      } else {
          this.isFormValid = false
          this.isCourseValid = false
          return 'Please enter Course';
      }
    },
    requiredTitle: function (value) {
      if (value) {
        this.isTitleValid = true
        return true;
      } else {
          this.isFormValid = false
          this.isTitleValid = false
          return 'Please enter Event Title';
      }
    },
    requiredStartDate: function (value) {
      if (value) {
        this.isStartDateValid = true
        return true;
      } else {
          this.isFormValid = false
          this.isStartDateValid = false
          return 'Please enter Start Date';
      }
    },
    checkValidations() {
      if (this.isTitleValid &&
          this.isStartDateValid 
        ) 
      {
        this.isFormValid = true
      } else {
        this.isFormValid = false
      }
    },
  },
};
</script>
<style scoped lang="css">
/* Create two equal columns that floats next to each other */
.column {
  float: left;
  width: 33%;
  padding: 10px;
  /*height: 300px; /* Should be removed. Only for demonstration */
}

/* Clear floats after the columns */
.row:after {
  content: "";
  display: table;
  clear: both;
}
.v-icon {
  color: darkslategrey;
  top: -0.2rem;
}
#form-container {
  text-align: left;
  width: 75% !important;
}
[type="checkbox"],
#notes {
  width: 100%;
  height: 4rem;
}
.button {
  margin: 30px;
  background-color: #39495c;
  border-radius: 5px;
  font-size: 18px;
  width: 160px;
  height: 60px;
  color: white;
  padding: 20px;
  box-shadow: inset 0 -0.6em 1em -0.35em rgba(0, 0, 0, 0.17),
    inset 0 0.6em 2em -0.3em rgba(255, 255, 255, 0.15),
    inset 0 0 0em 0.05em rgba(255, 255, 255, 0.12);
  text-align: center;
  cursor: pointer;
}
label {
  font-size: 20px;
  margin-bottom: 5px;
}
input {
  width: 100%;
  height: 40px;
  margin-bottom: 20px;
}
fieldset {
  border: 0;
  margin: 0;
  padding: 0;
}
select {
  border-color: darkgreen;
}
legend {
  font-size: 28px;
  font-weight: 700;
  margin-top: 20px;
}
.label-visible {
  top: -35px;
  left: 4px;
  visibility: visible;
}
.label-invisible {
  top: -10px;
  left: 4px;
  visibility: hidden;
}
.input-field {
  margin-top: 30px;
  position: relative;
}
.input-field > input {
  width: 100%;
}
.input-field > p {
  position: absolute;
  font-size: 14px;
  transition: 0.3s;
}
</style>
