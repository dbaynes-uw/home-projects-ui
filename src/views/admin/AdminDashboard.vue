<script setup>
import { ref, computed, onMounted } from 'vue'
import EventService from '@/services/EventService'
import { ROUTE_GROUPS } from '@/services/routeGroups'

const users    = ref([])
const loading  = ref(true)
const error    = ref(null)
const saving   = ref({})
const expanded = ref(null)
const search   = ref('')

const ALL_GROUPS = Object.entries(ROUTE_GROUPS).map(([key, val]) => ({
  key,
  label: val.label,
  count: val.routes.length,
}))

async function fetchUsers() {
  loading.value = true
  error.value   = null
  try {
    const res   = await EventService.adminGetUsers()
    users.value = res.data
  } catch (err) {
    error.value = err.response?.data?.error ?? 'Failed to load users'
  } finally {
    loading.value = false
  }
}

onMounted(fetchUsers)

const pendingUsers  = computed(() => users.value.filter(u => !u.approved))
const filteredUsers = computed(() => {
  const q = search.value.toLowerCase()
  return users.value.filter(u =>
    u.email.toLowerCase().includes(q) || (u.name ?? '').toLowerCase().includes(q)
  )
})

function groupsFor(user) { return new Set(user.allowed_routes ?? []) }
function toggleExpand(uid) { expanded.value = expanded.value === uid ? null : uid }

async function updateUser(user, patch) {
  saving.value = { ...saving.value, [user.id]: true }
  try {
    const res = await EventService.adminUpdateUser(user.id, patch)
    const idx = users.value.findIndex(u => u.id === user.id)
    if (idx !== -1) users.value[idx] = res.data
  } catch (err) {
    alert(`Failed to update ${user.email}: ${err.response?.data?.errors?.join(', ') ?? err.message}`)
  } finally {
    saving.value = { ...saving.value, [user.id]: false }
  }
}

function approve(u)   { updateUser(u, { approved: true  }) }
function revoke(u)    { updateUser(u, { approved: false }) }
function makeAdmin(u) { updateUser(u, { role: 'admin'   }) }
function makeUser(u)  { updateUser(u, { role: 'user'    }) }
function grantAll(u)  { updateUser(u, { allowed_routes: Object.keys(ROUTE_GROUPS) }) }
function revokeAll(u) { updateUser(u, { allowed_routes: [] }) }

function toggleGroup(user, groupKey) {
  const current = new Set(user.allowed_routes ?? [])
  current.has(groupKey) ? current.delete(groupKey) : current.add(groupKey)
  updateUser(user, { allowed_routes: [...current] })
}

function formatDate(dt) {
  return dt ? new Date(dt).toLocaleDateString('en-US', { year:'numeric', month:'short', day:'numeric' }) : '—'
}
</script>

