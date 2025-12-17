#!/bin/bash
# filepath: /Users/davidbaynes/sites/home-projects-ui/rename-health-views.sh

echo "✏️ Renaming view files to shorter names..."

# ✅ HEALTH MARKERS
cd src/views/health/healthMarkers
[ -f "HealthMarkerList.vue" ] && mv HealthMarkerList.vue List.vue
[ -f "HealthMarkerCreate.vue" ] && mv HealthMarkerCreate.vue Create.vue
[ -f "HealthMarkerEdit.vue" ] && mv HealthMarkerEdit.vue Edit.vue
[ -f "HealthMarkerDetailsWrapper.vue" ] && mv HealthMarkerDetailsWrapper.vue Details.vue
[ -f "HealthMarkersByCategory.vue" ] && mv HealthMarkersByCategory.vue ByCategory.vue
echo "✅ Health Markers renamed"

# ✅ GLUCOSE READINGS
cd ../../../views/health/glucoseReadings
[ -f "GlucoseReadingList.vue" ] && mv GlucoseReadingList.vue List.vue
[ -f "GlucoseReadingCreate.vue" ] && mv GlucoseReadingCreate.vue Create.vue
[ -f "GlucoseReadingEdit.vue" ] && mv GlucoseReadingEdit.vue Edit.vue
[ -f "GlucoseReadingDetails.vue" ] && mv GlucoseReadingDetails.vue Details.vue
echo "✅ Glucose Readings renamed"

# ✅ SLEEP MARKERS
cd ../sleepMarkers
[ -f "SleepMarkerList.vue" ] && mv SleepMarkerList.vue List.vue
[ -f "SleepMarkerCreate.vue" ] && mv SleepMarkerCreate.vue Create.vue
[ -f "SleepMarkerEdit.vue" ] && mv SleepMarkerEdit.vue Edit.vue
[ -f "SleepMarkerDetails.vue" ] && mv SleepMarkerDetails.vue Details.vue
echo "✅ Sleep Markers renamed"

# ✅ OOBS
cd ../oobs
[ -f "OOBList.vue" ] && mv OOBList.vue List.vue
[ -f "OOBCreate.vue" ] && mv OOBCreate.vue Create.vue
[ -f "OOBEdit.vue" ] && mv OOBEdit.vue Edit.vue
[ -f "OOBDetails.vue" ] && mv OOBDetails.vue Details.vue
echo "✅ OOBs renamed"

cd ../../../../..
echo ""
echo "✅ All view files renamed!"