import { useRef } from 'react'
import { Canvas } from '@react-three/fiber'
import Home from './pages'
import CanvasBridge from './three/CanvasBridge'
import Effects from './three/Effects'
import useLenisScroll from './hooks/useLenisScroll'
import './styles.css'

export default function App() {
  const $root = useRef()
  useLenisScroll()

  return (
    <div className="App" ref={$root}>
      <Home />
      <div className="canvas">
        <Canvas linear={true} eventSource={$root.current}>
          <CanvasBridge />
          <Effects />
        </Canvas>
      </div>
    </div>
  )
}
