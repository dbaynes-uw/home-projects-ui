<template>
  <v-container>
    <h1>Add Garden</h1>
    <router-link :to="{ name: 'Gardens' }">
      <h3><b>Back to Gardens</b></h3>
    </router-link>
    <br/>
    <v-form @submit.prevent="createGarden" ref="form">
      <v-row>
        <!-- Garden Name Input -->
         <v-col cols="12">
           <v-text-field
             v-model="garden.name"
             :rules="[requiredGardenName]"
             label="Garden Name"
             class="wide-input"
           >
            <template v-slot:prepend-inner>
              <v-icon class="icon-css">mdi-magnify</v-icon>
            </template>
          </v-text-field>
        </v-col>
        <v-col cols="12">
          <v-textarea label="Notes"
            v-model="garden.notes"
            class="wide-input"
          >
            <template v-slot:prepend-inner>
              <v-icon class="icon-css">mdi-note</v-icon>
            </template>
          </v-textarea>
        </v-col>
      </v-row>
      <!-- Action Buttons -->
      <v-row>
        <v-col cols="12">
          <v-btn color="primary" type="submit" aria-label="Submit">
            Create
          </v-btn>
          <v-btn color="secondary" :to="{ name: 'Gardens' }" aria-label="Go back to the gardens list">
            Back to List
          </v-btn>
        </v-col>
      </v-row>
    </v-form>
  </v-container>
</template>
<script setup>
import { ref, onMounted } from 'vue';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';
import { v4 as uuidv4 } from 'uuid';
  const store = useStore();
  const router = useRouter();
  
  import { reactive } from 'vue';

  const garden = reactive({
    name: '',
    notes: '',
    created_by: '',
    status: '',
  });

  const isGardenNameValid = ref(false),
  isFormValid = ref(false);

  const createGarden = async () => {
    checkValidations();
    if (isFormValid.value) {
      const gardenData = {
        id: uuidv4(),
        name: garden.name,
        notes: garden.notes,
        status: garden.status,
        created_by: store.state.user.resource_owner.email,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      await store.dispatch("createGarden", gardenData);
      if (store.state.garden) {
        router.push({ name: "Gardens" });
      } else {
        alert("Error adding Garden Name" + garden.name);
      }
    } else {
      alert("Please correct required fields and resubmit");
    }
  };
  const requiredGardenName = (value) => {
    if (value) {
      isGardenNameValid.value = true;
      return true;
    } else {
      isFormValid.value = false;
      isGardenNameValid.value = false;
      return 'Please enter Garden Name';
    }
  };
  const checkValidations = () => {
    if (isGardenNameValid.value) {
      isFormValid.value = true;
    } else {
      isFormValid.value = false;
    }
  };
  onMounted(() => {
    //garden.value.created_by = store.state.user.resource_owner.email;
  });
</script>
<style lang="css">
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
