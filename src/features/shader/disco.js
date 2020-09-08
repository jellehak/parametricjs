// https://threejsfundamentals.org/threejs/lessons/threejs-shadertoy.html

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
    const fragmentShader = `
    #include <common>
  
    uniform vec3 iResolution;
    uniform float iTime;
    uniform sampler2D iChannel0;
  
    // By Daedelus: https://www.shadertoy.com/user/Daedelus
    // license: Creative Commons Attribution-NonCommercial-ShareAlike 3.0 Unported License.
    #define TIMESCALE 0.25 
    #define TILES 8
    #define COLOR 0.7, 1.6, 2.8
  
    void mainImage( out vec4 fragColor, in vec2 fragCoord )
    {
      vec2 uv = fragCoord.xy / iResolution.xy;
      uv.x *= iResolution.x / iResolution.y;
      
      vec4 noise = texture2D(iChannel0, floor(uv * float(TILES)) / float(TILES));
      float p = 1.0 - mod(noise.r + noise.g + noise.b + iTime * float(TIMESCALE), 1.0);
      p = min(max(p * 3.0 - 1.8, 0.1), 2.0);
      
      vec2 r = mod(uv * float(TILES), 1.0);
      r = vec2(pow(r.x - 0.5, 2.0), pow(r.y - 0.5, 2.0));
      p *= 1.0 - pow(min(1.0, 12.0 * dot(r, r)), 2.0);
      
      fragColor = vec4(COLOR, 1.0) * p;
    }
  
    varying vec2 vUv;
  
    void main() {
      mainImage(gl_FragColor, vUv * iResolution.xy);
    }
    `

    const vertexShader = `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
    }
  `

    var geometry = new THREE.PlaneBufferGeometry(2, 2)

    const loader = new THREE.TextureLoader()
    const texture = loader.load('https://threejsfundamentals.org/threejs/resources/images/bayer.png')
    texture.minFilter = THREE.NearestFilter
    texture.magFilter = THREE.NearestFilter
    texture.wrapS = THREE.RepeatWrapping
    texture.wrapT = THREE.RepeatWrapping
    const uniforms = {
      iTime: { value: 0 },
      iResolution: { value: new THREE.Vector3(1, 1, 1) },
      iChannel0: { value: texture }
    }

    var material = new THREE.ShaderMaterial({
      uniforms,
      vertexShader,
      fragmentShader,
      side: THREE.DoubleSide
    })

    var mesh = new THREE.Mesh(geometry, material)
    scene.add(mesh)

    // document.onmousemove = function (e) {
    //   uniforms.u_mouse.value.x = e.pageX
    //   uniforms.u_mouse.value.y = e.pageY
    // }

    function render (time) {
      time *= 0.001 // convert to seconds

      uniforms.iTime.value = time

      //   renderer.render(scene, camera)

      requestAnimationFrame(render)
    }

    requestAnimationFrame(render)
  }
}