<template>
  <div class="admin-wrap">
    <header class="admin-header">
      <h1>⚙️ Admin — User Management</h1>
      <button class="btn-refresh" @click="fetchUsers" :disabled="loading">
        {{ loading ? 'Loading…' : '↻ Refresh' }}
      </button>
    </header>

    <div v-if="error" class="alert-error">{{ error }}</div>

    <section v-if="pendingUsers.length" class="pending-section">
      <h2 class="section-title pending-title">
        ⏳ Pending Approval <span class="badge">{{ pendingUsers.length }}</span>
      </h2>
      <div class="pending-grid">
        <div v-for="u in pendingUsers" :key="u.id" class="pending-card">
          <div class="user-meta">
            <strong>{{ u.name || '(no name)' }}</strong>
            <span class="email">{{ u.email }}</span>
            <span class="joined">Joined {{ formatDate(u.created_at) }}</span>
          </div>
          <button class="btn-approve" :disabled="saving[u.id]" @click="approve(u)">✓ Approve</button>
        </div>
      </div>
    </section>
    <div v-else-if="!loading" class="no-pending">✅ No users awaiting approval</div>

    <section class="all-section">
      <div class="table-toolbar">
        <h2 class="section-title">All Users ({{ users.length }})</h2>
        <input v-model="search" class="search-input" type="search" placeholder="Search by name or email…" />
      </div>
      <div class="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Name</th><th>Email</th><th>Joined</th><th>Role</th>
              <th>Status</th><th>Access</th><th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="loading"><td colspan="7" class="loading-cell">Loading…</td></tr>

            <template v-for="u in filteredUsers" :key="u.id">
              <tr :class="{ 'row-pending': !u.approved }">
                <td>{{ u.name || '—' }}</td>
                <td class="email-cell">{{ u.email }}</td>
                <td class="date-cell">{{ formatDate(u.created_at) }}</td>
                <td>
                  <span :class="['role-badge', u.role === 'admin' ? 'role-admin' : 'role-user']">{{ u.role }}</span>
                </td>
                <td>
                  <span :class="['status-badge', u.approved ? 'status-approved' : 'status-pending']">
                    {{ u.approved ? 'Approved' : 'Pending' }}
                  </span>
                </td>
                <td>
                  <span v-if="u.role === 'admin'" class="access-tag access-admin">All (admin)</span>
                  <span v-else-if="!(u.allowed_routes ?? []).length" class="access-tag access-none">None</span>
                  <span v-else class="access-tag access-some">
                    {{ (u.allowed_routes ?? []).length }} feature{{ (u.allowed_routes ?? []).length !== 1 ? 's' : '' }}
                  </span>
                </td>
                <td class="actions-cell">
                  <button v-if="!u.approved" class="btn-sm btn-approve" :disabled="saving[u.id]" @click="approve(u)">Approve</button>
                  <button v-else class="btn-sm btn-revoke" :disabled="saving[u.id]" @click="revoke(u)">Revoke</button>
                  <button v-if="u.role !== 'admin'" class="btn-sm btn-promote" :disabled="saving[u.id]" @click="makeAdmin(u)">Make Admin</button>
                  <button v-else class="btn-sm btn-demote" :disabled="saving[u.id]" @click="makeUser(u)">Remove Admin</button>
                  <button v-if="u.role !== 'admin'" class="btn-sm btn-access" @click="toggleExpand(u.id)">
                    {{ expanded === u.id ? '▲ Access' : '▼ Access' }}
                  </button>
                </td>
              </tr>

              <tr v-if="expanded === u.id && u.role !== 'admin'" class="access-row">
                <td colspan="7" class="access-panel">
                  <div class="access-panel-inner">
                    <div class="access-panel-header">
                      <span class="access-panel-title">🔑 Feature Access for <strong>{{ u.name || u.email }}</strong></span>
                      <div class="access-bulk-btns">
                        <button class="btn-sm btn-approve" :disabled="saving[u.id]" @click="grantAll(u)">Grant All</button>
                        <button class="btn-sm btn-revoke"  :disabled="saving[u.id]" @click="revokeAll(u)">Revoke All</button>
                      </div>
                    </div>
                    <div class="feature-grid">
                      <label
                        v-for="group in ALL_GROUPS" :key="group.key"
                        class="feature-chip" :class="{ 'chip-on': groupsFor(u).has(group.key) }"
                      >
                        <input
                          type="checkbox"
                          :checked="groupsFor(u).has(group.key)"
                          :disabled="saving[u.id]"
                          @change="toggleGroup(u, group.key)"
                        />
                        <span class="chip-label">{{ group.label }}</span>
                        <span class="chip-count">{{ group.count }} routes</span>
                      </label>
                    </div>
                  </div>
                </td>
              </tr>
            </template>

            <tr v-if="!loading && filteredUsers.length === 0">
              <td colspan="7" class="empty-cell">No users match your search.</td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  </div>
</template>

