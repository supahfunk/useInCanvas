import { useRef, forwardRef, useImperativeHandle, useLayoutEffect } from 'react'
import { CanvasTexture } from 'three'
import useFrame from '../hooks/useFrame'

const lerp = (f0, f1, t) => (1 - t) * f0 + t * f1;

const mapLinear = ( x, a1, a2, b1, b2 ) => {
  return b1 + ( x - a1 ) * ( b2 - b1 ) / ( a2 - a1 )
}

class WaterTexture {
	constructor(options) {
    this.canvas = options.canvas
    this.x = 0
    this.y = 0
    this.maxLength = 30
    this.maxAge = 30
    this.scale = .1
    this.width = options.width * this.scale
    this.height = options.height * this.scale
    this.radius = this.width * .015
    this.initTexture()
    this.trail = Array(10).fill().map(() => ({x: 0, y: 0}))
    this.mouseY = 0
    this.mouseX = 0
	}

  initTexture() {
    this.canvas.width = this.width
    this.canvas.height = this.height
    this.ctx = this.canvas.getContext('2d')
    this.ctx.fillStyle = 'black'
    this.ctx.fillRect(0, 0, this.width, this.height)
    this.ctx.lineCap = 'round'
    this.ctx.lineJoin = 'round'

  }

  addPoint(c) {
    this.trail.push({ x: c.x * this.scale, y: c.y * this.scale, age: 0 })
  }

  mouse(c) {
    this.mouseX = c.x * this.scale
    this.mouseY = c.y * this.scale
  }

  resize(width, height) {
    this.width = width * this.scale
    this.height = height * this.scale
    this.canvas.width = this.width
    this.canvas.height = this.height
  }
  
  update(delta) {
    this.ctx.fillStyle = 'rgba(0, 0, 0, 1)'
    this.ctx.fillRect(0, 0, this.width, this.height)


    this.ctx.shadowOffsetX = 1000
    this.ctx.shadowOffsetY = 1000
    this.ctx.shadowBlur = 100 * this.scale
    this.ctx.shadowColor = 'rgba(255,255,255,1)'

    /* this.trail.forEach((t, i) => {
      t.age += .4
      this.ctx.beginPath()
      const radius =  i > 5 ? Math.max(0, this.radius - t.age * .1) : this.radius
      this.ctx.arc(t.x - 1000, t.y - 1000, radius, 0, Math.PI * 2, true )
      this.ctx.closePath()
      this.ctx.fill()

      if (t.age >= this.maxAge && this.trail.length > 10) {
        this.trail.splice(i, 1)
      }
    }) */

    this.trail.forEach((t,i) => {
      const delay = mapLinear(i, 0, 10, 0.1, 0.02)
      t.x = lerp(t.x, this.mouseX - 1000, delay)
      t.y = lerp(t.y, this.mouseY - 1000, delay)
      this.ctx.beginPath()
      this.ctx.arc(t.x, t.y, this.radius, 0, Math.PI * 2, true )
      this.ctx.closePath()
      this.ctx.fill()
    })
  }
}

const CanvasPost = (props, ref) => {
  const $canvas = useRef()
  const $waterTexture = useRef()
  const texture = useRef()

  useLayoutEffect(() => {
    if (!$canvas.current) return
    $waterTexture.current = new WaterTexture({ 
      canvas: $canvas.current, 
      width: window.innerWidth, 
      height: window.innerHeight,
    })
    
    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('touchmove', handleMouseMove)
    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('touchmove', handleMouseMove)
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  useFrame((delta) => {
    if ($waterTexture.current) {
      $waterTexture.current.update(delta)
      texture.current = new CanvasTexture($canvas.current)
    }
  })

  const handleMouseMove = (ev) => {
    const mouseX = ev.touches ? ev.touches[0]?.clientX : ev.clientX 
    const mouseY = ev.touches ? ev.touches[0]?.clientY : ev.clientY 
    // $waterTexture.current.addPoint({ x: mouseX, y: mouseY })
    $waterTexture.current.mouse({ x: mouseX, y: mouseY })
  }

  const handleResize = () => {
    $waterTexture.current.width = window.innerWidth
    $waterTexture.current.height = window.innerHeight
    $waterTexture.current.resize(window.innerWidth, window.innerHeight)
  }


  useImperativeHandle(ref, () => {
    return {
      texture: texture.current
    }
  }, [])

  return (
    <canvas id='canvasPost' ref={(r) => {
      ref.current = r
      $canvas.current = r
    }} />
  )
}

export default forwardRef(CanvasPost)