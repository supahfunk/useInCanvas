/* eslint-disable react/no-unknown-property */
/* eslint-disable no-underscore-dangle */
// https://codesandbox.io/p/sandbox/r3f-postprocessing-customeffect-rd-4w43o?file=%2Fshaders%2FBadTVShader.js%3A86%2C3-86%2C31
import { Uniform } from 'three'
import { Effect } from 'postprocessing'
import { forwardRef, useMemo } from 'react'

let _uOpacity

class CustomEffect extends Effect {
  constructor({ opacity = 1, scrollSpeed = 0 }) {
    super('HorizontalBlurEffect', /* glsl */`
      uniform float opacity;
      uniform float scrollSpeed;

      void mainImage(const in vec4 inputColor, const in vec2 uv, out vec4 outputColor) {
        vec2 uv2 = uv;

        
        vec3 col = inputColor.rgb * opacity;

        float distortion = (smoothstep(.2, -1., uv.y) + smoothstep(0.8, 2., uv.y)); // Distanza 1.2 perché smoothstep B - smoothstep A = 1.2; => 2.-0.8=1.2 e -1.-.2=-1.2

        distortion *= scrollSpeed * .05; // Moltiplico per scrollSpeed del mouse

        uv2 -= .5;
        uv2 *= 1. - distortion;
        uv2 += .5;

        float r = texture(inputBuffer, uv2 + distortion * .04).r;
        float g = texture(inputBuffer, uv2).g;
        float b = texture(inputBuffer, uv2 - distortion * .04).b;


        col = texture(inputBuffer, uv2).rgb;


        float alpha = clamp(0., 1., (col.r+col.b+col.g)*100.) + r+g+b;

        col = vec3(r,g,b);

        outputColor = vec4(col, alpha);
      }
      
    `, {
      uniforms: new Map([
        ['opacity', new Uniform(opacity)],
        ['scrollSpeed', new Uniform(scrollSpeed)],
      ]),
    })

    _uOpacity = opacity
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
  }
}

const CustomPostProcessing = forwardRef(({ opacity, scrollSpeed }, ref) => {
  const effect = useMemo(() => new CustomEffect({ opacity, scrollSpeed }), [ opacity, scrollSpeed ])
  return <primitive ref={ref} object={effect} dispose={null} />
})

export default CustomPostProcessing
