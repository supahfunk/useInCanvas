import { useEffect } from 'react'
import { useIsTouchDevice, useFrame } from '@studio-freight/hamo'
import Lenis from '@studio-freight/lenis'
import useScrollStore from '../store/scroll'

export default function useLenisScroll() {
  const isTouchDevice = useIsTouchDevice()
  const [lenis, setLenis] = useScrollStore((state) => [state.lenis, state.setLenis])
  const store = useScrollStore((state) => state.store)

  useEffect(() => {
    if (isTouchDevice === undefined) return
    window.scrollTo(0, 0)
    const lenisRef = new Lenis({
      duration: 1.2,
      easing: (t) => (t === 1 ? 1 : 1 - 2 ** (-10 * t)), // https://easings.net/en#easeOutExpo
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      smoothTouch: false,
      touchMultiplier: 2
    })
    setLenis(lenisRef)

    function scrollTo(e) {
      e.preventDefault()

      const node = e.currentTarget
      const hash = node.href.split('#').pop()
      const selector = `#${hash}`
      const target = !hash.includes('!') ? document.querySelector(selector) : null
      if (!target) return

      window.location.hash = hash
    }
  }, [isTouchDevice])

  useFrame((time) => {
    if (lenis) {
      lenis.raf(time)
      store.y = lenis.scroll
      store.limit = lenis.limit
    }
  }, [])

  return null
}
