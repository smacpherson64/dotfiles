const root = '/Users/seth'
const watcher = Deno.watchFs(root)
const timestamp = (date: Date) => date.toISOString()

for await (const event of watcher) {
  if (event.paths.find((path) => path.includes('/Library'))) {
    continue
  }
  let next = {timestamp: timestamp(new Date()), ...event}
  console.log(next)
}
