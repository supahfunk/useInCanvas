import { useRef, useEffect } from 'react'
import { Canvas } from '@react-three/fiber'
import Home from './pages'
import CanvasPost from './canvas/CanvasPost'
import CanvasBridge from './three/CanvasBridge'
import PostProcessing from './post/PostProcessing'
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
          <PostProcessing canvas={$canvasPost} />
        </Canvas>
      </div>
      <div className="canvasPost">
        <CanvasPost ref={$canvasPost} />
      </div>
    </div>
  )
}
