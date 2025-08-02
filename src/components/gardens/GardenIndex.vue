<template>
  <confirm-dialogue ref="confirmDialogue"></confirm-dialogue>
  <div id="index-count-display">
    <span class="filtered-count">
      Showing {{ sortedGardens.length }} Garden{{ sortedGardens.length === 1 ? '' : 's' }}
    </span>
    <br/>
  </div>
  <v-table density="compact">
    <tr>
      <th id="background-blue" @click="sortList('name')">Garden Name</th>
      <th id="background-blue">Notes</th>
      <th class="th-center" id="background-blue">Actions</th>
    </tr>
    <tr v-for="garden in sortedGardens" :key="garden.id" garden="garden">
      <td>{{ garden.name }}</td>
      <td>{{ garden.notes }}</td>
      <td style="padding-left: 0">
        <!--span v-if="this.onlineStatus"-->
          <span class="fa-stack">
            <router-link
              :to="{ name: 'GardenEdit', params: { id: `${garden.id}` } }"
            >
              <i
                id="travel-icon-edit"
                class="fa-solid fa-pen-to-square fa-stack-1x"
              >
              </i>
            </router-link>
            <span class="fa-stack fa-table-stack">
              <router-link
                :to="{ name: 'GardenDetails', params: { id: `${garden.id}` } }"
              >
                <i class="fa fa-eye" id="action-eye-icon"></i>
              </router-link>
            </span>
            <span class="fa-table-stack" id="action-delete-icon">
              <i
                @click="deleteGarden(garden)"
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
  gardens: { type: Array, required: true }
});
// Emits
const emit = defineEmits(['edit','delete']);
const onlineStatus = ref(navigator.onLine);
//const sortKey = ref('reading_date');
//const sortAsc = ref(false);
const inputSearchText = ref("");
const sortedGardens = computed(() => {
  return props.gardens.filter(garden => {
    return garden.name.toLowerCase().includes(inputSearchText.value.toLowerCase()) ||
           (garden.notes && garden.notes.toLowerCase().includes(inputSearchText.value.toLowerCase()));
  });
});
function deleteGarden(garden) {
  emit('delete', garden);
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

