// Replace the old product name ONLY inside string VALUES of locale JSON files,
// never in the keys (renaming a key would break t("...") lookups).
import fs from 'node:fs'
import path from 'node:path'

const localesDir = path.resolve(
  path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1')),
  '..',
  'src',
  'locales',
)

const rename = (s) => s.replace(/OpenMausBot/g, 'Nexor').replace(/MausBot/g, 'Nexor')

let filesChanged = 0
let valuesChanged = 0
for (const file of fs.readdirSync(localesDir)) {
  if (!file.endsWith('.json')) continue
  if (file === 'source-hashes.json') continue
  const full = path.join(localesDir, file)
  const obj = JSON.parse(fs.readFileSync(full, 'utf8'))
  let changed = 0
  for (const [k, v] of Object.entries(obj)) {
    if (typeof v === 'string') {
      const next = rename(v)
      if (next !== v) { obj[k] = next; changed++ }
    }
  }
  if (changed > 0) {
    fs.writeFileSync(full, JSON.stringify(obj, null, 2) + '\n')
    filesChanged++
    valuesChanged += changed
    console.log(`${file}: ${changed} values`)
  }
}
console.log(`done: ${valuesChanged} values across ${filesChanged} files`)
