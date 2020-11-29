function lighthouse() {
  if [ -z "${1}" ]; then
      echo "ERROR: No domain specified.";
      return 1;
  fi;

  npx -p lighthouse@latest lighthouse "$1" --view
}
