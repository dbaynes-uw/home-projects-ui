<template>
  <div class="health-marker-index-wrapper">
    <!-- ✅ TABLE CARD -->
    <div class="card">
      <!-- ✅ TABLE CONTAINER -->
      <div class="table-container">
        <table class="data-table">
          <!-- Table Header -->
          <thead>
            <tr>
              <th class="sortable-header" @click="setSort('panelName')">
                <span class="sort-header-content">
                  Panel Name
                  <i :class="getSortIcon('panelName')"></i>
                </span>
              </th>
              <th class="sortable-header" @click="setSort('markerName')">
                <span class="sort-header-content">
                  Marker Name
                  <i :class="getSortIcon('markerName')"></i>
                </span>
              </th>
              <th class="sortable-header" @click="setSort('testDate')">
                <span class="sort-header-content">
                  Test Date
                  <i :class="getSortIcon('testDate')"></i>
                </span>
              </th>
              <th></th>
              <th>Result</th>
              <th class="sortable-header" @click="setSort('status')">
                <span class="sort-header-content">
                  Status
                  <i :class="getSortIcon('status')"></i>
                </span>
              </th>
              <th>Lab</th>
              <th>Doctor</th>
              <th>Actions</th>
            </tr>
          </thead>

          <!-- Table Body -->
          <tbody>
            <tr
              v-for="marker in sortedHealthMarkers"
              :key="marker.id"
              @dblclick="viewDetails(marker)"
              class="table-row-clickable"
            >
              <!-- Panel Name -->
              <td class="panel-name-cell">
                <button
                  v-if="marker.health_marker_panel_id"
                  @click.stop="viewPanelEdit(marker)"
                  class="panel-link-btn"
                  :title="`Edit ${marker.panel_name || 'panel'}`"
                >
                  {{ marker.panel_name || '-' }}
                </button>
                <span v-else>-</span>
              </td>

              <!-- Marker Name -->
              <td class="marker-name-cell">
                <div class="cell-content">
                  <i class="fas fa-vial icon-health"></i>
                  <span class="marker-name">{{
                    getMarkerLabel(marker.marker_name)
                  }}</span>
                </div>
              </td>

              <!-- Test Date -->
              <td class="date-cell">
                {{ formatDate(marker.marker_date) }}
              </td>
              <td></td>
              <!-- Result -->
              <td class="result-cell">
                <span class="result-value"
                  >{{ marker.marker_result }} {{ marker.unit }}</span
                >
              </td>

              <!-- Status -->
              <td class="status-cell">
                <span :class="['badge', getStatusClass(marker)]">
                  {{ getStatusText(marker) }}
                </span>
              </td>

              <!-- Lab -->
              <td class="lab-cell">
                {{ marker.lab_name || "-" }}
              </td>

              <!-- Doctor -->
              <td class="doctor-cell">
                {{ marker.doctor_name || "-" }}
              </td>

              <!-- Actions -->
              <td class="actions-cell">
                <div class="action-buttons">
                  <button
                    @click.stop="viewDetails(marker)"
                    class="btn btn-sm btn-info"
                    title="View Details"
                  >
                    <i class="fas fa-eye"></i>
                  </button>

                  <button
                    @click.stop="$emit('edit', marker)"
                    class="btn btn-sm btn-primary"
                    title="Edit"
                  >
                    <i class="fas fa-edit"></i>
                  </button>

                  <button
                    @click.stop="$emit('delete', marker)"
                    class="btn btn-sm btn-danger"
                    title="Delete"
                  >
                    <i class="fas fa-trash"></i>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- ✅ EMPTY STATE -->
      <div v-if="healthMarkers.length === 0" class="empty-state-table">
        <i class="fas fa-vials"></i>
        <p>No health markers found</p>
      </div>

      <!-- ✅ TABLE FOOTER -->
      <div class="table-footer">
        <div class="table-info">
          <i class="fas fa-info-circle"></i>
          Showing {{ healthMarkers.length }} marker{{
            healthMarkers.length !== 1 ? "s" : ""
          }}
        </div>
        <div class="table-hint">
          <i class="fas fa-hand-pointer"></i>
          Double-click a row to view details
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useMarkerDefinitionStore } from "@/stores/health/MarkerDefinitionStore";
import {
  getHealthMarkerByName,
  getResultStatus,
} from "@/services/health-marker-constants";

