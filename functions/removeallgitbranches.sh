function removeallgitbranches() {
  default="master"

  if [ -z "${1}" ]; then
    echo "No default branch to keep specified, assuming '${default}'";
  fi;

  branch=${1:-$default}
  git fetch --all --prune && git checkout ${branch} && git branch | grep -v ${branch} | xargs git branch -D
}
