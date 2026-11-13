// Does the FELT PLUSH (PlushBot) render an SVG, and does it reference external webp assets?
// Run with:  node --conditions=browser branding/smoke-plush.mjs
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
const main = await import('@norbert_bodziony/bloub')
const plush = await import('@norbert_bodziony/bloub/plush')
const { SHAPES, EXPRESSIONS, POSES } = main
const { PlushBot } = plush

const shape = SHAPES[0].id
const expression = EXPRESSIONS[0].id
const host = document.createElement('div')
document.body.appendChild(host)

const dispose = render(
  () => createComponent(PlushBot, {
    size: 100, shape, color: '#38bdf8', expression,
    state: 'idle', frozenAt: POSES?.idle ?? 0, eyeScale: 1, ariaLabel: '',
  }),
  host,
)

const svg = host.querySelector('svg')
if (!svg) { console.error('FAIL: no <svg>'); dispose(); process.exit(1) }
const markup = svg.outerHTML
const images = [...svg.querySelectorAll('image')]
const hrefs = images.map((i) => i.getAttribute('href') || i.getAttribute('xlink:href')).filter(Boolean)
console.log('OK: plush svg length =', markup.length, '| <image> count =', images.length)
if (hrefs.length) {
  console.log('asset hrefs (first 3):')
  hrefs.slice(0, 3).forEach((h) => console.log('  ', h.slice(0, 90)))
  const dataUri = hrefs.every((h) => h.startsWith('data:'))
  console.log(dataUri ? 'ALL assets are inline data: URIs (self-contained, build-safe)' : 'Some assets are EXTERNAL urls (build risk)')
} else {
  console.log('no <image> elements — plush is pure vector (build-safe)')
}
dispose()
process.exit(0)
