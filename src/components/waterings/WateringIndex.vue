<template>
  <confirm-dialogue ref="confirmDialogue"></confirm-dialogue>
  <h3 id="h3-left">Total: {{ sortedWaterings.length }} Watering{{ sortedWaterings.length === 1 ? '' : 's' }}</h3>
  <v-table density="compact">
    <tr>
      <th id="background-blue" @click="sortList('name')">Name</th>
      <th id="background-blue" @click="sortList('target')">Target</th>
      <th id="background-blue" @click="sortList('start_time')">Start</th>
      <th id="background-blue" @click="sortList('end_time')">End</th>
      <th id="background-blue" @click="sortList('location')">Location</th>
      <th id="background-blue" @click="sortList('days')">Days</th>

      <th id="background-blue">Notes</th>
      <th class="th-center" id="background-blue">Actions</th>
    </tr>
    <tr v-for="watering in sortedWaterings" :key="watering.id">
      <td>{{ watering.name }}</td>
      <td>{{ watering.target }}</td>
      <td>{{ formatTime(watering.start_time) }}</td>
      <td>{{ formatTime(watering.end_time) }}</td>
      <td>{{ watering.location }}</td>
      <td>{{ watering.days }}</td>
      <td>{{ watering.notes }}</td>
      <td>{{ watering.name }} (ID: {{ watering.id || 'UNDEFINED' }})</td>
      <td style="padding-left: 0">
        <!--span v-if="this.onlineStatus"-->
          <span class="fa-stack">
            <router-link
              :to="{ name: 'WateringEdit', params: { id: `${watering.id}` } }"
            >
              <i
                id="travel-icon-edit"
                class="fa-solid fa-pen-to-square fa-stack-1x"
              >
              </i>
            </router-link>
            <span class="fa-stack fa-table-stack">
              <router-link :to="{ name: 'Waterings' }">
                <i class="fa fa-eye" id="action-eye-icon"></i>
              </router-link>
            </span>
            <span class="fa-table-stack" id="action-delete-icon">
              <i
                @click="deleteWatering(watering)"
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
import DateFormatService from "@/services/DateFormatService.js";
const props = defineProps({
  waterings: { type: Array, required: true }
});
// Emits
const emit = defineEmits(['edit','delete']);
// State
const onlineStatus = ref(navigator.onLine);

const sortKey = ref('name');
const sortAsc = ref(false);
//?const inputSearchText = ref("");
const sortedWaterings = computed(() => {
  const arr = [...props.waterings];
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
function deleteWatering(watering) {
  emit('delete', watering);
}
function formatTime(value) {
  if (!value) {
    return '';
  }
  return DateFormatService.formatTimejs(value);
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

