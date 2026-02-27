#!/bin/bash

# NeoFeeder CORS Bridge - Build Script

set -e

OUTPUT_DIR="dist"

mkdir -p "$OUTPUT_DIR"

echo "Building NeoFeeder CORS Bridge for Chrome..."

# Copy Chrome manifest
cp manifest.chrome.json manifest.json

# Create clean copy for zipping
rm -rf "$OUTPUT_DIR/extension"
mkdir -p "$OUTPUT_DIR/extension"

# Copy all files except gitignore and this script
rsync -av --exclude='.git' \
      --exclude='*.sh' \
      --exclude='.gitignore' \
      --exclude='node_modules' \
      --exclude='dist' \
      --exclude='*.zip' \
      . "$OUTPUT_DIR/extension/"

# Remove manifest.json from source (we copied it above)
rm manifest.json

# Create zip
cd "$OUTPUT_DIR"
zip -r neofeeder-bridge-chrome.zip extension/
cd ..

echo "Build complete: $OUTPUT_DIR/neofeeder-bridge-chrome.zip"
echo ""
echo "To install:"
echo "  Chrome/Edge: Go to chrome://extensions/, enable Developer mode, click Load unpacked"
