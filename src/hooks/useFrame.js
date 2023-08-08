import Tempus from '@studio-freight/tempus'
import { useEffect } from 'react'

export function useFrame(callback, priority = 0) {
  useEffect(() => {
    if (callback) {
      const id = Tempus.add(callback, priority)

      return () => {
        Tempus.remove(id)
      }
    }
  }, [callback, priority])
}

export default useFrame
