#!/bin/sh
#
# Rust
#
# This installs rust

# Check for rust
if test ! $(which rustup)
then
  echo "  Installing Rust for you."
  /bin/bash -c "$(curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs)"
fi

exit 0