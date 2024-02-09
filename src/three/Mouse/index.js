/* eslint-disable react/no-unknown-property */
import { useRef, forwardRef, useMemo } from 'react'
import { mergeRefs } from 'react-merge-refs'
import { createPortal, useFrame } from '@react-three/fiber'
import { PerspectiveCamera } from '@react-three/drei'
import { Scene, WebGLRenderTarget, LinearFilter, NearestFilter, MathUtils } from 'three'

const Mouse = forwardRef(({ camera, size, active }, ref) => {
  const bufferCamera = useRef()
  const bufferScene = new Scene()
  const $bufferMesh = useRef()
  const $finalMesh = useRef()
  const prevMouse = useRef({ x: 0, y: 0 })
  const mouseSpeed = useRef(0)

  /*------------------------------
  Ricalcolo viewport size basata
  sulla telecamera esterna
  ------------------------------*/
  const viewport = useMemo(() => {
    if (!camera) return ({ width: 1, height: 1 })
    const distance = camera.position.z
    const { fov } = camera
    const aspect = size.width / size.height
    const width = 2 * distance * Math.tan((fov * Math.PI) / 360) * aspect
    return ({
      width,
      height: width / aspect,
    })
  }, [size, camera, active])

  const textureA = useRef(new WebGLRenderTarget(size.width, size.height, { minFilter: LinearFilter, magFilter: NearestFilter, samples: 8 }))
  const textureB = useRef(new WebGLRenderTarget(size.width, size.height, { minFilter: LinearFilter, magFilter: NearestFilter, samples: 8 }))

  useFrame(({ gl, clock }) => {
    if (!textureA.current || !window.mouse) return
    gl.setRenderTarget(textureB.current)
    gl.render(bufferScene, bufferCamera.current)

    const t = textureA.current
    textureA.current = textureB.current
    textureB.current = t

    $finalMesh.current.material.map = textureB.current.texture
    $bufferMesh.current.material.uniforms.uTexture.value = textureA.current.texture
    $bufferMesh.current.material.uniforms.uTime.value = clock.getElapsedTime()

    /*------------------------------
    Mouse pos & speed
    ------------------------------*/
    const mouseX = window.mouse.x
    const mouseY = size.height - window.mouse.y

    mouseSpeed.current = Math.min(1, MathUtils.lerp(mouseSpeed.current, Math.max(Math.abs(prevMouse.current.x - mouseX), Math.abs(prevMouse.current.y - mouseY)), 0.2))

    prevMouse.current.x = mouseX
    prevMouse.current.y = mouseY

    $bufferMesh.current.material.uniforms.uMouse.value.x = mouseX
    $bufferMesh.current.material.uniforms.uMouse.value.y = mouseY
    $bufferMesh.current.material.uniforms.uSpeed.value = mouseSpeed.current

    gl.setRenderTarget(null)
  })

  return (
    <>
      {
        createPortal(
          <>
            <PerspectiveCamera ref={bufferCamera} position={[0, 0, 1]} />
            <mesh ref={$bufferMesh}>
              <planeGeometry args={[viewport.width, viewport.height]} />
              <shaderMaterial
                uniforms={{
                  uTexture: { value: textureA },
                  uRes: { value: { x: size.width, y: size.height } },
                  uMouse: { value: { x: 0, y: 0 } },
                  uTime: { value: 0 },
                  uSpeed: { value: 0 },
                }}
                vertexShader={/* glsl */`
                  varying vec2 vUv;
                  void main() {
                    vec3 pos = position;
                    vUv = uv;
                    gl_Position = projectionMatrix * modelViewMatrix * vec4( pos, 1.0 );
                  }
                `}
                fragmentShader={/* glsl */`
                  float hue2rgb(float f1, float f2, float hue) {
                    if (hue < 0.0)
                      hue += 1.0;
                    else if (hue > 1.0)
                      hue -= 1.0;
                    float res;
                    if ((6.0 * hue) < 1.0)
                      res = f1 + (f2 - f1) * 6.0 * hue;
                    else if ((2.0 * hue) < 1.0)
                      res = f2;
                    else if ((3.0 * hue) < 2.0)
                      res = f1 + (f2 - f1) * ((2.0 / 3.0) - hue) * 6.0;
                    else
                      res = f1;
                    return res;
                  }

                  vec3 hsl2rgb(vec3 hsl) {
                    vec3 rgb;

                    if (hsl.y == 0.0) {
                      rgb = vec3(hsl.z); // Luminance
                    } else {
                      float f2;

                      if (hsl.z < 0.5)
                        f2 = hsl.z * (1.0 + hsl.y);
                      else
                        f2 = hsl.z + hsl.y - hsl.y * hsl.z;

                      float f1 = 2.0 * hsl.z - f2;

                      rgb.r = hue2rgb(f1, f2, hsl.x + (1.0/3.0));
                      rgb.g = hue2rgb(f1, f2, hsl.x);
                      rgb.b = hue2rgb(f1, f2, hsl.x - (1.0/3.0));
                      }   
                    return rgb;
                  }
                
                  float mod289(float x){return x - floor(x * (1.0 / 289.0)) * 289.0;}
                  vec4 mod289(vec4 x){return x - floor(x * (1.0 / 289.0)) * 289.0;}
                  vec4 perm(vec4 x){return mod289(((x * 34.0) + 1.0) * x);}

                  float noise(vec3 p){
                    vec3 a = floor(p);
                    vec3 d = p - a;
                    d = d * d * (3.0 - 2.0 * d);

                    vec4 b = a.xxyy + vec4(0.0, 1.0, 0.0, 1.0);
                    vec4 k1 = perm(b.xyxy);
                    vec4 k2 = perm(k1.xyxy + b.zzww);

                    vec4 c = k2 + a.zzzz;
                    vec4 k3 = perm(c);
                    vec4 k4 = perm(c + 1.0);

                    vec4 o1 = fract(k3 * (1.0 / 41.0));
                    vec4 o2 = fract(k4 * (1.0 / 41.0));

                    vec4 o3 = o2 * d.z + o1 * (1.0 - d.z);
                    vec2 o4 = o3.yw * d.x + o3.xz * (1.0 - d.x);

                    return o4.y * d.y + o4.x * (1.0 - d.y);
                  }

                  mat2 rot (float a) {
                    return mat2(cos(a), sin(-a), sin(a), cos(a));
                  }

                  /*------------------------------
                  Uniforms
                  ------------------------------*/
                  uniform vec2 uRes;
                  uniform sampler2D uTexture;
                  uniform vec2 uMouse;
                  uniform float uTime;
                  uniform float uSpeed;
                  
                  void main() {
                    vec2 st = gl_FragCoord.xy / uRes.xy;
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

                    float c = smoothstep(.1, 0., length(uv - m) - .0001);
                    c = pow(c, 4.);

                    // Rimoltiplico per la speed
                    c *= uSpeed;

                    vec2 m2 = uMouse / uRes.xy;
                    vec2 uv2 = st - m2;
                    
                    float n = noise(vec3(st * 10., uTime));
                    
                    uv2 *= .99 + (c * 1.6);
                    uv2 *= rot(n * .03);
                    uv2 += m2;
                    vec3 buffer = texture2D(uTexture, uv2).rgb;
                    
                    vec3 rgb = c * hsl2rgb(vec3(sin(uTime) * .5 + .5, .5, .5));
                    vec3 col = rgb + buffer * .93;
                    
                    gl_FragColor = vec4(col, 1.);
                    
                  }
              `}
              />
            </mesh>
          </>,
          bufferScene,
        )
      }
      <mesh ref={mergeRefs([$finalMesh, ref])}>
        <planeGeometry args={[viewport.width, viewport.height]} />
        <meshBasicMaterial
          map={textureB.current.texture}
        />
      </mesh>
    </>
  )
})

export default Mouse
