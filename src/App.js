import { Canvas } from '@react-three/fiber'
import Home from './pages'
import CanvasBridge from './three/CanvasBridge'
import PostProcessing from './post/PostProcessing'
import useLenisScroll from './hooks/useLenisScroll'
import './styles.css'

export default function App() {
  useLenisScroll()

  return (
    <div className="App">
      <Home />
      <div className="canvas">
        <Canvas linear={true}>
          <CanvasBridge />
          <PostProcessing />
        </Canvas>
      </div>
    </div>
  )
}
