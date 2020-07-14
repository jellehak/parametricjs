import { slugify } from './helpers/slugify'
import features from './features/autoload'
// import * as features from './features'
import ThreeBSP from './helpers/threeCSG.js'
import { setup } from './setup'
import materials from './materials/index.js'
import PathToShape from './helpers/PathToShape'
// Re-export some parts from THREE
import { TransformControls } from 'three/examples/jsm/controls/TransformControls.js'

export * from './setup'

const { THREE } = window

// ============
// Helpers
// ============
export const getFeatureHandler = (features = []) => (name = '') => {
  const found = features[name]
  // console.log(name, found, features)

  return found || false
}

export const createObject = (settings, Type = THREE.Object3D) => {
  const obj = new Type()
  return Object.assign(obj, settings)
}

const computeMouseXY = (domElement = window) => (e = {}) => {
  // return {
  //   x: (e.clientX / window.innerWidth) * 2 - 1,
  //   y: -(e.clientY / window.innerHeight) * 2 + 1
  // }
  const element = domElement.getBoundingClientRect() // renderer.domElement.getBoundingClientRect()
  const { left, top, width, bottom } = element
  return {
    x: ((e.clientX - left) / (width - left)) * 2 - 1,
    y: -((e.clientY - top) / (bottom - top)) * 2 + 1
  }
}

// Compiler
const compileParameters = (parameters = []) => {
  const code = parameters || [].map((elem, key) => {
    const value = parameters[key]
    return `let ${key} = ${value};`
  }).join('\n')

  // cache compiled parameters
  // cadData._parameters = code // || "height=10;width=3;thickness=1";
  // Return
  return code
}

export const compile = (_parameters = '') => (what = '') => {
  const parameters = `
    let throughall = 1000;
    ${_parameters}; \n 
    ${what}
    `

  // eslint-disable-next-line no-eval
  return eval(parameters)
}

const getFeatureHandlerById = (features = []) => (id = '') => {
  return features.filter((elem) => { return elem.id === id ? elem : false })[0]
}

/**
 * Class: ParametricJs
 */
export class ParametricJs {
  constructor (options = {}) {
    const { debug = true } = options
    // Debug
    if (debug) {
      console.log('materials', materials)
      console.log('features', features)
    }

    // Set version
    this.version = '0.0.1'

    // Register basic features
    this.featureHandlers = Object.values(features)
    this.featureHandlersLookup = { ...features }

    // Eagerly init scene ?
    const { scene, camera, mouse, renderer, controls, element, raycast } = setup(options)
    const orbit = controls

    // Test Objects
    // var geometry = new THREE.BoxBufferGeometry(200, 200, 200)
    // var material = new THREE.MeshLambertMaterial({ transparent: true })
    // var mesh = new THREE.Mesh(geometry, material)
    // scene.add(mesh)
    // scene.add(new THREE.GridHelper(1000, 10))

    // Add default features
    // studio
    // this.processFeature({ type: 'normal' })

    // # TransformControls
    const transformControls = new TransformControls(camera, renderer.domElement)
    transformControls.addEventListener('dragging-changed', function (event) {
      orbit.enabled = !event.value
    })
    // transformControls.attach(mesh)
    // scene.add(transformControls)

    // # Add parent for the model
    const model = new THREE.Object3D()
    model.name = 'model'
    scene.add(model)

    // # Keep track of the mouse
    const onTouchMove = e => {
      const mouse = computeMouseXY(renderer.domElement)(e)
      // console.log(mouse)
      this.mouse = mouse
    }
    renderer.domElement.addEventListener('mousemove', onTouchMove)
    renderer.domElement.addEventListener('touchmove', onTouchMove)

    // # Expose
    Object.assign(this,
      {
        ThreeBSP,
        mouse,
        scene,
        model,
        camera,
        controls,
        element,
        raycast,
        renderer,
        materials,
        transformControls
      })

    // State
    this.selection = []
  }

  // Interactions
  set (what) {
    const to = this.model

    // Clear object3d
    const clear = (obj3d) => {
      while (obj3d.children.length > 0) {
        obj3d.remove(obj3d.children[0])
      }
    }

    clear(to)
    to.add(what)
  }

  add (what) {
    this.scene.add(what)
  }

  /**
   * Select part
   * @param {*} what
   */
  clearSelection () {

  }

  select (object) {
    // Clear previous selection
    this.clearSelection()

    // Highlight
    if (object.type === 'LineSegments') {
      console.log(object)
      object.material.color = new THREE.Color(0x607d8b)
    }
    // this.selection = object
  }

  setViewStyle (type = 'shaded') {
    console.log(`New view style ${type}`)

    const children = this.model.children

    children.map(elem => {
      console.log(elem)
    })
  }

