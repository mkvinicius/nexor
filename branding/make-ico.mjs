import fs from 'node:fs'
import path from 'node:path'

const dir = path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1'))
const sizes = [16, 32, 48, 64, 128, 256]
const pngs = sizes.map((s) => ({ size: s, buf: fs.readFileSync(path.join(dir, `nexor-${s}.png`)) }))

const count = pngs.length
const header = Buffer.alloc(6)
header.writeUInt16LE(0, 0) // reserved
header.writeUInt16LE(1, 2) // type = icon
header.writeUInt16LE(count, 4)

const entries = Buffer.alloc(16 * count)
let offset = 6 + 16 * count
pngs.forEach((p, i) => {
  const e = entries.subarray(i * 16, i * 16 + 16)
  e.writeUInt8(p.size >= 256 ? 0 : p.size, 0) // width (0 => 256)
  e.writeUInt8(p.size >= 256 ? 0 : p.size, 1) // height
  e.writeUInt8(0, 2) // color count
  e.writeUInt8(0, 3) // reserved
  e.writeUInt16LE(1, 4) // planes
  e.writeUInt16LE(32, 6) // bit count
  e.writeUInt32LE(p.buf.length, 8) // bytes in res
  e.writeUInt32LE(offset, 12) // image offset
  offset += p.buf.length
})

const ico = Buffer.concat([header, entries, ...pngs.map((p) => p.buf)])
fs.writeFileSync(path.join(dir, 'nexor.ico'), ico)
console.log(`wrote nexor.ico (${ico.length} bytes, ${count} sizes)`)
