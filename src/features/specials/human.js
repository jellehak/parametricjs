// https://github.com/mrdoob/three.js/blob/master/examples/webgl_decals.html
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'

export default {
  name: 'human',

  props: {
    direction: {
      title: 'direction',
      default: [10, 0, 0]
    }
  },

  async render ({ createModelLoader, THREE }, previousState) {
    // ==========
    // State
    // ==========
    const server = 'https://threejs.org/examples'

    async function loadLeePerrySmith () {
      const textureLoader = new THREE.TextureLoader()

      const gltf = await createModelLoader(new GLTFLoader())(`${server}/models/gltf/LeePerrySmith/LeePerrySmith.glb`)
      const mesh = gltf.scene.children[0]
      mesh.material = new THREE.MeshPhongMaterial({
        specular: 0x111111,
        map: textureLoader.load(`${server}/models/gltf/LeePerrySmith/Map-COL.jpg`),
        specularMap: textureLoader.load(`${server}/models/gltf/LeePerrySmith/Map-SPEC.jpg`),
        normalMap: textureLoader.load(`${server}/models/gltf/LeePerrySmith/Infinite-Level_02_Tangent_SmoothUV.jpg`),
        shininess: 25
      })
      mesh.scale.set(10, 10, 10)
      return mesh
    }

    // Group meshes
    console.log('loading...')
    const mesh = await loadLeePerrySmith()
    mesh.name = 'human'
    console.log('loading...done')

    return mesh
  }

}
