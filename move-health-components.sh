#!/bin/bash
# filepath: /Users/davidbaynes/sites/home-projects-ui/move-health-components.sh

echo "📦 Moving components to health module..."

# ✅ MOVE HEALTH MARKERS
if [ -d "src/components/healthMarkers" ]; then
  echo "Moving Health Markers components..."
  cp -r src/components/healthMarkers/* src/components/health/healthMarkers/
  echo "✅ Health Markers components copied"
fi

# ✅ MOVE GLUCOSE READINGS
if [ -d "src/components/glucoseReadings" ]; then
  echo "Moving Glucose Readings components..."
  cp -r src/components/glucoseReadings/* src/components/health/glucoseReadings/
  echo "✅ Glucose Readings components copied"
fi

# ✅ MOVE SLEEP MARKERS
if [ -d "src/components/sleepMarkers" ]; then
  echo "Moving Sleep Markers components..."
  cp -r src/components/sleepMarkers/* src/components/health/sleepMarkers/
  echo "✅ Sleep Markers components copied"
fi

# ✅ MOVE OOBS
if [ -d "src/components/oobs" ]; then
  echo "Moving OOBs components..."
  cp -r src/components/oobs/* src/components/health/oobs/
  echo "✅ OOBs components copied"
fi

echo ""
echo "✅ All components copied to health module!"
echo "⚠️  Original folders kept for now (we'll delete after testing)"