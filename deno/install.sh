#!/usr/bin/env zsh
set -e

if test ! $(which deno)
then
  /bin/bash -c "$(curl -fsSL https://deno.land/install.sh | sh)"
fi

deno upgrade
