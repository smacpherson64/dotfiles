#!/bin/sh

# Homebrew
# This installs some of the common dependencies needed (or at least desired)
# using Homebrew.

source $DOTFILES_ROOT/homebrew/env.zsh

# Check for Homebrew
if test ! $(which brew)
then
  /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

fi

brew update
brew upgrade
brew bundle --file=$DOTFILES_ROOT/homebrew/Brewfile

exit 0
