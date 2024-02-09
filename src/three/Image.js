
import { useRef, useEffect, useMemo } from 'react'
import { useThree, useFrame } from '@react-three/fiber'
import { useTexture } from '@react-three/drei'
import { MathUtils } from 'three'

const Image = ({ image }) => {
  const $image = useRef()
  const { mapLinear } = MathUtils
  const { viewport, size } = useThree()
  const texture = useTexture(image.src)
  const unit = useMemo(
    () => ({
      x: viewport.width / size.width,
      y: viewport.height / size.height
    }),
    [viewport, size]
  )

  /*------------------------------
  Shader Args
  ------------------------------*/
  const shaderArgs = useMemo(
    () => ({
      toneMapped: false,
      uniforms: {
        uTime: { value: 0 },
        uTex: { value: texture },
        uRes: { value: { x: image.width, y: image.height } },
        uTexRes: { value: { x: texture.source.data.width, y: texture.source.data.height } },
        uScale: { value: { x: image.width * unit.x, y: image.height * unit.y } },
        uScrollSpeed: { value: 0 }
      },
      vertexShader: /* glsl */ `
        varying vec2 vUv;
        uniform float uTime;

        void main() {
          vec3 pos = position;
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4( pos, 1.0 );
        }
      `,
      fragmentShader: /* glsl */ `
        varying vec2 vUv;
        uniform float uTime;
        uniform vec2 uRes;
        uniform vec2 uTexRes;
        uniform vec2 uScale;
        uniform sampler2D uTex;

        /*------------------------------
        Cover UV
        ------------------------------*/
        vec2 CoverUV(vec2 u, vec2 s, vec2 i) {
          float rs = s.x / s.y; // Aspect screen size
          float ri = i.x / i.y; // Aspect image size
          vec2 st = rs < ri ? vec2(i.x * s.y / i.y, s.y) : vec2(s.x, i.y * s.x / i.x); // New st
          vec2 o = (rs < ri ? vec2((st.x - s.x) / 2.0, 0.0) : vec2(0.0, (st.y - s.y) / 2.0)) / st; // Offset
          return u * s / st + o;
        }
        
        /*------------------------------
        Main
        ------------------------------*/
        void main() {
          vec2 uv = CoverUV(vUv, uRes, uTexRes);
          vec3 col = texture(uTex, uv).rgb;
          gl_FragColor = vec4( col, 1.);
        }
      `
    }),
    [texture, image]
  )

  useFrame(({ clock }) => {
    $image.current.material.uniforms.uTime.value = clock.getElapsedTime()
    $image.current.material.uniforms.uScrollSpeed.value = window.scrollSpeed
  })

  useEffect(() => {
    const { left, top, width, height } = image
    const x = mapLinear(left + width * 0.5, 0, size.width, -viewport.width * 0.5, viewport.width * 0.5)
    const y = mapLinear(top + height * 0.5, 0, size.height, viewport.height * 0.5, -viewport.height * 0.5)
    $image.current.scale.x = width * unit.x
    $image.current.scale.y = height * unit.y
    $image.current.position.x = x
    $image.current.position.y = y
  }, [image, unit, size, viewport])

  return (
    <mesh ref={$image}>
      <planeGeometry args={[1, 1, 1, 1]} />
      <shaderMaterial args={[shaderArgs]} />
    </mesh>
  )
}

export default Image