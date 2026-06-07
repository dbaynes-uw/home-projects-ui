# Vuetify Migration Strategy

## Current Snapshot (June 7, 2026)
- Files using Vuetify tags: 59
- Total Vuetify tag occurrences: 574

### Most-used Vuetify tags
- `v-text-field`: 109
- `v-btn`: 77
- `v-col`: 58
- `v-icon`: 57
- `v-card`: 37
- `v-card-text`: 29
- `v-card-title`: 26
- `v-row`: 24
- `v-container`: 19
- `v-textarea`: 17
- `v-form`: 15
- `v-table`: 11
- `v-list-item`: 11
- `v-select`: 10
- `v-chip`: 9

### Top hotspot files (by Vuetify tag count)
- `src/views/health/sleepMarkers/SleepMarkerEdit.vue`: 54
- `src/views/health/healthMarkers/HealthMarkersByCategory.vue`: 39
- `src/views/plants/PlantCreate.vue`: 37
- `src/views/waterings/WateringCreate.vue`: 36
- `src/views/health/glucoseReadings/GlucoseReadingCreate.vue`: 31
- `src/views/health/glucoseReadings/GlucoseReadingEdit.vue`: 29
- `src/views/films/FilmCreate.vue`: 27
- `src/App.vue`: 21
- `src/views/trails/TrailCreate.vue`: 18
- `src/views/About.vue`: 18

## What Is Already Done
- Card action controls were migrated off Vuetify in:
  - `src/components/gardens/GardenCard.vue`
  - `src/components/plants/PlantCard.vue`
  - `src/components/waterings/WateringCard.vue`
- Shared card action styles and text utilities were centralized in `src/assets/global.css`.

## Progress Log

### Phase 1 (Plants + Waterings forms) - In Progress
- Completed conversion of these files to remove Vuetify form tags (`v-text-field`, `v-textarea`, `v-select`, `v-form`, `v-btn`):
  - `src/views/plants/PlantCreate.vue`
  - `src/views/plants/PlantEdit.vue`
  - `src/views/waterings/WateringCreate.vue`
  - `src/views/waterings/WateringEdit.vue`
  - `src/views/health/glucoseReadings/GlucoseReadingCreate.vue`
  - `src/views/health/glucoseReadings/GlucoseReadingEdit.vue`
- Replacements used:
  - `BaseInput`
  - `BaseNativeSelect`
  - `BaseButton`
  - Native `<textarea>` and native multi-select where needed
- Spot check result:
  - No `<v-...>` tags remain in the four migrated files.

### Remaining work for this Phase 1 batch
- Manual UI verification pass:
  - Plant create/edit flows (with and without scoped garden/watering route params)
  - Watering create/edit flows (including multi-garden selection and add-existing-to-garden path)
  - Glucose reading create/edit flows (especially custom type input via datalist)
- Optional cleanup:
  - Add shared `BaseTextarea` to reduce repeated native textarea markup
  - Add shared `BaseMultiSelect` for consistent multi-select UX

### Phase 1 PR2 status (Health domain)
- Completed.
- Completed in this pass:
  - `src/views/health/glucoseReadings/GlucoseReadingCreate.vue`
  - `src/views/health/glucoseReadings/GlucoseReadingEdit.vue`
  - `src/views/health/sleepMarkers/SleepMarkerEdit.vue`
  - `src/views/health/healthMarkers/HealthMarkersByCategory.vue`
  - `src/components/health/sleepMarkers/SleepMarkerCharts.vue`
  - `src/components/health/sleepMarkers/SleepMarkerCalendar.vue`
  - `src/components/health/healthMarkers/HealthMarkerCategoryChart.vue`
  - `src/components/health/glucoseReadings/GlucoseReadingDetails.vue`
  - `src/views/health/HealthDashboard.vue`
  - `src/components/health/glucoseReadings/GlucoseReadingSearch.vue`
- Current health-domain status:
  - No remaining `<v-...>` tags in `src/views/health` and `src/components/health`.

### Phase 2 PR3 status (Buttons + Inline UI)
- Completed.
- Added shared components:
  - `src/components/ui/BaseChip.vue`
  - `src/components/ui/BaseAlert.vue`
  - `src/components/ui/BaseSpinner.vue`
- Completed in this pass:
  - `src/views/About.vue` (`v-chip`, `v-alert`, `v-btn` migrated)
  - `src/components/plants/PlantDetails.vue` (`v-btn-group`/`v-btn` migrated)
  - `src/components/waterings/WateringDetails.vue` (`v-btn-group`/`v-btn` migrated)
  - `src/views/gardens/GardenCreate.vue` (action `v-btn` migrated)
  - `src/views/gardens/GardenEdit.vue` (action `v-btn` migrated)
  - `src/views/PasswordReset.vue` (`v-alert`/`v-btn` migrated)
  - `src/views/golfs/GolfList.vue` (`v-btn` migrated)
  - `src/views/plants/Plants.vue` (`v-progress-circular`/`v-btn` migrated)
  - `src/views/waterings/Waterings.vue` (`v-progress-circular`/`v-btn` migrated)
  - `src/views/gardens/Gardens.vue` (`v-progress-circular`/`v-btn` migrated)
  - `src/views/golfs/GolfGroupScorecard.vue` (`v-progress-circular`/`v-btn` migrated)
  - `src/views/golfs/GolfLiveScore.vue` (`v-btn` migrated)
  - `src/views/golfs/GolfPlayers.vue` (`v-progress-circular` migrated)
  - `src/components/golfs/GolfInput.vue` (`v-btn` migrated)
  - `src/views/vendors/VendorEdit.vue` (`v-btn` migrated)
  - `src/components/ResetPassword.vue` (`v-btn` migrated)
  - `src/components/ForgotPassword.vue` (`v-alert`/`v-btn` migrated)
  - `src/views/trails/TrailCreate.vue` (`v-btn` migrated)
  - `src/views/films/FilmCreate.vue` (`v-btn` migrated)
  - `src/views/books/BookCreate.vue` (`v-btn` migrated)
  - `src/views/Register.vue` (`v-alert` migrated)
  - `src/components/gardens/GardenDetails.vue` (`v-btn` migrated)
  - `src/components/events/EventsStatus.vue` (`v-btn` migrated)
  - `src/components/events/EventsPastDue.vue` (`v-btn` migrated)
  - `src/App.vue` (`v-btn` migrated)
