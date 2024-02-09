import { useRef, useEffect } from 'react'
import { Canvas } from '@react-three/fiber'
import Home from './pages'
import CanvasBridge from './three/CanvasBridge'
import Effects from './three/Effects'
import CustomPostProcessing from './three/CustomPostProcessing'
import useLenisScroll from './hooks/useLenisScroll'
import './styles.css'

export default function App() {
  useLenisScroll()

  const handleMouseMove = (e) => {
    window.mouse = { x: e.clientX, y: e.clientY }
  }

  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove)

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
    }
  }, [])
  
  return (
    <div className="App">
      <Home />
      <div className="canvas">
        <Canvas linear={true}>
          <CanvasBridge />
          <Effects />
        </Canvas>
      </div>
    </div>
  )
}
