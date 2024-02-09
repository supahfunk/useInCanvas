import { useRef, useEffect } from 'react'
import { Canvas } from '@react-three/fiber'
import { EffectComposer } from '@react-three/postprocessing'
import Home from './pages'
import CanvasBridge from './three/CanvasBridge'
import CustomPostProcessing from './three/CustomPostProcessing'
import useLenisScroll from './hooks/useLenisScroll'
import './styles.css'

export default function App() {
  useLenisScroll()
  const $canvasPost = useRef()

  useEffect(() => {
  }, [])
  
  return (
    <div className="App">
      <Home />
      <div className="canvas">
        <Canvas linear={true}>
          <CanvasBridge />
          <EffectComposer disableNormalPass depthBuffer={true}>
            <CustomPostProcessing />
          </EffectComposer>
        </Canvas>
      </div>
    </div>
  )
}
