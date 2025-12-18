<template>
  <div class="oob-index-wrapper">
    <!-- ✅ TABLE CONTAINER -->
    <div class="table-container">
      <table class="data-table">
        <!-- ✅ TABLE HEADER -->
        <thead>
          <tr>
            <th class="col-date">
              <i class="fas fa-calendar-alt"></i>
              Date
            </th>
            <th class="col-duration">
              <i class="fas fa-clock"></i>
              Duration
            </th>
            <th class="col-circumstances">
              <i class="fas fa-notes-medical"></i>
              Circumstances
            </th>
            <th class="col-interval">
              <i class="fas fa-stopwatch"></i>
              Since Last
            </th>
            <th class="col-actions">
              <i class="fas fa-cog"></i>
              Actions
            </th>
          </tr>
        </thead>

        <!-- ✅ TABLE BODY -->
        <tbody>
          <tr
            v-for="oob in sortedOobs"
            :key="oob.id"
            class="table-row"
            @dblclick="handleView(oob)"
          >
            <!-- Date Column -->
            <td class="col-date">
              <div class="cell-content">
                <span class="date-value">{{ formatDate(oob.date_of_occurrence) }}</span>
                <span v-if="oob.created_by" class="creator-badge">
                  <i class="fas fa-user"></i>
                  {{ oob.created_by }}
                </span>
              </div>
            </td>

            <!-- Duration Column -->
            <td class="col-duration">
              <span :class="['badge', getDurationBadgeClass(oob.duration)]">
                {{ oob.duration || 'N/A' }}
              </span>
            </td>

            <!-- Circumstances Column -->
            <td class="col-circumstances">
              <div class="circumstances-text">
                {{ truncate(oob.circumstances, 100) }}
              </div>
              <div v-if="oob.notes" class="notes-preview">
                <i class="fas fa-comment"></i>
                {{ truncate(oob.notes, 50) }}
              </div>
            </td>

            <!-- Interval Column -->
            <td class="col-interval">
              <div v-if="hasInterval(oob)" class="interval-display">
                <span v-if="oob.interval_days" class="interval-part">
                  <strong>{{ oob.interval_days }}</strong>d
                </span>
                <span v-if="oob.interval_hours" class="interval-part">
                  <strong>{{ oob.interval_hours }}</strong>h
                </span>
                <span v-if="oob.interval_minutes" class="interval-part">
                  <strong>{{ oob.interval_minutes }}</strong>m
                </span>
              </div>
              <span v-else class="text-muted">—</span>
            </td>

            <!-- Actions Column -->
            <td class="col-actions">
              <div class="action-buttons">
                <button
                  @click.stop="handleView(oob)"
                  class="btn btn-info btn-sm"
                  title="View OOB Details"
                >
                  <i class="fas fa-eye"></i>
                </button>
                <button
                  @click.stop="handleEdit(oob)"
                  class="btn btn-primary btn-sm"
                  title="Edit OOB"
                >
                  <i class="fas fa-edit"></i>
                </button>
                <button
                  @click.stop="handleDelete(oob)"
                  class="btn btn-danger btn-sm"
                  title="Delete OOB"
                >
                  <i class="fas fa-trash"></i>
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>

      <!-- ✅ EMPTY STATE -->
      <div v-if="!oobs || oobs.length === 0" class="empty-state">
        <i class="fas fa-inbox"></i>
        <h3>No OOBs to Display</h3>
        <p>Start by adding your first OOB record</p>
      </div>

      <!-- ✅ HINT TEXT -->
      <p v-if="oobs && oobs.length > 0" class="hint-text">
        <i class="fas fa-hand-pointer"></i>
        Double click any row to view details
      </p>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useRouter } from 'vue-router';

// ✅ PROPS
const props = defineProps({
  oobs: {
    type: Array,
    required: true,
    default: () => []
  }
});

// ✅ EMITS
const emit = defineEmits(['edit', 'delete']);

// ✅ ROUTER
const router = useRouter();

// ✅ COMPUTED - SORT BY DATE (NEWEST FIRST)
const sortedOobs = computed(() => {
  if (!props.oobs) return [];
  
  return [...props.oobs].sort((a, b) => {
    const dateA = new Date(a.date_of_occurrence);
    const dateB = new Date(b.date_of_occurrence);
    return dateB - dateA; // Newest first
  });
});

