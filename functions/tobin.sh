function tobin() {
  if [ -z "${1}" ]; then
    echo "ERROR: No decimal number specified.";
    return 1;
  fi;

  echo "ibase=10; obase=2; ${1}" | bc | tr -d '\n'
}
