import { useEffect } from 'react'
import useScrollStore from './store/scroll'

function useScroll(callback, deps = []) {
  const { lenis } = useScrollStore()

  useEffect(() => {
    if (!lenis) return
    lenis.on('scroll', callback)

    return () => {
      lenis.off('scroll', callback)
    }
  }, [lenis, callback, [...deps]])
}

export default useScroll
