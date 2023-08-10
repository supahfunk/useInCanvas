import React, { forwardRef, useMemo } from 'react'

import { Uniform, Vector2 } from 'three'
import { Effect } from 'postprocessing'

const fragmentShader = /* glsl */ `
  uniform float uFragments;
  uniform vec2 angle;
  uniform float scale;
  uniform sampler2D uTexture;
  uniform vec2 uMouse;
  uniform vec2 uResolution;

  float pattern(vec2 uv, float mouse) {
    float scale = 1. - mouse * .4;
    vec2 angle = vec2(1.);
    vec2 point = scale * vec2(
      dot(angle.yx, vec2(uv.x, -uv.y)),
      dot(angle, uv)
    );
    return (sin(point.x) * sin(point.y)) * 4.0;
  }
  
  void mainUv(inout vec2 uv) {
  }

  void mainImage(const in vec4 inputColor, const in vec2 uv, out vec4 outputColor) {
    float mouse = texture2D(uTexture, uv).r;
    float mouse1 = smoothstep(0.3, 1., mouse); 

    vec2 vUv1 = uv * 1. + mouse1 * .2;
    vec2 vUv2 = uv * 1. - mouse * .01;
    vec4 T1 = texture2D(inputBuffer, vUv1);
    vec4 T2 = texture2D(inputBuffer, vUv2);

    outputColor = mix(T1.rgba, T2.bgra, smoothstep(0.4, 0.6, mouse1));
    
  }
`

/**
 * A circular lensing effect.
 */

export class CircleLensEffect extends Effect {
  constructor(fragments = 5.0) {
    super('CircleLensEffect', fragmentShader, {
      uniforms: new Map([
        ['uFragments', new Uniform(fragments)],
        ['uMouse', new Uniform()],
        ['uTexture', new Uniform()],
        ['uResolution', new Uniform()],
      ])
    })

    this.resolution = new Vector2()
    this.fragments = fragments
  }
/* 
  getFragments() {
    return this.fragments
  }

  setFragments(fragments) {
    fragments = Math.floor(fragments)

    const uniforms = this.uniforms
    uniforms.get('uFragments').value = fragments

    this.fragments = fragments
  }

  getTexture() {
    return this.texture
  }

  setTexture(texture) {
    texture = Math.floor(texture)

    const uniforms = this.uniforms
    uniforms.get('uTexture').value = texture

    this.texture = texture
  }

  setSize(width, height) {
    this.resolution.set(width, height)
    this.setFragments(this.fragments)
    this.setTexture(this.texture)
  } */
}

export const CircleLens = forwardRef(({ fragments = 5 }, ref) => {
  const effect = useMemo(() => new CircleLensEffect(fragments), [fragments])
  return <primitive ref={ref} object={effect} dispose={null} />
})
