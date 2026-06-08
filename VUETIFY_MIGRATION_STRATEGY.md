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

### Phase 3 status (Layout + App Shell)
- Complete.
- Completed in this pass:
  - `src/App.vue` (`v-app`, `v-main`, `v-app-bar`, `v-footer`, `v-spacer` migrated to semantic `header`/`main`/`footer`).
  - `src/views/films/FilmCreate.vue` (`v-container` migrated to semantic wrapper)
  - `src/views/gardens/GardenCreate.vue` (`v-container`, `v-row`, `v-col` migrated)
  - `src/views/gardens/GardenEdit.vue` (`v-row`, `v-col` migrated)
  - `src/views/About.vue` (`v-container`, `v-row`, `v-col` migrated)
  - `src/components/golfs/GolfInput.vue` (`v-container` migrated)
  - `src/views/PasswordReset.vue` (`v-container` migrated)
  - `src/views/trails/TrailCreate.vue` (`v-container` migrated)
  - `src/views/vendors/VendorEdit.vue` (`v-container` migrated)
  - `src/views/books/BookCreate.vue` (`v-container` migrated)
  - `src/components/test/HealthMarkerCardTest.vue` (`v-container`, `v-row`, `v-col` migrated)
  - `src/views/waterings/Waterings.vue` (`v-container` migrated)
  - `src/views/plants/Plants.vue` (`v-container` migrated)
  - `src/views/gardens/Gardens.vue` (`v-container` migrated)
  - `src/components/ResetPassword.vue` (`v-container` migrated)
  - `src/components/ForgotPassword.vue` (`v-container` migrated)
- Validation snapshot:
  - `src/App.vue` has 0 occurrences of Phase 3 layout shell tags.
  - `src/views/films/FilmCreate.vue` has 0 occurrences of Phase 3 layout shell tags.
  - `src/views/gardens/GardenCreate.vue` has 0 occurrences of Phase 3 layout shell tags.
  - `src/views/gardens/GardenEdit.vue` has 0 occurrences of Phase 3 layout shell tags.
  - `src/views/About.vue` has 0 occurrences of Phase 3 layout shell tags.
  - `src/components/golfs/GolfInput.vue` has 0 occurrences of Phase 3 layout shell tags.
  - `src/views/PasswordReset.vue` has 0 occurrences of Phase 3 layout shell tags.
  - `src/views/trails/TrailCreate.vue` has 0 occurrences of Phase 3 layout shell tags.
  - `src/views/vendors/VendorEdit.vue` has 0 occurrences of Phase 3 layout shell tags.
  - `src/views/books/BookCreate.vue` has 0 occurrences of Phase 3 layout shell tags.
  - `src/components/test/HealthMarkerCardTest.vue` has 0 occurrences of Phase 3 layout shell tags.
  - `src/views/waterings/Waterings.vue` has 0 occurrences of Phase 3 layout shell tags.
  - `src/views/plants/Plants.vue` has 0 occurrences of Phase 3 layout shell tags.
  - `src/views/gardens/Gardens.vue` has 0 occurrences of Phase 3 layout shell tags.
  - `src/components/ResetPassword.vue` has 0 occurrences of Phase 3 layout shell tags.
  - `src/components/ForgotPassword.vue` has 0 occurrences of Phase 3 layout shell tags.
  - Global check: 0 total occurrences of Phase 3 layout shell tags in `src`.
- Next recommended files for immediate follow-up:
  - Start Phase 4 structural cleanup (`v-card*`, `v-list*`, `v-table`, `v-dialog`, `v-menu`, `v-tooltip`).
  - Suggested first slice: `src/views/gardens/Gardens.vue`, `src/views/waterings/Waterings.vue`, `src/views/plants/Plants.vue`.

### Phase 4 status (Lists, Cards, Tables) - In Progress
- First slice completed in this pass:
  - `src/views/gardens/Gardens.vue` (`v-card`, `v-card-title`, `v-card-actions` migrated)
  - `src/views/waterings/Waterings.vue` (`v-card`, `v-card-title`, `v-card-actions` migrated)
  - `src/views/plants/Plants.vue` (`v-card`, `v-card-title`, `v-card-actions` migrated)
  - `src/components/gardens/GardenIndex.vue` (`v-table` migrated)
  - `src/components/waterings/WateringIndex.vue` (`v-table` migrated)
  - `src/components/plants/PlantIndex.vue` (`v-table` migrated)
