# Find real from shortened url

unshorten() {
  curl -sIL $1 | sed -n 's/Location: *//p'
}