function prettier() {
  npx prettier "{,!(node_modules|flow-typed)/**/}*.{js,json,ts,tsx,md}" --write
}

