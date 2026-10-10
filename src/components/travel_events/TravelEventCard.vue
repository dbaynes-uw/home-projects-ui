<template>
  <div 
    :class="{ 'event-has-passed': hasEventPassed(props.travelEvent), 'event-is-current': !hasEventPassed(props.travelEvent)}"
    @dblclick="navigateToEdit"
  >
    <h2>{{ props.travelEvent.title }}</h2>
    <ul>
      <li class="li-left">Event Description:</li>
      <template v-for="(description, idx) in joinedDescription(props.travelEvent)" :key="idx">
        <br v-if="description === ''" class="blank-line" />
        <b v-else class="li-left-none pre-wrap">{{ description }}</b>
      </template>
      
      <span v-if="startsWithHtml(props.travelEvent.travel_event_url)">
        <li class="li-left">Event Information:
          <br/><b><a :href="props.travelEvent.travel_event_url" target="_blank" class="detail-link-blue">Link to {{ props.travelEvent.title }} site</a></b></li>
      </span>
      <span v-if="startsWithHtml(props.travelEvent.booking_reference)">
        <li class="li-left">Booking Reference:
          <b><a :href="props.travelEvent.booking_reference" target="_blank">Link</a></b></li>
      </span>
      <span v-if="props.travelEvent.booking_reference && !startsWithHtml(props.travelEvent.booking_reference)">
        <li class="li-left">Booking Reference:
          <br/><b>{{ props.travelEvent.booking_reference }}</b></li>
      </span>
      <li class="li-left">Transportation: <b>{{ props.travelEvent.transport }}</b></li>
      <span class="li-left-none" v-if="props.travelEvent.transport_url">
        <b>~ <a :href="props.travelEvent.transport_url" target="_blank" class="detail-link-blue">Map/Link</a></b>
      </span>
      <span v-if="props.travelEvent.start_date">
        <li class="li-left">Start: <b>{{ formatStandardDateTime(props.travelEvent.start_date, props.travelEvent.start_time_zone) }}</b></li>
      </span>
      <span v-if="props.travelEvent.end_date">
        <li class="li-left">End: <b>{{ formatStandardDateTime(props.travelEvent.end_date, props.travelEvent.end_time_zone) }}</b></li>
      </span>
      <li class="li-left">Notes:</li>
      <template v-for="section in noteSections" :key="section.id">
        <button
          v-if="section.heading"
          type="button"
          class="note-bullet-toggle"
          :style="{ marginLeft: noteIndentation(section.heading) }"
          :aria-expanded="isNoteSectionExpanded(section.id)"
          @click.stop="toggleNoteSection(section.id)"
        >
          <i :class="isNoteSectionExpanded(section.id) ? 'fas fa-chevron-down' : 'fas fa-chevron-right'"></i>
          {{ section.heading.trimStart() }}
        </button>
        <template v-if="!section.heading || isNoteSectionExpanded(section.id)">
          <template v-for="(notes, idx) in section.lines" :key="idx">
            <br v-if="notes === ''" class="blank-line" />
            <b v-else-if="noteLink(notes)" class="note-line pre-wrap" :style="{ marginLeft: noteIndentation(notes) }">
              {{ noteLink(notes).prefix }}<a :href="noteLink(notes).url" target="_blank" rel="noopener noreferrer" class="detail-link-blue">{{ noteLink(notes).label }}</a>
            </b>
            <b v-else class="note-line pre-wrap" :style="{ marginLeft: noteIndentation(notes) }">{{ notes.trimStart() }}</b>
          </template>
        </template>
      </template>
    </ul>
    
    <!-- Action Buttons -->
    <!--div class="event-actions">
      <button 
        class="btn-action btn-edit"
        @click.stop="handleEdit"
        title="Edit Event"
      >
        <i class="mdi mdi-pencil"></i>
        @@Edit
      </button>
      <button 
        class="btn-action btn-delete"
        @click.stop="handleDelete"
        title="Delete Event"
      >
        <i class="mdi mdi-delete"></i>
        Delete
      </button>
    </div-->
  </div>
</template>
<script setup>
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import DateFormatService from "@/services/DateFormatService.js"

