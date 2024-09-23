#!/bin/sh

# NVM
# This installs the node version manager

source $DOTFILES_ROOT/nvm/env.zsh

# Check for Homebrew
if [ ! -d "$NVM_DIR" ]; then
  /bin/bash -c "$(git clone https://github.com/nvm-sh/nvm.git $NVM_DIR)"
fi

git -C "$NVM_DIR" pull > /dev/null




