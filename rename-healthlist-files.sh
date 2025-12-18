#!/bin/bash
# filepath: rename-views.sh
# Standardize view names to plural resources

set -e  # Exit on error

echo "🔥 Starting View Rename Script..."
echo "================================"
echo ""

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to rename file and update imports
rename_view() {
  local old_path=$1
  local new_path=$2
  local old_name=$3
  local new_name=$4
  
  echo -e "${BLUE}📝 Renaming: ${old_name} → ${new_name}${NC}"
  
  # Check if old file exists
  if [ ! -f "$old_path" ]; then
    echo -e "${RED}❌ File not found: ${old_path}${NC}"
    return 1
  fi
  
  # Rename the file
  git mv "$old_path" "$new_path" 2>/dev/null || mv "$old_path" "$new_path"
  echo -e "${GREEN}✅ Renamed file${NC}"
  
  # Update router imports
  echo -e "${YELLOW}🔍 Updating router imports...${NC}"
  find src/router -type f -name "*.js" -exec sed -i '' "s|${old_name}|${new_name}|g" {} +
  
  # Update any component imports
  echo -e "${YELLOW}🔍 Updating component imports...${NC}"
  find src -type f \( -name "*.vue" -o -name "*.js" \) -exec sed -i '' "s|/${old_name}.vue|/${new_name}.vue|g" {} +
  
  echo -e "${GREEN}✅ Updated all imports${NC}"
  echo ""
}

# Backup warning
echo -e "${YELLOW}⚠️  IMPORTANT: Make sure you have committed your changes!${NC}"
echo -e "${YELLOW}⚠️  This script will rename files and update imports.${NC}"
echo ""
read -p "Continue? (y/n) " -n 1 -r
echo ""
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
  echo "❌ Aborted."
  exit 1
fi
echo ""

# 1. Rename SleepMarkerList → SleepMarkers
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}1️⃣  Sleep Markers${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
rename_view \
  "src/views/health/sleepMarkers/SleepMarkerList.vue" \
  "src/views/health/sleepMarkers/SleepMarkers.vue" \
  "SleepMarkerList" \
  "SleepMarkers"

# 2. Rename HealthMarkerList → HealthMarkers
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}2️⃣  Health Markers${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
rename_view \
  "src/views/health/healthMarkers/HealthMarkerList.vue" \
  "src/views/health/healthMarkers/HealthMarkers.vue" \
  "HealthMarkerList" \
  "HealthMarkers"

# 3. Rename OobList → Oobs
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}3️⃣  OOBs${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
rename_view \
  "src/views/health/oobs/OobList.vue" \
  "src/views/health/oobs/Oobs.vue" \
  "OobList" \
  "Oobs"

echo ""
echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${GREEN}🎉 ALL RENAMES COMPLETE!${NC}"
echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""
echo -e "${YELLOW}📋 Summary:${NC}"
echo -e "  ✅ SleepMarkerList.vue → SleepMarkers.vue"
echo -e "  ✅ HealthMarkerList.vue → HealthMarkers.vue"
echo -e "  ✅ OobList.vue → Oobs.vue"
echo ""
echo -e "${YELLOW}🔍 Next Steps:${NC}"
echo -e "  1. Review the changes: ${BLUE}git status${NC}"
echo -e "  2. Check router file: ${BLUE}src/router/index.js${NC}"
echo -e "  3. Test the app: ${BLUE}npm run dev${NC}"
echo -e "  4. Commit changes: ${BLUE}git add . && git commit -m 'refactor: rename views to plural resources'${NC}"
echo ""