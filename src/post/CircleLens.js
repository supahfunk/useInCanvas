import React, { forwardRef, useMemo } from 'react'

import { Uniform, Vector2 } from 'three'
import { Effect } from 'postprocessing'

const fragmentShader = /* glsl */ `
  uniform float fragments;
  uniform vec2 angle;
  uniform float scale;

  const int samples = 35,
          LOD = 2,         // gaussian done on MIPmap at scale LOD
          sLOD = 1 << LOD; // tile size = 2^LOD
  const float sigma = float(samples) * .25;

  float gaussian(vec2 i) {
    return exp( -.5* dot(i/=sigma,i) ) / ( 6.28 * sigma*sigma );
  }

  vec4 blur(sampler2D sp, vec2 U, vec2 scale) {
    vec4 O = vec4(0);  
    int s = samples/sLOD;
    
    for ( int i = 0; i < s*s; i++ ) {
        vec2 d = vec2(i%s, i/s)*float(sLOD) - float(samples)/2.;
        O += gaussian(d) * textureLod( sp, U + scale * d , float(LOD) );
    }
    
    return O / O.a;
  }

  float pattern(vec2 uv) {
    vec2 point = scale * vec2(
      dot(angle.yx, vec2(uv.x, -uv.y)),
      dot(angle, uv)
    );

    return (sin(point.x) * sin(point.y)) * 4.0;
  }

  void mainUv(inout vec2 uv) {
    float circle = length(uv - 0.5);
    uv *= 1. + 0.01 * mod(floor(circle * fragments), 2.);
  }

  void mainImage(const in vec4 inputColor, const in vec2 uv, out vec4 outputColor) {



    vec3 color = vec3(
        texture2D(inputBuffer, uv - .01).r,
        texture2D(inputBuffer, uv).g,
        texture2D(inputBuffer, uv + .01).b
    );

    outputColor = vec4(color, inputColor.a);
    
    // outputColor = vec4(inputColor.brga);
  }
`

/**
 * A circular lensing effect.
 */

export class CircleLensEffect extends Effect {
  constructor(fragments = 5.0) {
    super('CircleLensEffect', fragmentShader, {
      uniforms: new Map([['fragments', new Uniform(Number)]])
    })

    this.resolution = new Vector2()

    this.fragments = fragments
  }

  getFragments() {
    return this.fragments
  }

  setFragments(fragments) {
    fragments = Math.floor(fragments)

    const uniforms = this.uniforms
    uniforms.get('fragments').value = fragments

    this.fragments = fragments
  }

  setSize(width, height) {
    this.resolution.set(width, height)
    this.setFragments(this.fragments)
  }
}

export const CircleLens = forwardRef(({ fragments = 5 }, ref) => {
  const effect = useMemo(() => new CircleLensEffect(fragments), [fragments])
  return <primitive ref={ref} object={effect} dispose={null} />
})
