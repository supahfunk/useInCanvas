import { useRef, forwardRef, useImperativeHandle, useLayoutEffect } from 'react'
import { CanvasTexture } from 'three'
import useFrame from '../hooks/useFrame'

const lerp = (f0, f1, t) => (1 - t) * f0 + t * f1;

const mapLinear = (x, a1, a2, b1, b2) => {
  return b1 + (x - a1) * (b2 - b1) / (a2 - a1)
}

class WaterTexture {
  constructor(options) {
    this.canvas = options.canvas
    this.scale = 1
    this.width = options.width * this.scale
    this.height = options.height * this.scale

    this.radius = this.width * .03 * this.scale
    this.items = new Array(10).fill(null)
    this.positions = new Array(10).fill({ x: 0, y: 0 })
    this.shadowOffsetX = 3000
    this.shadowOffsetY = 3000
    this.mouse = null

    this.canvas.width = this.width
    this.canvas.height = this.height
    this.ctx = this.canvas.getContext('2d')
    this.ctx.fillStyle = 'black'
    this.ctx.fillRect(0, 0, this.width, this.height)
  }

  setMouse(c) {
    this.mouse = { x: c.x * this.scale, y: c.y * this.scale }
  }

  resize(width, height) {
    this.width = width * this.scale
    this.height = height * this.scale
    this.canvas.width = this.width
    this.canvas.height = this.height
  }

  update(t) {
    if (this.mouse) {
      for (var i = this.items.length - 1; i > 0; i--) {
        this.items[i] = this.items[i - 1]
      }
      this.items[0] = { x: this.mouse.x * this.scale, y: this.mouse.y * this.scale }
    }
    this.ctx.shadowColor = 'rgba(255, 255, 255, .8)'
    this.ctx.shadowBlur = this.radius
    this.ctx.shadowOffsetX = this.shadowOffsetX * this.scale
    this.ctx.shadowOffsetY = this.shadowOffsetY * this.scale

    this.ctx.fillStyle = "black"
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height)

    for (var i = 0; i < this.items.length; i++) {
      const pos = this.items[i]
      if (pos) {
        this.positions[i].x = lerp(this.positions[i].x, pos.x, .9 - 0.05 * i)
        this.positions[i].y = lerp(this.positions[i].y, pos.y, .9 - 0.05 * i)
        this.ctx.beginPath()
        this.ctx.arc(this.positions[i].x - this.shadowOffsetX, this.positions[i].y - this.shadowOffsetY, this.radius * this.scale, 0, 2 * Math.PI)
        this.ctx.fillStyle = "white"
        this.ctx.fill()
        this.ctx.closePath()
      }
    }

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
    $waterTexture.current.setMouse({ x: mouseX, y: mouseY })
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