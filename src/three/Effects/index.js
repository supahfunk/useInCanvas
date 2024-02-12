import { EffectComposer } from '@react-three/postprocessing'
import CustomPostprocessing from './CustomPostprocessing'

const Effects = () => {
  return (
    <>
      <EffectComposer >
        <CustomPostprocessing mouse={null} />
      </EffectComposer>
      {/* <Mouse /> */}
    </>
  )
}

export default Effects

