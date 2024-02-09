import { useFrame } from '@react-three/fiber'
import { EffectComposer } from '@react-three/postprocessing'
import CustomPostProcessing from '../CustomPostProcessing'

const Effects = () => {

  /*------------------------------
  RAF
  ------------------------------*/
  /* useFrame(({ gl }) => {
    if (hasTouch || !active || !mouse || !isPostProcessingActive) return
    gl.setRenderTarget(bufferTexture.current)
    gl.render(bufferScene, bufferCamera.current)

    $mouseTexture.current.uniforms.get('texture').value = bufferTexture.current.texture

    gl.setRenderTarget(null)
  })
 */
  return (
    <EffectComposer disableNormalPass depthBuffer={true}>
      <CustomPostProcessing />
    </EffectComposer>
  )
}

export default Effects

  