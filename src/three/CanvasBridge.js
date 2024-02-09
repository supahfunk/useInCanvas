import { useEffect, useRef } from 'react'
import { useThree, useFrame } from '@react-three/fiber'
import Image from './Image'
import useThreeStore from '../store/three'
import { MathUtils } from 'three'


const CanvasBridge = () => {
  const $group = useRef()
  const images = useThreeStore((store) => store.images)
  const { viewport, size } = useThree()
  const oldScrollY = useRef(0)

  useEffect(() => { 
    window.scrollSpeed = 0
  })

  useFrame(() => {
    const unit = viewport.height / size.height
    const y = window.scrollY * unit
    $group.current.position.y = y

    // Window Scroll Speed
    window.scrollSpeed = MathUtils.lerp(window.scrollSpeed, Math.abs(window.scrollY - oldScrollY.current), .1)
    oldScrollY.current = window.scrollY
  })

  return (
    <group ref={$group}>
      {images.map((image, i) => (
        <Image key={i.toString()} image={image} />
      ))}
    </group>
  )
}

export default CanvasBridge
