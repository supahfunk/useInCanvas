import { useEffect, useRef, useMemo } from 'react'
import { EffectComposer } from '@react-three/postprocessing'
import { useFrame } from '@react-three/fiber'
import { CanvasTexture } from 'three'
import { CircleLens } from './CircleLens'

const PostProcessing = ({canvas}) => {
  const $circleLens = useRef()

  useFrame(({mouse, size}) => {
    $circleLens.current.uniforms.get('uTexture').value = new CanvasTexture(canvas.current)
    $circleLens.current.uniforms.get('uMouse').value = { x: mouse.x, y: mouse.y }
    $circleLens.current.uniforms.get('uResolution').value = { x: size.width, y: size.height }
  }, [])

  return (
    <EffectComposer disableNormalPass={true}>
      <CircleLens ref={$circleLens} fragments={100} />
    </EffectComposer>
  )
}

export default PostProcessing
