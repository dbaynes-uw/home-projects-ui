<template>
  <confirm-dialogue ref="confirmDialogue"></confirm-dialogue>
  <div id="index-count-display">
    <span class="filtered-count">
      Showing {{ sortedGardens.length }} Garden{{ sortedGardens.length === 1 ? '' : 's' }}
    </span>
    <br/>
  </div>
  <div class="table-responsive">
    <table class="data-table">
      <thead>
        <tr>
          <th id="background-blue" @click="sortList('name')">Garden Name</th>
          <th id="background-blue">Notes</th>
          <th class="th-center actions-column" id="background-blue">Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="garden in sortedGardens" :key="garden.id" garden="garden">
          <td class="garden-name-cell">{{ garden.name }}</td>
          <td class="notes-cell">{{ garden.notes }}</td>
          <td class="actions-cell">
            <div class="action-icons">
              <router-link
                :to="{ name: 'GardenEdit', params: { id: `${garden.id}` } }"
                class="action-link"
                title="Edit Garden"
                aria-label="Edit Garden"
              >
                <i class="fa-solid fa-pen-to-square"></i>
              </router-link>
              <router-link
                :to="{ name: 'GardenDetails', params: { id: `${garden.id}` } }"
                class="action-link"
                title="View Garden"
                aria-label="View Garden"
              >
                <i class="fa fa-eye"></i>
              </router-link>
              <button
                type="button"
                @click="deleteGarden(garden)"
                class="action-button"
                title="Delete Garden"
                aria-label="Delete Garden"
              >
                <i class="fas fa-trash-alt"></i>
              </button>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
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
const sortKey = ref('name');
const sortAsc = ref(false);
const sortedGardens = computed(() => {
  const arr = [...props.gardens];
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
function deleteGarden(garden) {
  emit('delete', garden);
}
</script>
<style scoped>
.table-responsive {
  width: 100%;
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
}

.data-table {
  width: 100%;
  min-width: 560px;
  table-layout: auto;
}

.actions-column {
  position: sticky;
  right: 0;
  z-index: 3;
  min-width: 8.5rem;
  width: 8.5rem;
  background: #375a7f;
}

.actions-cell {
  position: sticky;
  right: 0;
  z-index: 2;
  min-width: 8.5rem;
  width: 8.5rem;
  background: inherit;
  box-shadow: -6px 0 8px -8px rgba(15, 23, 42, 0.45);
  white-space: nowrap;
}

.garden-name-cell {
  min-width: 11rem;
}

.action-icons {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
}

.action-link,
.action-button {
  width: 1.9rem;
  height: 1.9rem;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: 0;
  border-radius: 6px;
  background: transparent;
  padding: 0;
  cursor: pointer;
}

.notes-cell {
  min-width: 16rem;
  max-width: 34ch;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

i {
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

@media (max-width: 768px) {
  .data-table {
    font-size: 0.82rem;
    min-width: 520px;
  }

  .action-icons {
    justify-content: flex-start;
    gap: 0.2rem;
  }

  .action-link,
  .action-button {
    width: 1.8rem;
    height: 1.8rem;
  }
}
</style>

