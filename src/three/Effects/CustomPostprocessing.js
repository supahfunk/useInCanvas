// https://codesandbox.io/p/sandbox/r3f-postprocessing-customeffect-rd-4w43o?file=%2Fshaders%2FBadTVShader.js%3A86%2C3-86%2C31
import { Uniform } from 'three'
import { Effect } from 'postprocessing'
import { forwardRef, useMemo } from 'react'

let _uOpacity
let _uMouse

class CustomEffect extends Effect {
  constructor({ opacity = 1, scrollSpeed = 0, mouse = null }) {
    super('HorizontalBlurEffect', /* glsl */`
      uniform float opacity;
      uniform float scrollSpeed;
      uniform sampler2D mouse;

      void mainImage(const in vec4 inputColor, const in vec2 uv, out vec4 outputColor) {
        vec2 uv2 = uv;

        // Mouse Distortion
        float mouseTexture = texture2D(mouse, uv2).r;
        uv2 += mouseTexture * 0.01;

        // Scroll Distortion
        float distortion = (smoothstep(.2, -1., uv.y) + smoothstep(0.8, 2., uv.y)); // Distanza 1.2 perché smoothstep B - smoothstep A = 1.2; => 2.-0.8=1.2 e -1.-.2=-1.2
        distortion *= scrollSpeed * .03; // Moltiplico per scrollSpeed del mouse

        // UV distortion
        uv2 -= .5;
        uv2 *= 1. - distortion;
        uv2 += .5;

        // Chromatic aberration
        float r = texture(inputBuffer, uv2 + distortion * .04).r;
        float g = texture(inputBuffer, uv2).g;
        float b = texture(inputBuffer, uv2 - distortion * .04).b;
        
        // Alpha overwrite        
        vec3 col = texture(inputBuffer, uv2).rgb;
        float alpha = clamp(0., 1., (col.r+col.b+col.g)*100.) + r+g+b; // Riscrivo l'alpha basandomi sulla distosione delle texture

        col = vec3(r,g,b);

        outputColor = vec4(col, alpha);
      }
      
    `, {
      uniforms: new Map([
        ['opacity', new Uniform(opacity)],
        ['scrollSpeed', new Uniform(scrollSpeed)],
        ['mouse', new Uniform(mouse)],
      ]),
    })

    _uOpacity = opacity
    _uMouse = mouse
  }

  /**
   * Updates this effect.
   *
   * @param {WebGLRenderer} renderer - The renderer.
   * @param {WebGLRenderTarget} inputBuffer - A frame buffer that contains the result of the previous pass.
   * @param {Number} [deltaTime] - The time between the last frame and the current one in seconds.
   */

  update(/* renderer, inputBuffer, deltaTime */) {
    this.uniforms.get('opacity').value = _uOpacity
    this.uniforms.get('scrollSpeed').value = window.scrollSpeed
    this.uniforms.get('mouse').value = _uMouse
  }
}

const CustomPostprocessing = forwardRef(({ opacity, scrollSpeed, mouse }, ref) => {
  const effect = useMemo(() => new CustomEffect({ opacity, scrollSpeed, mouse }), [ opacity, scrollSpeed, mouse ])
  return <primitive ref={ref} object={effect} dispose={null} />
})

export default CustomPostprocessing