<style scoped>
.admin-wrap { max-width: 1200px; margin: 0 auto; padding: 32px 20px; font-family: inherit; }
.admin-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 28px; }
.admin-header h1 { font-size: 1.6rem; color: #333; margin: 0; }
.btn-refresh { padding: 8px 18px; background: #667eea; color: white; border: none; border-radius: 6px; cursor: pointer; font-weight: 600; transition: background 0.2s; }
.btn-refresh:hover:not(:disabled) { background: #5568d3; }
.btn-refresh:disabled { opacity: 0.5; cursor: default; }
.alert-error { background: #fee; border: 1px solid #fcc; color: #c33; padding: 12px 16px; border-radius: 6px; margin-bottom: 20px; }
.pending-section { background: #fffbeb; border: 1px solid #f6d860; border-radius: 10px; padding: 20px 24px; margin-bottom: 32px; }
.section-title { font-size: 1.1rem; font-weight: 700; color: #444; margin: 0 0 16px; display: flex; align-items: center; gap: 8px; }
.pending-title { color: #92650a; }
.badge { background: #f59e0b; color: white; border-radius: 999px; padding: 2px 9px; font-size: 0.8rem; font-weight: 700; }
.pending-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); gap: 12px; }
.pending-card { background: white; border: 1px solid #fde68a; border-radius: 8px; padding: 14px 16px; display: flex; justify-content: space-between; align-items: center; gap: 12px; }
.user-meta { display: flex; flex-direction: column; gap: 2px; }
.user-meta strong { font-size: 0.95rem; color: #222; }
.email  { font-size: 0.82rem; color: #555; }
.joined { font-size: 0.78rem; color: #999; }
.no-pending { color: #4caf50; font-weight: 600; margin-bottom: 24px; }
.all-section { margin-top: 8px; }
.table-toolbar { display: flex; align-items: center; justify-content: space-between; margin-bottom: 14px; gap: 16px; flex-wrap: wrap; }
.search-input { padding: 8px 12px; border: 1px solid #ddd; border-radius: 6px; font-size: 0.9rem; width: 240px; }
.search-input:focus { outline: none; border-color: #667eea; }
.table-wrap { overflow-x: auto; border-radius: 8px; border: 1px solid #e5e7eb; }
table { width: 100%; border-collapse: collapse; font-size: 0.9rem; }
thead tr { background: #f9fafb; }
th { text-align: left; padding: 11px 14px; font-weight: 600; color: #555; border-bottom: 2px solid #e5e7eb; white-space: nowrap; }
td { padding: 10px 14px; border-bottom: 1px solid #f0f0f0; vertical-align: middle; }
.row-pending { background: #fffdf0; }
.loading-cell, .empty-cell { text-align: center; color: #999; padding: 24px; }
.email-cell { font-size: 0.85rem; color: #444; }
.date-cell  { white-space: nowrap; font-size: 0.85rem; color: #666; }
.role-badge, .status-badge, .access-tag { display: inline-block; padding: 3px 10px; border-radius: 999px; font-size: 0.78rem; font-weight: 600; }
.role-admin      { background: #ede9fe; color: #6d28d9; }
.role-user       { background: #e0f2fe; color: #0369a1; }
.status-approved { background: #dcfce7; color: #16a34a; }
.status-pending  { background: #fef9c3; color: #92650a; }
.access-admin    { background: #f3e8ff; color: #7e22ce; }
.access-some     { background: #dbeafe; color: #1d4ed8; }
.access-none     { background: #f3f4f6; color: #9ca3af; }
.actions-cell { display: flex; gap: 6px; flex-wrap: wrap; }
.btn-sm { padding: 5px 12px; border: none; border-radius: 5px; font-size: 0.8rem; font-weight: 600; cursor: pointer; transition: opacity 0.15s; white-space: nowrap; }
.btn-sm:disabled { opacity: 0.4; cursor: default; }
.btn-approve { background: #16a34a; color: white; }
.btn-approve:hover:not(:disabled) { background: #15803d; }
.btn-revoke  { background: #dc2626; color: white; }
.btn-revoke:hover:not(:disabled)  { background: #b91c1c; }
.btn-promote { background: #7c3aed; color: white; }
.btn-promote:hover:not(:disabled) { background: #6d28d9; }
.btn-demote  { background: #6b7280; color: white; }
.btn-demote:hover:not(:disabled)  { background: #4b5563; }
.btn-access  { background: #0891b2; color: white; }
.btn-access:hover { background: #0e7490; }
.access-row td { padding: 0; }
.access-panel { background: #f8faff; border-bottom: 2px solid #c7d2fe; }
.access-panel-inner { padding: 20px 24px; }
.access-panel-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 16px; flex-wrap: wrap; gap: 10px; }
.access-panel-title { font-size: 0.95rem; color: #374151; }
.access-bulk-btns { display: flex; gap: 8px; }
.feature-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(180px, 1fr)); gap: 10px; }
.feature-chip { display: flex; flex-direction: column; gap: 4px; padding: 12px 14px; border-radius: 8px; cursor: pointer; border: 2px solid #e5e7eb; background: white; transition: border-color 0.15s, background 0.15s; }
.feature-chip input[type="checkbox"] { position: absolute; opacity: 0; width: 0; height: 0; }
.feature-chip.chip-on { border-color: #667eea; background: #eef2ff; }
.chip-label { font-size: 0.9rem; font-weight: 600; color: #374151; pointer-events: none; }
.feature-chip.chip-on .chip-label { color: #4338ca; }
.chip-count { font-size: 0.75rem; color: #9ca3af; pointer-events: none; }
.feature-chip.chip-on .chip-count { color: #818cf8; }
</style>
