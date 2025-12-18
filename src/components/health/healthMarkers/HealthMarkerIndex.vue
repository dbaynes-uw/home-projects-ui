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
              <th>Marker Name</th>
              <th>Test Date</th>
              <th>Result</th>
              <th>Status</th>
              <th>Lab</th>
              <th>Doctor</th>
              <th class="actions-column">Actions</th>
            </tr>
          </thead>

          <!-- Table Body -->
          <tbody>
            <tr 
              v-for="marker in healthMarkers" 
              :key="marker.id"
              @dblclick="viewDetails(marker)"
              class="table-row-clickable"
            >
              <!-- Marker Name -->
              <td class="marker-name-cell">
                <div class="cell-content">
                  <i class="fas fa-vial icon-health"></i>
                  <span class="marker-name">{{ getMarkerLabel(marker.marker_name) }}</span>
                </div>
              </td>

              <!-- Test Date -->
              <td class="date-cell">
                {{ formatDate(marker.marker_date) }}
              </td>

              <!-- Result -->
              <td class="result-cell">
                <span class="result-value">{{ marker.marker_result }}</span>
                <span v-if="marker.unit" class="result-unit">{{ marker.unit }}</span>
              </td>

              <!-- Status -->
              <td class="status-cell">
                <span :class="['badge', getStatusClass(marker)]">
                  {{ getStatusText(marker) }}
                </span>
              </td>

              <!-- Lab -->
              <td class="lab-cell">
                {{ marker.lab_name || '-' }}
              </td>

              <!-- Doctor -->
              <td class="doctor-cell">
                {{ marker.doctor_name || '-' }}
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
          Showing {{ healthMarkers.length }} marker{{ healthMarkers.length !== 1 ? 's' : '' }}
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
import { defineProps, defineEmits } from 'vue';
import { useRouter } from 'vue-router';
import { getHealthMarkerByName, getResultStatus } from '@/services/health-marker-constants';

// ✅ ROUTER
const router = useRouter();

// ✅ PROPS
defineProps({
  healthMarkers: {
    type: Array,
    required: true
  }
});

// ✅ EMITS
defineEmits(['edit', 'delete']);

// ✅ METHODS
function getMarkerLabel(markerName) {
  const markerInfo = getHealthMarkerByName(markerName);
  return markerInfo?.label || markerName;
}

function getStatusText(marker) {
  const intelligentStatus = getResultStatus(marker.marker_name, marker.marker_result);
  if (intelligentStatus) {
    return intelligentStatus.title;
  }
  return marker.status || 'Unknown';
}

function getStatusClass(marker) {
  const intelligentStatus = getResultStatus(marker.marker_name, marker.marker_result);
  
  if (intelligentStatus) {
    const typeMap = {
      'success': 'badge-success',
      'warning': 'badge-warning',
      'error': 'badge-danger',
      'info': 'badge-info'
    };
    return typeMap[intelligentStatus.type] || 'badge-secondary';
  }
  
  // Fallback to database status
  if (!marker.status) return 'badge-secondary';
  
  const lower = marker.status.toLowerCase();
  if (lower === 'normal') return 'badge-success';
  if (lower === 'high' || lower === 'low') return 'badge-warning';
  if (lower === 'critical') return 'badge-danger';
  return 'badge-info';
}

function formatDate(dateString) {
  if (!dateString) return '-';
  
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  } catch (error) {
    return dateString;
  }
}

function viewDetails(marker) {
  router.push({ 
    name: 'HealthMarkerDetails', 
    params: { id: marker.id } 
  });
}
</script>

<style scoped>
/* ✅ IMPORT SHARED HEALTH STYLES */
@import '@/assets/styles/health/health-shared.css';

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
  text-align: left;
  font-weight: 600;
  font-size: 0.875rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  white-space: nowrap;
  border-bottom: 2px solid #667eea;
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