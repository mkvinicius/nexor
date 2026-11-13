import { Resvg } from '@resvg/resvg-js'
import fs from 'node:fs'
import path from 'node:path'

const dir = path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1'))
const svg = fs.readFileSync(path.join(dir, 'nexor-icon.svg'))
const sizes = [1024, 512, 256, 128, 64, 48, 32, 16]

for (const size of sizes) {
  const resvg = new Resvg(svg, { fitTo: { mode: 'width', value: size } })
  const png = resvg.render().asPng()
  fs.writeFileSync(path.join(dir, `nexor-${size}.png`), png)
  console.log(`wrote nexor-${size}.png`)
}
console.log('done')