- Progress snapshot (PR3 tags only: `v-btn`, `v-chip`, `v-alert`, `v-progress-circular`):
  - 46 -> 0 occurrences in `src`.
- Golf-domain status:
  - No remaining PR3 target tags in `src/views/golfs` and `src/components/golfs`.
- Next recommended files for immediate follow-up:
  - Start Phase 3 layout shell migration (`v-app`, `v-main`, `v-app-bar`, `v-footer`, `v-container`, `v-row`, `v-col`, `v-spacer`).
  - Follow with Phase 4 structural cleanup (`v-card*`, `v-list*`, `v-table`, `v-dialog`, `v-menu`, `v-tooltip`).

## Migration Approach
Use a risk-first strategy: remove low-risk, high-volume components first, then layout shell, then plugin teardown last.

### Phase 1: Form Inputs (highest impact, lowest visual risk)
Replace these first:
- `v-text-field`
- `v-textarea`
- `v-select`
- `v-autocomplete`
- `v-form`

Target replacements:
- Existing `BaseInput` and `BaseNativeSelect`
- Add `BaseTextarea` (if needed)
- Add `BaseAutocomplete` wrapper only if truly needed

Definition of done:
- No `v-text-field`, `v-textarea`, `v-select`, `v-autocomplete`, `v-form` in migrated files
- Form validations preserved
- Keyboard and tab behavior intact

### Phase 2: Buttons and Inline UI
Replace:
- `v-btn`, `v-btn-group`, `v-chip`, `v-alert`, `v-progress-circular`

Target replacements:
- Existing `BaseButton`
- Add `BaseChip`, `BaseAlert`, `BaseSpinner` if needed

Definition of done:
- No `v-btn*` usage remains
- Color/disabled/loading states preserved

### Phase 3: Layout and App Shell
Replace:
- `v-app`, `v-main`, `v-app-bar`, `v-footer`, `v-container`, `v-row`, `v-col`, `v-spacer`

Target replacements:
- Semantic layout (`header`, `main`, `footer`, CSS grid/flex)
- Existing global styles in `src/assets/global.css`

Definition of done:
- App chrome works on mobile and desktop
- Existing top nav and footer theme behavior preserved

### Phase 4: Lists, Cards, and Tables
Replace:
- `v-card*`, `v-list*`, `v-table`, `v-dialog`, `v-menu`, `v-tooltip`

Target replacements:
- Existing `BaseCard`, `BaseModal`
- Native/semantic list/table markup
- Lightweight custom popover/tooltip only where truly needed

Definition of done:
- No Vuetify structural components remain
- Sorting/filtering/list interactions preserved

### Phase 5: Remove Vuetify Plugin and Package
Final steps after all templates are migrated:
1. Remove Vuetify imports/setup from `src/main.js`
2. Remove any Vuetify setup in `src/App.vue`
3. Remove `vuetify` from `package.json`
4. Remove unused Vuetify override CSS blocks in `src/assets/global.css`
5. Run full lint/build and smoke-test top routes

Definition of done:
- `npm run build` passes
- No runtime errors referencing Vuetify
- No `v-*` Vuetify tags left

## Execution Plan (Recommended Next 3 PRs)
1. PR 1: Phase 1 for Plants + Waterings forms
- `src/views/plants/PlantCreate.vue`
- `src/views/plants/PlantEdit.vue`
- `src/views/waterings/WateringCreate.vue`
- `src/views/waterings/WateringEdit.vue`

2. PR 2: Phase 1 for Health forms (largest hotspot area)
- sleep/glucose/health marker create/edit screens

3. PR 3: Phase 2 button cleanup + shared base components
- introduce `BaseChip`/`BaseAlert`/`BaseSpinner` as needed

## Guardrails
- Keep changes scoped by domain (Plants, Waterings, Health) to reduce regression risk.
- Maintain one migration checklist per file and mark complete only after manual route test.
- Avoid broad visual redesign while migrating; preserve behavior first.

## Quick Commands
- Count files using Vuetify tags:
  - `grep -RIl "<v-[[:alnum:]-]\\+" src --include='*.vue' | wc -l`
- Count total Vuetify tag occurrences:
  - `grep -RIn "<v-[[:alnum:]-]\\+" src --include='*.vue' | wc -l`
- Frequency of Vuetify tags:
  - `grep -RIn "<v-[[:alnum:]-]\\+" src --include='*.vue' | sed -E 's/.*<(v-[[:alnum:]-]+).*/\\1/' | sort | uniq -c | sort -nr`
