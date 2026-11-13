// Gating smoke test: can Bloub (Solid.js) render an SVG inside Nexor's toolchain?
// Run with:  node --conditions=browser branding/smoke-bloub.mjs
import { Window } from 'happy-dom'

const win = new Window({ url: 'http://localhost/' })
globalThis.window = win
globalThis.document = win.document
globalThis.HTMLElement = win.HTMLElement
globalThis.SVGElement = win.SVGElement
globalThis.customElements = win.customElements
globalThis.requestAnimationFrame = (cb) => win.setTimeout(() => cb(Date.now()), 16)
globalThis.cancelAnimationFrame = (id) => win.clearTimeout(id)
globalThis.matchMedia = win.matchMedia?.bind(win) ?? (() => ({ matches: false, addEventListener() {}, removeEventListener() {} }))

const { render, createComponent } = await import('@solidjs/web')
const bloub = await import('@norbert_bodziony/bloub')
const { BloubBot, SHAPES, EXPRESSIONS } = bloub

const shape = SHAPES[0].id
const expression = EXPRESSIONS[0].id
console.log('shape:', shape, '| expression:', expression)

const host = document.createElement('div')
document.body.appendChild(host)

const dispose = render(
  () => createComponent(BloubBot, { size: 100, shape, color: '#38bdf8', expression, frozenAt: 0, ariaLabel: '' }),
  host,
)

const svg = host.querySelector('svg')
if (!svg) {
  console.error('FAIL: no <svg> rendered')
  dispose()
  process.exit(1)
}
const markup = svg.outerHTML
console.log('OK: svg rendered, length =', markup.length)
console.log('snippet:', markup.slice(0, 180))
dispose()
process.exit(0)
