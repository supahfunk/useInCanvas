import { useEffect, useRef } from 'react'
import { extend, useFrame, useThree } from '@react-three/fiber'
import { OrthographicCamera } from '@react-three/drei'
import { MathUtils, ShaderMaterial } from 'three'

class CustomShaderMaterial extends ShaderMaterial {
  constructor() {
    super({
      uniforms: {
        uTime: { value: 0 },
        uRes: { value: { x: window.innerWidth, y: window.innerHeight } },
        uTexRes: { value: { x: 1, y: 1 } },
        uMouse: { value: { x: .5, y: .5 } },
        uTex: { value: null },
      },
      vertexShader: /* glsl */ `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = vec4( position, 1. );
        }
      `,
      fragmentShader: /* glsl */ `
        varying vec2 vUv;
        uniform vec2 uMouse;
        uniform vec2 uRes;

        void main() {
          
          vec2 st = vUv;
          vec2 uv = st - .5;
          vec2 m = uMouse / uRes.xy - .5;
          
          float aspectRatio = uRes.y / uRes.x;
          if (aspectRatio < 1.) { 
            uv.y *= aspectRatio;
            m.y *= aspectRatio;
          } else if (aspectRatio > 1.) { 
            uv.x /= aspectRatio;
            m.x /= aspectRatio;
          }

          float c = smoothstep(.1, 0., length(uv - m));
          // c = pow(c, 4.);

          c = clamp(0., 1., c);

          vec3 col = vec3(c);

          gl_FragColor = vec4(col, 0.);
        }
      `
    })
  }
}

extend({ CustomShaderMaterial })

const Mouse = () => {
  const { size } = useThree()
  const $material = useRef()

  /*------------------------------
  Mouse Move
  ------------------------------*/
  const handleMouseMove = (e) => {
    window.mouse = { x: e.clientX, y: e.clientY }
  }
  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove)
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
    }
  }, [])

  /*------------------------------
  Resize
  ------------------------------*/
  useEffect(() => {
    $material.current.uniforms.uRes.value = { x: size.width, y: size.height }

    console.log('$material.current.uniforms ---->', $material.current.uniforms)
  }, [size])
  
  /*------------------------------
  Raf
  ------------------------------*/
  useFrame(() => {
    if (!$material.current || !window.mouse) return

    $material.current.uniforms.uMouse.value.x = MathUtils.lerp($material.current.uniforms.uMouse.value.x, window.mouse.x, .1)
    $material.current.uniforms.uMouse.value.y = MathUtils.lerp($material.current.uniforms.uMouse.value.y, size.height-window.mouse.y, .1)
  })

  return (
    <>
      <OrthographicCamera />
      <mesh >
        <bufferGeometry attach="geometry">
          <bufferAttribute
            attach="attributes-position"
            array={new Float32Array([
              -1.0, -1.0, 0.0,  // Vertice 1: angolo in basso a sinistra
              3.0, -1.0, 0.0,   // Vertice 2: estende a destra oltre la viewport
              -1.0, 3.0, 0.0   // Vertice 3: estende in alto oltre la viewport
            ])}
            count={3}
            itemSize={3}
          />
          <bufferAttribute
            attach="attributes-uv"
            array={new Float32Array([
              0.0, 0.0,  // UV per Vertice 1
              2.0, 0.0,  // UV per Vertice 2 (esteso)
              0.0, 2.0   // UV per Vertice 3 (esteso)
            ])}
            count={3}
            itemSize={2}
          />
        </bufferGeometry>
        <customShaderMaterial ref={$material} />
      </mesh>
    </>
  )
}

export default Mouse