import { useLayoutEffect, useState } from 'react'
import useResizeObserver from '@react-hook/resize-observer'

const useSize = (target) => {
  const [size, setSize] = useState()

  useLayoutEffect(() => {
    target && setSize(target.getBoundingClientRect())
  }, [target])

  // Where the magic happens
  useResizeObserver(target, (entry) => setSize(entry.contentRect))
  return size
}

export default useSize
