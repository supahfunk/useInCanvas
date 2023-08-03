import { useEffect } from 'react'
import { useThree } from '@react-three/fiber'
import { MathUtils, Box3, Vector3 } from 'three'

const isPercentage = (num) => typeof num === 'string' && num.includes('%')

const calculatePosition = (side, value, size, viewport, length) => {
  const { mapLinear } = MathUtils
  const inverse = side === 'right' || side === 'top' ? -1 : 1

  return mapLinear(parseInt(value, 10), 0, isPercentage(value) ? 100 : size, -viewport * 0.5 * inverse, viewport * 0.5 * inverse) + length * 0.5 * inverse
}

const usePixel = (ref, { left, top, bottom, right }) => {
  const { viewport, size } = useThree()

  useEffect(() => {
    if (!ref.current) return
    let objectWidth, objectHeight, x, y

    if (ref.current.type === 'Mesh') {
      objectWidth = ref.current.geometry.parameters.width
      objectHeight = ref.current.geometry.parameters.height
    } else if (ref.current.type === 'Group') {
      const bb = new Box3().setFromObject(ref.current)
      const size = bb.getSize(new Vector3())
      objectWidth = size.x
      objectHeight = size.x
    }

    if (left) x = calculatePosition('left', left, size.width, viewport.width, objectWidth)
    if (right) x = calculatePosition('right', right, size.width, viewport.width, objectWidth)
    if (top) y = calculatePosition('top', top, size.height, viewport.height, objectHeight)
    if (bottom) y = calculatePosition('bottom', bottom, size.height, viewport.height, objectHeight)

    ref.current.position.x = x
    ref.current.position.y = y
  })
  return null
}

export default usePixel
