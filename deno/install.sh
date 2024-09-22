
if test ! $(which deno)
then
  /bin/bash -c "$(curl -fsSL https://deno.land/install.sh | sh)"
fi

deno upgrade