// Props
const props = defineProps({
  travelEvent: {
    type: Object,
    default: () => ({})
  }
})

// Composables
const router = useRouter()
const collapsedNoteSections = ref({})

// Methods
const navigateToEdit = () => {
  router.push({ name: 'TravelEventEdit', params: { id: props.travelEvent.id } })
}

const startsWithHtml = (event) => {
  return event && event.startsWith('https')
}

const isUrl = (text) => {
  const t = text.trim()
  return /^https?:\/\/\S+$/.test(t) || /^\/\S+\.\w+$/.test(t)
}

const noteLink = (text) => {
  const trimmed = text.trim()
  const markdownMatch = trimmed.match(/^(.*?)\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)$/)

  if (markdownMatch) {
    return { prefix: markdownMatch[1], label: markdownMatch[2], url: markdownMatch[3] }
  }

  return isUrl(trimmed) ? { prefix: '', label: friendlyUrlLabel(trimmed), url: trimmed } : null
}

const friendlyUrlLabel = (text) => {
  const t = text.trim()
  // Extract filename without extension for local paths, full URL otherwise
  const match = t.match(/\/([^/]+)\.(\w+)$/)
  return match ? match[1].replace(/-/g, ' ') : t
}

const joinedDescription = (e) => {
  if (e.description != null) { 
    return e.description.split('\n')
  }
  return []
}

const joinedNotes = (e) => {
  if (e.notes != null) { 
    return e.notes.split('\n')
  }
  return []
}

const noteSections = computed(() => {
  const sections = []
  let currentSection = null

  joinedNotes(props.travelEvent).forEach((line, index) => {
    if (/^(?:•|\d+\.)\s+/.test(line)) {
      currentSection = { id: `bullet-${index}`, heading: line, lines: [] }
      sections.push(currentSection)
    } else if (currentSection) {
      currentSection.lines.push(line)
    } else {
      let introSection = sections.find(section => !section.heading)
      if (!introSection) {
        introSection = { id: 'intro', heading: '', lines: [] }
        sections.push(introSection)
      }
      introSection.lines.push(line)
    }
  })

  return sections
})

const isNoteSectionExpanded = (sectionId) => !collapsedNoteSections.value[sectionId]

const toggleNoteSection = (sectionId) => {
  collapsedNoteSections.value = {
    ...collapsedNoteSections.value,
    [sectionId]: !collapsedNoteSections.value[sectionId]
  }
}

const noteIndentation = (text) => {
  const leadingWhitespace = text.match(/^\s*/)?.[0].replace(/\t/g, '    ').length || 0
  return `${2 + Math.floor(leadingWhitespace / 4) * 1.5}rem`
}

const formatStandardDateTime = (value, tz) => {
  return DateFormatService.formatInZonejs(value, tz)
}

const hasEventPassed = (event) => DateFormatService.hasPassedjs(event.end_date)
</script>
<style scoped>
.event-actions {
  display: flex;
  gap: 0.5rem;
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid #e9ecef;
  justify-content: flex-end;
}

.btn-action {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.5rem 0.75rem;
  border: none;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s ease;
  text-decoration: none;
}

.btn-edit {
  background-color: #007bff;
  color: white;
}

.btn-edit:hover {
  background-color: #0056b3;
}

.btn-delete {
  background-color: #dc3545;
  color: white;
}

.btn-delete:hover {
  background-color: #c82333;
}

.btn-action i {
  font-size: 0.875rem;
}

.detail-link-blue {
  margin-left: 0rem;
  text-decoration: underline !important;
  color: blue;
  text-decoration: none;
}

.pre-wrap {
  white-space: pre-wrap;
  display: block;
}

.note-line {
  text-align: left;
  display: block;
}

.note-bullet-toggle {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.15rem 0.3rem;
  color: inherit;
  font: inherit;
  font-weight: 700;
  text-align: left;
  background: transparent;
  border: 0;
  border-radius: 4px;
  cursor: pointer;
}

.note-bullet-toggle:hover {
  background: rgba(0, 123, 255, 0.12);
}
</style>
