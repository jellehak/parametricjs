import { slugify } from './helpers/slugify'
import * as features from './features'
import ThreeBSP from './helpers/ThreeCSG.js'
import { setup } from './setup'
import PathToShape from './helpers/PathToShape'

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

// Compiler
const compileParameters = (parameters = []) => {
  const compiled = ''

  const code = parameters || [].map((elem, key) => {
    const value = parameters[key]
    return `let ${key} = ${value};`
  }).join('\n')

  // cache compiled parameters
  // cadData._parameters = compiled // || "height=10;width=3;thickness=1";

  // Return
  return compiled
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
    this.version = '0.0.1'
    // Register basic features
    this.featureHandlers = Object.values(features)
    this.featureHandlersLookup = { ...features }

    // Globals plugins
    this.ThreeBSP = ThreeBSP

    // Eagerly init scene ?
    const { scene, camera, controls } = setup(options)
    this.scene = scene
    this.camera = camera
    this.controls = controls
  }

  processFeature (features = [], feature = {}, previousState = {}) {
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

      // Object.assign(component, feature)
      // Set properties
      Object.assign(this, defaults, feature)
      // this.entities = ['cutsketch'] // MOCK

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

    // Set context for handler
    const payload = {
      ...this,
      feature,
      THREE,
      previousState,
      PathToShape,
      getFeatureHandlerById: getFeatureHandlerById(features),
      compile: () => {
        // TODO
      },
      getFeatureById: (id) => {
        const found = features.find((elem) => { return elem.id === id })
        if (!found) {
          console.warn(features)
          throw new Error(`Could not find feature by id: ${id}`)
        }
        return found
      }
    }

    // Call handler fn
    const mesh = renderFn(payload, previousState) || {}
    // mesh.name = mesh.name || type
    return mesh || false
  }

  render (cadData = {}) {
    if (!cadData) { return console.warn('No CadData') }

    // Create Object3D
    const livePart = new THREE.Object3D()

    // Compile global cad parameters (adds cadData._parameters)
    compileParameters(cadData)

    // Process each feature
    const { features = [] } = cadData
    features.map((feature, key) => {
      // Skip suppress features
      if (feature.suppress) {
        return
      }

      // Run feature
      const { mesh } = this.processFeature(features, feature, livePart) || {}

      // Mutate the livePart, so upcoming feature can use the mesh
      if (mesh) {
        livePart.add(mesh)
      }
    })

    // Give the object3d a nice name
    livePart.name = slugify(cadData.name) || slugify(cadData.title) || 'unnamed'

    return livePart
  }
}

// Factory function
export function create (args) {
  return new ParametricJs(args)
}

// Expose to window
window.ParametricJs = ParametricJs
