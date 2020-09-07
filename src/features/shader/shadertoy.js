// https://threejsfundamentals.org/threejs/lessons/threejs-shadertoy.html
export default {
  // name: 'shader',

  props: {
    // entities: {
    //   title: 'Entities to chamfer',
    //   type: 'Array'
    // },
    distance: {
      title: 'Distance',
      type: 'Number'
    }
  },

  render ({ THREE, scene }) {
    const fragmentShader = `
#include <common>
 
uniform vec3 iResolution;
uniform float iTime;
 
// By iq: https://www.shadertoy.com/user/iq  
// license: Creative Commons Attribution-NonCommercial-ShareAlike 3.0 Unported License.
void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
    // Normalized pixel coordinates (from 0 to 1)
    vec2 uv = fragCoord/iResolution.xy;
 
    // Time varying pixel color
    vec3 col = 0.5 + 0.5*cos(iTime+uv.xyx+vec3(0,2,4));
 
    // Output to screen
    fragColor = vec4(col,1.0);
}
 
void main() {
  mainImage(gl_FragColor, gl_FragCoord.xy);
}
`

    const plane = new THREE.PlaneBufferGeometry(2, 2)
    const uniforms = {
      iTime: { value: 0 },
      iResolution: { value: new THREE.Vector3(100, 100, 1) }
    }
    const material = new THREE.ShaderMaterial({
      fragmentShader,
      uniforms
    })

    scene.add(new THREE.Mesh(plane, material))

    // RENDER
    function render (time) {
      time *= 0.001 // convert to seconds

      // const canvas = renderer.domElement
      // uniforms.iResolution.value.set(canvas.width, canvas.height, 1)
      uniforms.iTime.value = time

      requestAnimationFrame(render)
    }

    requestAnimationFrame(render)
  }
}
