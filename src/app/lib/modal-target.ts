// A native showModal() dialog occupies the browser's top layer, which paints above every
// element in the document — including the fixed-position SmoothCursor arrow. While a modal
// is open it registers itself here, and the arrow portals into it so visitors keep their
// custom cursor inside the dialog.
let target: HTMLElement | null = null
const listeners = new Set<() => void>()

export function setModalTarget(next: HTMLElement | null) {
  if (target === next) return
  target = next
  listeners.forEach((listener) => listener())
}

export function subscribeModalTarget(listener: () => void) {
  listeners.add(listener)
  return () => {
    listeners.delete(listener)
  }
}

export function getModalTarget() {
  return target
}