- Validation snapshot after this slice:
  - No new lint/template errors in migrated files.
  - Tag count deltas:
    - `v-card`: 16 -> 13
    - `v-card-title`: 15 -> 12
    - `v-card-actions`: 5 -> 2
    - `v-table`: 11 -> 8
  - Remaining Phase 4 structural tag occurrences (`v-card*`, `v-list*`, `v-table`, `v-dialog`, `v-menu`, `v-tooltip`): 49 total in `src`.
- Next recommended files for immediate follow-up:
  - `src/views/PasswordReset.vue`
  - `src/components/ForgotPassword.vue`
  - `src/views/trails/TrailCreate.vue`
  - `src/views/films/FilmCreate.vue`
  - `src/App.vue` (`v-menu`, `v-list`, `v-list-item`, `v-tooltip`)

- Second slice completed in this pass:
  - `src/views/PasswordReset.vue` (`v-card`, `v-card-title`, `v-card-text`, `v-card-actions` migrated)
  - `src/components/ForgotPassword.vue` (`v-card`, `v-card-title`, `v-card-text` migrated)
  - `src/views/trails/TrailCreate.vue` (`v-card`, `v-card-title`, `v-card-text` migrated)
  - `src/views/films/FilmCreate.vue` (`v-card`, `v-card-title`, `v-card-text` migrated)
  - `src/App.vue` (`v-menu`, `v-list`, `v-list-item`, `v-tooltip` migrated to native dropdown semantics)
- Validation snapshot after second slice:
  - No new lint/template errors in migrated files.
  - Tag count deltas:
    - `v-card`: 13 -> 9
    - `v-card-title`: 12 -> 8
    - `v-card-text`: 10 -> 6
    - `v-card-actions`: 2 -> 1
    - `v-menu`, `v-list`, `v-list-item`, `v-tooltip`: 1 each -> 0
  - Remaining Phase 4 structural tag occurrences (`v-card*`, `v-list*`, `v-table`, `v-dialog`, `v-menu`, `v-tooltip`): 32 total in `src`.
- Next recommended files for immediate follow-up:
  - `src/views/golfs/GolfCreate.vue`
  - `src/views/golfs/GolfList.vue`
  - `src/views/films/FilmList.vue`
  - `src/views/trails/TrailList.vue`
  - `src/components/ResetPassword.vue`

- Third slice completed in this pass:
  - `src/views/golfs/GolfCreate.vue` (already migrated in prior pass; verified)
  - `src/views/golfs/GolfList.vue` (already migrated for Phase 4 structural tags; verified)
  - `src/views/films/FilmList.vue` (already migrated for Phase 4 structural tags; verified)
  - `src/views/trails/TrailList.vue` (`v-card`, `v-card-title` migrated)
  - `src/components/ResetPassword.vue` (`v-card`, `v-card-title` migrated)
- Validation snapshot after third slice:
  - No new lint/template errors in migrated files.
  - No remaining Phase 4 structural tags in the queued slice files.
  - Tag count deltas:
    - `v-card`: 9 -> 4
    - `v-card-title`: 8 -> 3
    - `v-card-text`: 6 -> 5
  - Remaining Phase 4 structural tag occurrences (`v-card*`, `v-list*`, `v-table`, `v-dialog`, `v-menu`, `v-tooltip`): 21 total in `src`.
- Next recommended files for immediate follow-up:
  - `src/views/vendors/VendorEdit.vue`
  - `src/views/About.vue`
  - `src/components/films/FilmIndex.vue`
  - `src/components/trails/TrailIndex.vue`
  - `src/components/trails/TrailSearchResults.vue`

