#!/bin/sh
set -eu

echo "Updating esbuild:"

version=$(curl -sb -H "Accept: application/json" "https://registry.npmjs.org/@esbuild/darwin-x64" | jq -r '."dist-tags".latest')

case $(uname -ms) in
  'Darwin arm64') platform='darwin-arm64';;
  'Darwin x86_64') platform='darwin-x64';;
  'Linux arm64' | 'Linux aarch64') platform='linux-arm64';;
  'Linux x86_64') platform='linux-x64';;
  'NetBSD amd64') platform='netbsd-x64';;
  'OpenBSD amd64') platform='openbsd-x64';;
  *) echo "error: Unsupported platform: $(uname -ms)"; exit 1
esac

source="https://registry.npmjs.org/@esbuild/$platform/-/$platform-$version.tgz"

tmp=$(mktemp -d)
tgz="$tmp/esbuild.tgz"

curl -fo $tgz $source
tar -xzf "$tgz" -C "$tmp" package/bin/esbuild

dir=$( cd -- "$( dirname -- "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )
dest="$dir/../bin"

mv "$tmp/package/bin/esbuild" "$dest/esbuild"
rm "$tgz"

chmod +x "$dest/esbuild"