<template>
  <v-card class="mx-auto mt-5">
    <v-card-title class="pb-0">
      <h3>Create a Travel to Track</h3>
    </v-card-title>
  </v-card>
  <v-card-text>
    <v-form @submit.prevent="onSubmit">    
      <v-container id="form-container">
        <v-text-field
          v-model="travel.title"
          :rules="[requiredTitle]"
          label="Title"
        >
          <template v-slot:prepend-inner>
            <v-icon class="icon-css">mdi-magnify</v-icon>
          </template>
        </v-text-field>          
        <v-textarea
          label="Description"
          v-model="travel.description"
          clearable
        >
          <template v-slot:prepend-inner>
              <v-icon class="icon-css">mdi-note</v-icon>
            </template>
        </v-textarea>
        <v-text-field label="Start Date"
          v-model="travel.start_date"
          type="date"
        >
          <template v-slot:prepend-inner>
            <v-icon class="icon-css">mdi-calendar</v-icon>
          </template>
        </v-text-field>
        <v-text-field label="End Date"
          v-model="travel.end_date"
          type="date"
        >
          <template v-slot:prepend-inner>
            <v-icon class="icon-css">mdi-calendar</v-icon>
          </template>
        </v-text-field>
        <v-text-field
          v-model="travel.url_reference"
          label="URL to Review"
          placeholder="URL to Reference"
        >
          <template v-slot:prepend-inner>
            <v-icon class="icon-css">mdi-link</v-icon>
          </template>
        </v-text-field>        
        <span>
          {{ urlMaxLength - travel.url_reference.length }} / {{ urlMaxLength }}
        </span>
        <v-textarea
          label="Notes"
          v-model="travel.notes"
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
  components: {},
  data()  {
    return {
      travel: {
        title: "",
        description: "",
        destination: "",
        start_date: "",
        end_date: "",
        url_reference: "",
        notes: "",
        created_by: this.$store.state.user.resource_owner.email,
      },
      urlMaxLength: 255,
      isFormValid: false,
      isTitleValid: false,
      num: 1,
    };
  },
  methods: {
    onSubmit() {
      this.checkValidations();
      if (this.isFormValid) {
        const travel = {
          ...this.travel,
          id: uuidv4(),
          created_by: this.$store.state.user.resource_owner.email,
        };
        if (this.$store.dispatch("createTravel", travel)) {
          this.$router.push({ name: "TravelList" });
        } else {
          alert("Error adding Travel Location " + travel.title);
        }
      } else {
        alert("Please correct required fields and resubmit");
      }        
    },
    requiredTitle: function (value) {
      if (value) {
          this.isTitleValid = true
          return true;
      } else {
          this.isFormValid = false
          this.isTitleValid = false
          return 'Please enter Title';
      }
    },
    checkValidations() {
      if (this.isTitleValid) {
        this.isFormValid = true
      } else {
        this.isFormValid = false
      }
    }
  },
};
</script>
<style>
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