  /**
   * Method to proces a singe features
   * @param {*} features
   * @param {*} feature
   * @param {*} previousState
   * @returns {Mesh} generate mesh of a single feature
   */
  async processFeature (feature = {}, { featurePlaceholderObject, livePart, features }) {
    const { type } = feature

    // Find handler according to feature name
    const featureHandler = getFeatureHandler(this.featureHandlersLookup)(feature.type)

    // FeatureHandler Blueprint
    function FeatureHandler (featureHandler = {}, feature = {}) {
      if (!featureHandler) {
        throw new Error(`No featureHandler found for feature: "${type}"`)
      }

      // ===========
      // Validate props
      const { props = {} } = featureHandler
      const propsArray = Object.entries(props).map(([key, value]) => ({ key, ...value }))
      // Validation: required props
      const requiredProps = propsArray.filter(elem => elem.required === true)
      requiredProps.map(elem => {
        if (!feature[elem.key]) {
          console.warn(feature)
          throw new Error(`Feature property "${elem.key}" is required`)
        }
      })
      // ===========
      // Get all prop defaults
      const defaults = Object.fromEntries(
        propsArray.map(elem => ([elem.key, elem.default]))
      )
      // console.log('defaults props', defaults)

      // Set properties to allow: E.g. ```this.entities = ['cutsketch']```
      Object.assign(this, defaults, feature)

      // Attach render function
      const { render } = featureHandler
      this.render = render.bind(this)
    }

    // Create new object from feature blueprint
    const component = new FeatureHandler(featureHandler, feature)

    // Debug
    // console.log(component)

    // Get render Fn
    const renderFn = component.render

    if (!renderFn) {
      throw new Error(`No render function found for feature: "${type}"`)
    }

    const getFeatureById = (id) => {
      const found = features.find((elem) => { return elem.id === id })
      if (!found) {
        console.warn(features)
        throw new Error(`Could not find feature by id: ${id}`)
      }
      return found
    }

    /**
     * Convert an entity to THREE
     * 'human' => THREE.Object
     * @param {*} entities
     */
    const parseEntity = mixed => {
      const SPECIALS = {
        $all: () => livePart,
        $previous: () => {
          const index = livePart.children.length - 1
          // console.log(livePart, [...livePart.children], index)
          return livePart.children[index]
        }
      }
      const isSpecial = SPECIALS[mixed]

      if (isSpecial) {
        return isSpecial()
      }

      const feature = getFeatureById(mixed)
      console.log('feature', feature)
      // return isSpecial ? isSpecial() : this.model.getObjectByName(mixed)
      // HACKY
      return feature._mesh
    }

    /**
     * Convert entities array to a THREE array
     * ['human','$previous'] => [THREE.Object, THREE.Object]
     * @param {*} entities
     */
    const parseEntities = (entities = []) => {
      // Handle entities specials like $all
      console.log('parseEntities', entities)
      const resp = entities.map(parseEntity)
      console.log(resp)
      return resp
    }

    // The context for a feature
    const payload = {
      ...this,
      // Mock scene
      scene: new THREE.Object3D(),
      rootScene: this.scene,
      feature,
      THREE,
      // Returns the scene meshes
      parseEntities,
      createModelLoader: loader => (url) => {
        return new Promise((resolve, reject) => {
          loader.load(url, data => resolve(data), null, reject)
        })
      },
      previousState: livePart, // TODO DEPRECATE in favor for `livePart`
      livePart,
      PathToShape,
      mouse: this.mouse,
      getMouse: () => {
        return this.mouse
      },
      raycaster: new THREE.Raycaster(),
      getFeatureHandlerById: getFeatureHandlerById(features),
      compile: () => {
        // TODO
      },
      getMaterial: (name = '') => {
        // const found = this.materials.find(elem => elem.name === name)
        const found = this.materials[name]
        if (!found) {
          console.warn(this.materials)
          throw new Error(`Material not found: ${name}`)
        }
        return found
      },
      getFeatureById
    }

    // Call render fn
    const mesh = await renderFn(payload, livePart) || {}
    // mesh.name = mesh.name || type
    return mesh || false
  }

  // Browser event handler alias
  on (event, cb = () => { }) {
    return this.element.addEventListener(event, cb)
  }

  async render (cadData = {}) {
    if (!cadData) {
      throw new Error('No CadData')
    }

    // # Group all features in an Object3D
    const livePart = createObject({
      name: 'features'
    })
    console.log('livePart', livePart)

    // Compile global cad parameters (adds cadData._parameters)
    compileParameters(cadData)

    // # Process each feature
    const { features = [] } = cadData

    // Clone features ( richFeatures contains references to the scene )
    const richFeatures = [...features]

    features.map(async (feature, i) => {
      // Skip suppress features
      if (feature.suppress) {
        console.log(`Skipping suppressed feature ${i}`, { ...feature })
        return
      }

      console.log(`Compiling feature ${i}`, { ...feature })

      // Create feature placeholder
      const featurePlaceholderObject = createObject({
        name: `feature${i}`
      })
      livePart.add(featurePlaceholderObject)

      // Run feature
      const mesh = await this.processFeature(feature, { featurePlaceholderObject, livePart, features }) || {}

      // Add to the livePart, so upcoming feature can use the mesh
      if (mesh) {
        featurePlaceholderObject.add(mesh)
        // livePart.add(mesh)
      }

      // Mutate richFeatures
      richFeatures[i]._mesh = featurePlaceholderObject
    })

    console.log('richFeatures', richFeatures)

    // # Give the object3d a nice name
    // livePart.name = slugify(cadData.name) || slugify(cadData.title) || 'unnamed'
    // livePart.name = 'features'

    // Expose scene features
    this.features = features

    return livePart
  }
}

// Factory function
export function create (args) {
  return new ParametricJs(args)
}

// Expose to window
// window.ParametricJs = ParametricJs

export default ParametricJs
