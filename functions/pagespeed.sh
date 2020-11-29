function pagespeed() {
  if [ -z "${1}" ]; then
      echo "ERROR: No domain specified.";
      return 1;
  fi;

  npx pagespeed-score "$1" --runs 5
}
