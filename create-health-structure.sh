#!/bin/bash
# filepath: /Users/davidbaynes/sites/home-projects-ui/create-health-structure.sh

echo "🏥 Creating health module structure..."

# ✅ CREATE COMPONENT FOLDERS
mkdir -p src/components/health/healthMarkers
mkdir -p src/components/health/glucoseReadings
mkdir -p src/components/health/sleepMarkers
mkdir -p src/components/health/oobs
mkdir -p src/components/health/shared

# ✅ CREATE VIEW FOLDERS
mkdir -p src/views/health/healthMarkers
mkdir -p src/views/health/glucoseReadings
mkdir -p src/views/health/sleepMarkers
mkdir -p src/views/health/oobs

echo "✅ Folder structure created!"
echo ""
echo "📁 Components structure:"
ls -la src/components/health/
echo ""
echo "📁 Views structure:"
ls -la src/views/health/