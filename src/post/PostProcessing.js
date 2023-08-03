import { EffectComposer } from '@react-three/postprocessing'
import { CircleLens } from './CircleLens'

const PostProcessing = () => {
  return (
    <EffectComposer disableNormalPass={true}>
      <CircleLens fragments={100} />
    </EffectComposer>
  )
}

export default PostProcessing
