export default {
  name: 'shader',

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
    const vertexShader = `
    void main() {
        gl_Position = vec4( position, 1.0 );
    }
    `

    const fragmentShader = `
    uniform vec2 u_resolution;
    uniform float u_time;

    void main() {
        vec2 st = gl_FragCoord.xy/u_resolution.xy;
        gl_FragColor=vec4(st.x,st.y,0.0,1.0);
    }
    `

    var geometry = new THREE.PlaneBufferGeometry(2, 2)

    const uniforms = {
      u_time: { value: 1.0 },
      u_resolution: { value: new THREE.Vector2(1000, 1000) },
      u_mouse: { value: new THREE.Vector2() }
    }

    var material = new THREE.ShaderMaterial({
      uniforms,
      // vertexShader,
      fragmentShader
    })

    var mesh = new THREE.Mesh(geometry, material)
    scene.add(mesh)

    document.onmousemove = function (e) {
      uniforms.u_mouse.value.x = e.pageX
      uniforms.u_mouse.value.y = e.pageY
    }
  }
}