// ✅ ROUTER
const router = useRouter();
const markerDefinitionStore = useMarkerDefinitionStore();

// ✅ PROPS
const props = defineProps({
  healthMarkers: {
    type: Array,
    required: true,
  },
});

// ✅ EMITS
defineEmits(["edit", "delete"]);

// ✅ SORTING
const sortField = ref("testDate");
const sortDirection = ref("desc");

const sortedHealthMarkers = computed(() => {
  const markers = [...props.healthMarkers];

  const getSortValue = (marker) => {
    if (sortField.value === "panelName") return (marker.panel_name || "").toLowerCase();
    if (sortField.value === "markerName") return (getMarkerLabel(marker.marker_name) || "").toLowerCase();
    if (sortField.value === "status") return (getStatusText(marker) || "").toLowerCase();
    if (sortField.value === "testDate") {
      const parsedDate = marker.marker_date ? new Date(marker.marker_date).getTime() : 0;
      return Number.isNaN(parsedDate) ? 0 : parsedDate;
    }
    return "";
  };

  markers.sort((a, b) => {
    const valueA = getSortValue(a);
    const valueB = getSortValue(b);

    let comparison = 0;
    if (typeof valueA === "number" && typeof valueB === "number") {
      comparison = valueA - valueB;
    } else {
      comparison = String(valueA).localeCompare(String(valueB), undefined, { sensitivity: "base" });
    }

    return sortDirection.value === "asc" ? comparison : -comparison;
  });

  return markers;
});

// ✅ METHODS
function getMarkerLabel(markerName) {
  const markerInfo = getMarkerDefinition(markerName) || getHealthMarkerByName(markerName);
  return markerInfo?.label || markerName;
}

function getStatusText(marker) {
  const intelligentStatus = getResultStatus(
    getMarkerDefinition(marker.marker_name) || marker.marker_name,
    marker.marker_result
  );
  if (intelligentStatus) {
    return intelligentStatus.title;
  }
  return marker.status || "Unknown";
}

function getStatusClass(marker) {
  const intelligentStatus = getResultStatus(
    getMarkerDefinition(marker.marker_name) || marker.marker_name,
    marker.marker_result
  );

  if (intelligentStatus) {
    const typeMap = {
      success: "badge-success",
      warning: "badge-warning",
      error: "badge-danger",
      info: "badge-info",
    };
    return typeMap[intelligentStatus.type] || "badge-secondary";
  }

  // Fallback to database status
  if (!marker.status) return "badge-secondary";

  const lower = marker.status.toLowerCase();
  if (lower === "normal") return "badge-success";
  if (lower === "high" || lower === "low") return "badge-warning";
  if (lower === "critical") return "badge-danger";
  return "badge-info";
}

function getMarkerDefinition(markerName) {
  return markerDefinitionStore.getDefinitionByName(markerName);
}

function setSort(field) {
  if (sortField.value === field) {
    sortDirection.value = sortDirection.value === "asc" ? "desc" : "asc";
    return;
  }

  sortField.value = field;
  sortDirection.value = field === "testDate" ? "desc" : "asc";
}

function getSortIcon(field) {
  if (sortField.value !== field) return "fas fa-sort sort-icon";
  return sortDirection.value === "asc"
    ? "fas fa-sort-up sort-icon sort-icon-active"
    : "fas fa-sort-down sort-icon sort-icon-active";
}

function formatDate(dateString) {
  if (!dateString) return "-";

  try {
    const [year, month, day] = dateString.split('-');
    const date = new Date(Number(year), Number(month) - 1, Number(day));  
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  } catch (error) {
    console.log("Date formatting error:", error);
    return dateString;
  }
}

function viewDetails(marker) {
  router.push({
    name: "HealthMarkerDetails",
    params: { id: marker.id },
  });
}

function viewPanelEdit(marker) {
  if (!marker?.health_marker_panel_id) return;

  router.push({
    name: "HealthMarkerPanelEdit",
    params: { id: marker.health_marker_panel_id },
  });
}

onMounted(() => {
  markerDefinitionStore.fetchDefinitions();
});
</script>

<style scoped>
/* ✅ IMPORT SHARED HEALTH STYLES */
@import "@/assets/styles/health/health-shared.css";

/* ========================================
   COMPONENT-SPECIFIC STYLES
   ======================================== */

