function tohex() {
  if [ -z "${1}" ]; then
    echo "ERROR: No decimal number specified.";
    return 1;
  fi;

  echo "ibase=10; obase=16; ${1}" | bc | tr -d '\n'
}
