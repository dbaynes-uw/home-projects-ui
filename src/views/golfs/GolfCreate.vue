<template>
  <v-card class="mx-auto mt-5">
    <v-card-title class="pb-0">
      <h3>Add Round</h3>
    </v-card-title>
    <h4>
      <router-link :to="{ name: 'GolfList' }">Back to Golf List</router-link>
    </h4>
  </v-card>
  <GolfInput />
</template>

<script setup>
import GolfInput from '@/components/golfs/GolfInput.vue'
</script>
<style lang="css">
.g-container {
  display: grid;
  grid-template-columns: repeat(9, 1fr);
  grid-gap: .5rem;
  background-color: #fff;
}
.width-9 {
  grid-column: span 1;
  width: 2.5rem;
  border-style: solid;
  border-width: thin;
  text-align: center;
}
.g-container div {
  display: flex;
  flex-flow: row nowrap;
}
.container div input {
  flex-grow: 1;
  max-width: 100%;
}
.g-label {
  text-align: center;
  font-size: 1rem;
}
.text-style-select {
  width: 100%;
  background-color: #d3d3d330;
  border-style: groove;
  border-width: .5px;
}
/*.v-text-field input.v-field__input {
  font-size: .6rem !important;
}*/
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
