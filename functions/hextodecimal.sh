function hextodecimal() {
  if [ -z "${1}" ]; then
    echo "ERROR: No hex number specified.";
    return 1;
  fi;

  echo "obase=10; ibase=16; ${1}" | bc | tr -d '\n'
}
