#!/bin/bash

echo "🔍 Checking for missing .vue extensions..."
# Find all .vue files with component imports
find src -name "*.vue" -type f | while read file; do
  # Check for imports without extensions
  if grep -q "from ['\"].*components.*['\"]$" "$file" 2>/dev/null; then
    echo "⚠️  $file"
    grep -n "from ['\"].*components.*['\"]$" "$file"
  fi
done
echo "✅ Check complete"