- Fourth slice completed in this pass:
  - `src/views/vendors/VendorEdit.vue` (`v-card`, `v-card-title`, `v-card-text` migrated)
  - `src/views/About.vue` (`v-card`, `v-card-title`, `v-card-text`, `v-card-actions` migrated)
  - `src/components/films/FilmIndex.vue` (`v-table` migrated)
  - `src/components/trails/TrailIndex.vue` (`v-table` migrated)
  - `src/components/trails/TrailSearchResults.vue` (`v-table` migrated)
- Validation snapshot after fourth slice:
  - No new lint/template errors in migrated files.
  - No remaining Phase 4 structural tags in the migrated files.
  - Tag count deltas:
    - `v-card`: 4 -> 0
    - `v-card-title`: 3 -> 0
    - `v-card-text`: 5 -> 1
    - `v-card-actions`: 1 -> 0
    - `v-table`: 8 -> 5
  - Remaining Phase 4 structural tag occurrences (`v-card*`, `v-list*`, `v-table`, `v-dialog`, `v-menu`, `v-tooltip`): 6 total in `src`.
- Next recommended files for immediate follow-up:
  - `src/components/golfs/GolfInput.vue` (`v-card-text`)
  - `src/components/books/BookIndex.vue` (`v-table`)
  - `src/components/travels/TravelIndex.vue` (`v-table`)
  - `src/views/gardens/GardenEdit.vue` (`v-table`)
  - `src/views/events/EventStatistics.vue` (`v-table`)

- Final structural slice completed in this pass:
  - `src/components/golfs/GolfInput.vue` (`v-card-text` migrated)
  - `src/components/books/BookIndex.vue` (`v-table` migrated)
  - `src/components/travels/TravelIndex.vue` (`v-table` migrated)
  - `src/views/gardens/GardenEdit.vue` (`v-table` x2 migrated)
  - `src/views/events/EventStatistics.vue` (`v-table` migrated)
- Validation snapshot after final structural slice:
  - No new lint/template errors in migrated files.
  - No remaining Phase 4 structural tags in migrated files.
  - Global check: 0 remaining occurrences of `v-card*`, `v-list*`, `v-table`, `v-dialog`, `v-menu`, `v-tooltip` in `src`.

### Phase 4 status (Lists, Cards, Tables)
- Complete.
- Outcome:
  - All targeted structural Vuetify tags removed from `src`.
  - Remaining Vuetify tags are Phase 1/input-related and not Phase 4 scope (`v-text-field`, `v-textarea`, `v-select`, `v-form`, plus `v-icon`/`v-divider`).
- Next recommended follow-up:
  - Begin Phase 5 teardown (`src/main.js`, package removal, global CSS cleanup, build/lint/smoke checks).

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

### Phase 5 status (Teardown + Final Base Components)
- Complete.
- Completed in this pass:
  - Replaced the final input-related Vuetify tags with local Base-prefixed component tags across the Vue templates.
  - Removed Vuetify bootstrap/import setup from `src/main.js`.
  - Removed `vuetify` from `package.json`.
  - Removed obsolete Vuetify app-shell/button CSS overrides from `src/assets/global.css`.
  - Added the final base components in `src/components/ui` and removed the old wrapper files.
  - Pruned the older overlapping `BaseInput` and `BaseNativeSelect` helpers after migrating their remaining call sites.
- Validation snapshot:
  - `npm run build` passes.
  - Global Vue template check: 0 raw `<v-...>` tags remain in `src`.
  - No remaining `vuetify` bootstrap/import references in `src`.
- Current base components in use:
  - `BaseForm`, `BaseTextField`, `BaseTextarea`, `BaseSelect`, `BaseIcon`, `BaseDivider`.

### Post-Migration UI Architecture (Canonical API)
Final shared form/input component surface:
- `BaseForm`
- `BaseTextField`
- `BaseTextarea`
- `BaseSelect`
- `BaseIcon`
- `BaseDivider`

Conventions:
- Use `BaseSelect` with `items` (not `options`).
- Prefer `BaseTextField` with `prepend-inner` / `append-inner` slots for icon layout.
- Keep shared form controls in `src/components/ui`.

Do not reintroduce:
- Vuetify imports or plugin setup.
- Vuetify template tags (`<v-...>`).
- Temporary migration wrapper names/components.

Validation command:
- `npm run build`

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
