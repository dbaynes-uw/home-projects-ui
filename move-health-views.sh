#!/bin/bash
# filepath: /Users/davidbaynes/sites/home-projects-ui/move-health-views.sh

echo "📄 Moving views to health module..."

# ✅ MOVE HEALTH MARKERS
if [ -d "src/views/healthMarkers" ]; then
  echo "Moving Health Markers views..."
  mv src/views/healthMarkers/* src/views/health/healthMarkers/
  rmdir src/views/healthMarkers
  echo "✅ Health Markers views moved"
fi

# ✅ MOVE GLUCOSE READINGS
if [ -d "src/views/glucoseReadings" ]; then
  echo "Moving Glucose Readings views..."
  mv src/views/glucoseReadings/* src/views/health/glucoseReadings/
  rmdir src/views/glucoseReadings
  echo "✅ Glucose Readings views moved"
fi

# ✅ MOVE SLEEP MARKERS
if [ -d "src/views/sleepMarkers" ]; then
  echo "Moving Sleep Markers views..."
  mv src/views/sleepMarkers/* src/views/health/sleepMarkers/
  rmdir src/views/sleepMarkers
  echo "✅ Sleep Markers views moved"
fi

# ✅ MOVE OOBS
if [ -d "src/views/oobs" ]; then
  echo "Moving OOBs views..."
  mv src/views/oobs/* src/views/health/oobs/
  rmdir src/views/oobs
  echo "✅ OOBs views moved"
fi

# ✅ MOVE HEALTH DASHBOARD (if in root views)
if [ -f "src/views/HealthDashboard.vue" ]; then
  echo "Moving Health Dashboard..."
  mv src/views/HealthDashboard.vue src/views/health/
  echo "✅ Health Dashboard moved"
fi

echo ""
echo "✅ All views moved to health module!"