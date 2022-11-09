#!/usr/bin/env bash
#
# Run all dotfiles installers.

set -e

echo "Updating tailwind:"
curl -sLO https://github.com/tailwindlabs/tailwindcss/releases/latest/download/tailwindcss-macos-x64
chmod +x tailwindcss-macos-x64
mv tailwindcss-macos-x64 ./bin/tw