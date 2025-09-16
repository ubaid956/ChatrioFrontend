#!/bin/bash

PODFILE_PATH="ios/Podfile"

# Add use_modular_headers! right after platform :ios line, if not already added
if grep -q "platform :ios" "$PODFILE_PATH" && ! grep -q "use_modular_headers!" "$PODFILE_PATH"; then
  echo "🔧 Inserting use_modular_headers! into Podfile"
  sed -i.bak '/platform :ios/a\
use_modular_headers!' "$PODFILE_PATH"
else
  echo "✅ use_modular_headers! already present or platform :ios not found"
fi