// ✅ METHODS
const formatDate = (dateString) => {
  if (!dateString) return 'Unknown Date';
  
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  } catch (error) {
    console.error('Error formatting date:', error);
    return dateString;
  }
};

const truncate = (text, maxLength) => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

const getDurationBadgeClass = (duration) => {
  if (!duration) return 'badge-secondary';
  
  const lower = duration.toLowerCase();
  if (lower.includes('short')) return 'badge-success';
  if (lower.includes('long') && !lower.includes('very')) return 'badge-warning';
  if (lower.includes('very long')) return 'badge-danger';
  return 'badge-info';
};

const hasInterval = (oob) => {
  return oob.interval_days !== undefined || 
         oob.interval_hours !== undefined || 
         oob.interval_minutes !== undefined;
};

const handleView = (oob) => {
  router.push({ name: 'OobDetails', params: { id: oob.id } });
};

const handleEdit = (oob) => {
  router.push({ name: 'OobEdit', params: { id: oob.id } });
};

const handleDelete = (oob) => {
  emit('delete', oob);
};
</script>

<style scoped>
/* ✅ IMPORT SHARED HEALTH STYLES */
@import '@/assets/styles/health/health-shared.css';

/* ========================================
   COMPONENT-SPECIFIC STYLES
   ======================================== */

.oob-index-wrapper {
  width: 100%;
}

/* Table container with scroll */
.table-container {
  overflow-x: auto;
  margin-bottom: 2rem;
}

/* Table uses shared .data-table class but with OOB-specific tweaks */
.data-table {
  border-left: 4px solid #ef4444; /* OOB red accent */
}

/* Column widths */
.col-date {
  width: 20%;
  min-width: 180px;
}

.col-duration {
  width: 12%;
  min-width: 120px;
  text-align: center;
}

.col-circumstances {
  width: 35%;
  min-width: 250px;
}

.col-interval {
  width: 15%;
  min-width: 140px;
  text-align: center;
}

.col-actions {
  width: 12%;
  min-width: 140px;
  text-align: center;
}

/* Cell content styling */
.cell-content {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.date-value {
  font-weight: 600;
  color: #1f2937;
}

.creator-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  font-size: 0.75rem;
  color: #6b7280;
  padding: 2px 6px;
  background: #f3f4f6;
  border-radius: 4px;
  width: fit-content;
}

.circumstances-text {
  color: #374151;
  line-height: 1.4;
  margin-bottom: 0.25rem;
}

.notes-preview {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  color: #6b7280;
  font-style: italic;
}

.notes-preview i {
  color: #9ca3af;
}

/* Interval display */
.interval-display {
  display: flex;
  gap: 0.5rem;
  justify-content: center;
  align-items: center;
}

.interval-part {
  font-size: 0.875rem;
  color: #374151;
}

.interval-part strong {
  color: #1f2937;
  font-size: 1rem;
}

.text-muted {
  color: #9ca3af;
}

/* Action buttons in table */
.action-buttons {
  display: flex;
  gap: 0.5rem;
  justify-content: center;
  flex-wrap: wrap;
}

.btn-sm {
  padding: 0.5rem 0.75rem;
  font-size: 0.875rem;
}

/* Row hover effect */
.table-row {
  cursor: pointer;
  transition: all 0.2s ease;
}

.table-row:hover {
  background-color: rgba(239, 68, 68, 0.05) !important;
  transform: translateX(2px);
}

/* Responsive adjustments */
@media (max-width: 1024px) {
  .col-circumstances {
    min-width: 200px;
  }
  
  .col-interval {
    min-width: 120px;
  }
  
  .col-actions {
    min-width: 130px;
  }
}

@media (max-width: 768px) {
  .table-container {
    font-size: 0.875rem;
  }
  
  .col-date {
    min-width: 150px;
  }
  
  .col-duration {
    min-width: 100px;
  }
  
  .col-circumstances {
    min-width: 180px;
  }
  
  .col-interval {
    min-width: 100px;
  }
  
  .col-actions {
    min-width: 120px;
  }
  
  .btn-sm {
    padding: 0.375rem 0.5rem;
    font-size: 0.75rem;
  }
  
  .action-buttons {
    gap: 0.25rem;
  }
}
</style>