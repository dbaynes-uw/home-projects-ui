<template>
  <confirm-dialogue ref="confirmDialogue"></confirm-dialogue>
  <div id="index-count-display">
    <span class="filtered-count">
      Showing {{ sortedPlants.length }} Plant{{ sortedPlants.length === 1 ? '' : 's' }}
    </span>
    <br/>
  </div>
  <v-table density="compact">
    <tr>
      <th id="background-blue" @click="sortList('plant_name')">Plant Name</th>
      <th id="background-blue">Notes</th>
      <th class="th-center" id="background-blue">Actions</th>
    </tr>
    <tr v-for="plant in sortedPlants" :key="plant.id">
      <td>{{ plant.plant_name }}</td>
      <td>{{ plant.notes }}</td>
      <td style="padding-left: 0">
        <!--span v-if="this.onlineStatus"-->
          <span class="fa-stack">
            <router-link
              :to="{ name: 'PlantEdit', params: { id: `${plant.id}` } }"
            >
              <i
                id="travel-icon-edit"
                class="fa-solid fa-pen-to-square fa-stack-1x"
              >
              </i>
            </router-link>
            <span class="fa-stack fa-table-stack">
              <router-link
                :to="{ name: 'PlantDetails', params: { id: `${plant.id}` } }"
              >
                <i class="fa fa-eye" id="action-eye-icon"></i>
              </router-link>
            </span>
            <span class="fa-table-stack" id="action-delete-icon">
              <i
                @click="deletePlant(plant)"
                class="fas fa-trash-alt fa-stack-1x"
                id="travel-icon-delete"
              >
              </i>
            </span>
          </span>
      </td>
    </tr>
  </v-table>
  <br />
  <b>Online Status: {{ onlineStatus }}</b>
</template>
<script setup>
import { ref, computed } from 'vue';
import ConfirmDialogue from "@/components/ConfirmDialogue.vue";
//import DateFormatService from "@/services/DateFormatService.js";
// Props
const props = defineProps({
  plants: { type: Array, required: true }
});
// Emits
const emit = defineEmits(['edit','delete']);
const onlineStatus = ref(navigator.onLine);
const sortKey = ref('plant_name');
const sortAsc = ref(false);
const inputSearchText = ref("");
// Computed sorted plants
const sortedPlants = computed(() => {
  const arr = [...props.plants];
  arr.sort((a, b) => {
    if (a[sortKey.value] < b[sortKey.value]) return sortAsc.value ? -1 : 1;
    if (a[sortKey.value] > b[sortKey.value]) return sortAsc.value ? 1 : -1;
    return 0;
  });
  return arr;
});
function sortList(key) {
  if (sortKey.value === key) {
    sortAsc.value = !sortAsc.value;
  } else {
    sortKey.value = key;
    sortAsc.value = true;
  }
}
function deletePlant(plant) {
  emit('delete', plant);
}
</script>
<style scoped>
#action-eye-icon {
  top: 0.4rem;
  font-size: 18px;
}
#action-delete-icon {
  position: relative;
  top: 0.5rem;
  left: 2.3rem;
}
.fa-table-stack {
  position: relative;
  left: 2rem;
}
i {
  bottom: 0px;
  color: gray;
}
tr.is-complete {
  background: #35495e;
  color: #fff;
}
#status-message {
  text-align: center;
  color: navy;
}
</style>

