<template>
  <v-card class="mx-auto mt-5">
    <v-card-title class="pb-0">
      <h3>Create a Trail to Track</h3>
    </v-card-title>
  </v-card>
  <v-card-text>
    <v-form @submit.prevent="onSubmit">    
      <v-container id="form-container">
        <v-text-field
          v-model="trail.trail_head_name"
          :rules="[requiredTrailName]"
          label="Trail Head"
        >
          <template v-slot:prepend-inner>
            <v-icon class="icon-css">mdi-magnify</v-icon>
          </template>
        </v-text-field>
        <v-text-field
          v-model="trail.trail_location"
          label="Location"
        >
          <template v-slot:prepend-inner>
            <v-icon class="icon-css">mdi-magnify</v-icon>
          </template>
        </v-text-field>
        <v-text-field
          v-model="trail.distance"
          @keypress="onlyForDecimal"
          label="Distance (Miles)"
        >
          <template v-slot:prepend-inner>
            <v-icon class="icon-css">mdi-magnify</v-icon>
          </template>
        </v-text-field>
        <v-textarea
          v-model="trail.url_to_map"
          :maxlength="urlMaxLength"
          clearable
          label="URL to Map"
        >
          <template v-slot:prepend-inner>
            <v-icon class="icon-css">mdi-magnify</v-icon>
          </template>
        </v-textarea> 
        <span>
          {{ urlMaxLength - trail.url_to_map.length }} / {{ urlMaxLength }}
        </span>          
        <br/>
        <v-text-field
          label="Date Last Hiked"
          v-model="trail.date_last_hiked"
          type="date"
        >
          <template v-slot:prepend-inner>
            <v-icon class="icon-css">mdi-calendar</v-icon>
          </template>
        </v-text-field>
        <v-textarea
          v-model="trail.notes"
          label="Notes"
        >
          <template v-slot:prepend-inner>
            <v-icon class="icon-css">mdi-magnify</v-icon>
          </template>
        </v-textarea>   
        <v-btn type="submit" block class="mt-2">Submit</v-btn>
      </v-container>
    </v-form>
  </v-card-text>
</template>
<script>
import { v4 as uuidv4 } from "uuid";
export default {
  computed: {},
  data() {
    return {
      trail: {
        head_name: "",
        location: "",
        distance: "",
        url_to_map: "",
        date_last_hiked: "",
        notes: "",
        created_by: this.$store.state.user.resource_owner.email,
      },
      urlMaxLength: 255,
      isFormValid: false,
      isTrailNameValid: false,
      num: 1,
    };
  },
  methods: {
    onSubmit() {
      this.checkValidations();
      
      if (this.isFormValid) {
        const trail = {
          ...this.trail,
          id: uuidv4(),
          created_by: this.$store.state.user.resource_owner.email,
        };
        if (this.$store.dispatch("createTrail", trail)) {
          this.$router.push({ name: "TrailList" });
        } else {
          alert("Error adding Trail Location" + trail.location);
        }
      } else {
      alert("Please correct required fields and resubmit");
      }
    },  
    onlyForDecimal($event) {
      // console.log($event.keyCode); //keyCodes value
      let keyCode = $event.keyCode ? $event.keyCode : $event.which;
      // only allow number and one dot
      if (
        (keyCode < 48 || keyCode > 57) &&
        (keyCode !== 46 || this.trail.distance.indexOf(".") != -1) // 46 is dot
      ) {
        $event.preventDefault();
      }
      // restrict to 2 decimal places
      if (
        this.trail.distance != null &&
        this.trail.distance.indexOf(".") > -1 &&
        this.trail.distance.split(".")[1].length > 1
      ) {
        $event.preventDefault();
      }
    },
    requiredTrailName(value) {
      if (value) {
          this.isTrailNameValid = true
          this.isFormValid = true
          return true;
      } else {
        this.isFormValid = false
        this.isTrailNameValid = false
        return 'Please enter Trail Head Name';
      }
    },
    checkValidations() {
      if (this.isTrailNameValid) {
        this.isFormValid = true
      } else {
        this.isFormValid = false
      }
    },
  },
  trail() {
    return this.$store.state.trail;
  },
}
</script>
<style lang="css">
.add-form {
  display: flex;
  flex-direction: column;
  width: 425px;
  padding: 20px;
  margin: 40px;
  border: 2px solid #d8d8d8;
  background-color: white;
  -webkit-box-shadow: 0px 2px 15px -12px rgba(0, 0, 0, 0.57);
  -moz-box-shadow: 0px 2px 15px -12px rgba(0, 0, 0, 0.57);
  box-shadow: 2px 15px -12px rgba(0, 0, 0, 0.57);
}
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
</style>