.health-marker-index-wrapper {
  width: 100%;
}

/* Table container with horizontal scroll */
.table-container {
  width: 100%;
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
}

/* Data table */
.data-table {
  width: 100%;
  border-collapse: collapse;
  background: white;
}

/* Table header */
.data-table thead {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.data-table thead th {
  padding: 1rem;
  text-align: center;
  font-weight: 600;
  font-size: 0.875rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  white-space: nowrap;
  border-bottom: 2px solid #667eea;
}

.sortable-header {
  cursor: pointer;
  user-select: none;
}

.sort-header-content {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
}

.sort-icon {
  opacity: 0.5;
  font-size: 0.75rem;
}

.sort-icon-active {
  opacity: 1;
}

.data-table thead th:first-child {
  border-radius: 8px 0 0 0;
}

.data-table thead th:last-child {
  border-radius: 0 8px 0 0;
}

/* Table body */
.data-table tbody tr {
  border-bottom: 1px solid #e5e7eb;
  transition: all 0.2s ease;
}

.data-table tbody tr:hover {
  background: #f9fafb;
  transform: translateX(2px);
}

.table-row-clickable {
  cursor: pointer;
}

.data-table tbody td {
  padding: 1rem;
  font-size: 0.875rem;
  color: #374151;
  vertical-align: middle;
}

/* Panel name cell */
.panel-name-cell {
  min-width: 180px;
  font-weight: 600;
  color: #4b5563;
}

.panel-link-btn {
  background: none;
  border: none;
  padding: 0;
  margin: 0;
  color: #3b82f6;
  font-weight: 600;
  cursor: pointer;
  text-decoration: underline;
}

.panel-link-btn:hover {
  color: #1d4ed8;
}

/* Marker name cell */
.marker-name-cell {
  min-width: 200px;
}

.cell-content {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.marker-name {
  font-weight: 600;
  color: #1f2937;
}

/* Date cell */
.date-cell {
  min-width: 120px;
  color: #6b7280;
}

/* Result cell */
.result-cell {
  color: #6b7280;
  min-width: 120px;
}

.result-value {
  font-weight: 700;
  color: #667eea;
  font-size: 1rem;
}

.result-unit {
  font-size: 0.75rem;
  color: #9ca3af;
  margin-left: 0.25rem;
}

/* Status cell */
.status-cell {
  min-width: 120px;
}

/* Lab cell */
.lab-cell {
  min-width: 150px;
  color: #6b7280;
}

/* Doctor cell */
.doctor-cell {
  min-width: 120px;
  color: #6b7280;
}

/* Actions cell */
.actions-cell {
  min-width: 160px;
  text-align: right;
}

.actions-column {
  text-align: right !important;
}

.action-buttons {
  display: flex;
  gap: 0.5rem;
  justify-content: flex-end;
}

.btn-sm {
  padding: 0.5rem;
  font-size: 0.875rem;
  min-width: 36px;
}

/* Empty state for table */
.empty-state-table {
  text-align: center;
  padding: 4rem 2rem;
  color: #9ca3af;
}

.empty-state-table i {
  font-size: 3rem;
  margin-bottom: 1rem;
  display: block;
  opacity: 0.5;
}

.empty-state-table p {
  margin: 0;
  font-size: 1rem;
}

/* Table footer */
.table-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background: #f9fafb;
  border-top: 1px solid #e5e7eb;
  border-radius: 0 0 8px 8px;
}

.table-info {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  color: #6b7280;
}

.table-info i {
  color: #667eea;
}

.table-hint {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.75rem;
  color: #9ca3af;
}

.table-hint i {
  color: #667eea;
}

/* Responsive */
@media (max-width: 768px) {
  .data-table thead th,
  .data-table tbody td {
    padding: 0.75rem 0.5rem;
    font-size: 0.8125rem;
  }

  .marker-name-cell {
    min-width: 160px;
  }

  .action-buttons {
    flex-direction: column;
    gap: 0.25rem;
  }

  .btn-sm {
    width: 100%;
  }

  .table-footer {
    flex-direction: column;
    gap: 0.75rem;
    text-align: center;
  }

  .table-hint {
    display: none;
  }
}

/* Print styles */
@media print {
  .action-buttons {
    display: none;
  }

  .table-hint {
    display: none;
  }

  .data-table tbody tr:hover {
    background: white;
    transform: none;
  }
}
</style>
