#!/usr/bin/env bash

# Installs or updates Rust

set -e

if test ! $(which rustup)
then
  echo "Installing Rust"
  curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs
else
  echo "Updating Rust"
  rustup update
fi

exit 0