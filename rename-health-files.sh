#!/bin/bash
# filepath: /Users/davidbaynes/sites/home-projects-ui/rename-health-files.sh

echo "✏️ Renaming files back to original names..."

# ✅ HEALTH MARKERS VIEWS
cd src/views/health/healthMarkers
[ -f "List.vue" ] && mv List.vue HealthMarkerList.vue
[ -f "Create.vue" ] && mv Create.vue HealthMarkerCreate.vue
[ -f "Edit.vue" ] && mv Edit.vue HealthMarkerEdit.vue
[ -f "Details.vue" ] && mv Details.vue HealthMarkerDetailsWrapper.vue
[ -f "ByCategory.vue" ] && mv ByCategory.vue HealthMarkersByCategory.vue
echo "✅ Health Markers views renamed"

# ✅ GLUCOSE READINGS VIEWS
cd ../glucoseReadings
[ -f "List.vue" ] && mv List.vue GlucoseReadingList.vue
[ -f "Create.vue" ] && mv Create.vue GlucoseReadingCreate.vue
[ -f "Edit.vue" ] && mv Edit.vue GlucoseReadingEdit.vue
[ -f "Details.vue" ] && mv Details.vue GlucoseReadingDetails.vue
echo "✅ Glucose Readings views renamed"

# ✅ SLEEP MARKERS VIEWS
cd ../sleepMarkers
[ -f "List.vue" ] && mv List.vue SleepMarkerList.vue
[ -f "Create.vue" ] && mv Create.vue SleepMarkerCreate.vue
[ -f "Edit.vue" ] && mv Edit.vue SleepMarkerEdit.vue
[ -f "Details.vue" ] && mv Details.vue SleepMarkerDetails.vue
echo "✅ Sleep Markers views renamed"

# ✅ OOBS VIEWS
cd ../oobs
[ -f "List.vue" ] && mv List.vue OobList.vue
[ -f "Create.vue" ] && mv Create.vue OobCreate.vue
[ -f "Edit.vue" ] && mv Edit.vue OobEdit.vue
[ -f "Details.vue" ] && mv Details.vue OobDetails.vue
echo "✅ OOBs views renamed"

cd ../../../../..
echo ""
echo "✅ All files renamed back to original names!"